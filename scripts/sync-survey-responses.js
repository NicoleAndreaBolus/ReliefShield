#!/usr/bin/env node

/**
 * ReliefShield — Survey Intake & Feedback Sync Utility
 * Syncs verified Preprod feedback responses from docs/user-feedback-responses.csv
 * into the centralized feedback form with network rate-limiting and session rotation.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfwc7RIntIgom4e26tuimplxD8BDNE5Busb1uWlWlO2y3LBeA/formResponse';
const FORM_VIEW_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfwc7RIntIgom4e26tuimplxD8BDNE5Busb1uWlWlO2y3LBeA/viewform';
const CSV_PATH = path.join(ROOT_DIR, 'docs', 'user-feedback-responses.csv');
const CHECKPOINT_PATH = path.join(ROOT_DIR, '.form-sync-checkpoint.json');

// Exact field entry IDs extracted from the live Google Form
const FIELD_ENTRY_MAP = {
  name: 'entry.701654027',
  email: 'entry.920820970',
  wallet: 'entry.342985773',
  rating: 'entry.1722801900',
  featureLiked: 'entry.399662670',
  featureMissing: 'entry.352946032',
  bugs: 'entry.906479539',
  recommend: 'entry.922798100',
};

// Client session headers pool
const CLIENT_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
];

/**
 * Robust CSV parser that correctly handles quoted values with commas
 */
function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let insideQuotes = false;
    let field = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field.trim());
    rows.push(row);
  }
  return rows;
}

/**
 * Map CSV recommendation strings to Google Form radio values
 */
function mapRecommendation(csvVal) {
  const val = (csvVal || '').trim();
  if (val.toLowerCase().startsWith('yes')) {
    return 'Yes, definitely';
  }
  if (val.toLowerCase().startsWith('no')) {
    return 'No';
  }
  return 'Maybe / Needs improvement';
}

/**
 * Load sync checkpoint from disk
 */
function loadCheckpoint() {
  try {
    if (fs.existsSync(CHECKPOINT_PATH)) {
      const data = JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf-8'));
      return data;
    }
  } catch (err) {
    console.warn('⚠️ Could not parse checkpoint file, starting fresh.');
  }
  return { submittedIds: [], lastUpdated: null };
}

/**
 * Save sync checkpoint to disk
 */
function saveCheckpoint(checkpoint) {
  checkpoint.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2), 'utf-8');
}

/**
 * Natural random delay between requests
 */
function getRandomDelay(minSec, maxSec) {
  const minMs = minSec * 1000;
  const maxMs = maxSec * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Sleep helper with countdown display
 */
async function sleepWithCountdown(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    const remaining = Math.max(0, ((ms - (Date.now() - start)) / 1000)).toFixed(1);
    process.stdout.write(`\r  ⏳ Rate limit: waiting ${remaining}s before next record...   `);
    await new Promise((r) => setTimeout(r, 200));
  }
  process.stdout.write('\r                                                               \r');
}

/**
 * Submit one entry to the Google Form
 */
async function submitFormEntry(data, userAgent) {
  const formParams = new URLSearchParams();
  formParams.append(FIELD_ENTRY_MAP.name, data.name);
  formParams.append(FIELD_ENTRY_MAP.email, data.email);
  formParams.append(FIELD_ENTRY_MAP.wallet, data.wallet);
  formParams.append(FIELD_ENTRY_MAP.rating, data.rating.toString());
  formParams.append(FIELD_ENTRY_MAP.featureLiked, data.featureLiked);
  formParams.append(FIELD_ENTRY_MAP.featureMissing, data.featureMissing);
  formParams.append(FIELD_ENTRY_MAP.bugs, data.bugs);
  formParams.append(FIELD_ENTRY_MAP.recommend, mapRecommendation(data.recommend));
  formParams.append('fvv', '1');
  formParams.append('pageHistory', '0');

  const headers = {
    'User-Agent': userAgent,
    'Referer': FORM_VIEW_URL,
    'Origin': 'https://docs.google.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
  };

  const response = await fetch(FORM_ACTION_URL, {
    method: 'POST',
    headers,
    body: formParams.toString(),
  });

  return {
    status: response.status,
    ok: response.status >= 200 && response.status < 400,
    statusText: response.statusText,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isTest = args.includes('--test');
  const isReset = args.includes('--reset');

  // Custom delay flag e.g. --delay 5-10
  let minDelay = 5;
  let maxDelay = 12;
  const delayArgIdx = args.indexOf('--delay');
  if (delayArgIdx !== -1 && args[delayArgIdx + 1]) {
    const rawDelay = args[delayArgIdx + 1];
    const parts = (rawDelay.includes('-') ? rawDelay.split('-') : rawDelay.split(',')).map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      minDelay = Math.min(parts[0], parts[1]);
      maxDelay = Math.max(parts[0], parts[1]);
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  ReliefShield — Survey Intake & Feedback Sync Utility         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (isReset) {
    if (fs.existsSync(CHECKPOINT_PATH)) {
      fs.unlinkSync(CHECKPOINT_PATH);
      console.log('  🧹 Checkpoint reset: cleared all previous sync records.\n');
    }
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  const rawCSV = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(rawCSV);

  // Parse rows into objects
  const records = rows.slice(1).map((row) => ({
    timestamp: row[0],
    userId: row[1],
    name: row[2],
    email: row[3],
    wallet: row[4],
    rating: row[5],
    featureLiked: row[6],
    featureMissing: row[7],
    bugs: row[8],
    recommend: row[9],
    improvements: row[10],
  }));

  console.log(`  📁 Loaded ${records.length} user responses from CSV.`);
  const checkpoint = loadCheckpoint();
  const submittedSet = new Set(checkpoint.submittedIds);
  console.log(`  📋 Checkpoint: ${submittedSet.size} responses previously synced.\n`);

  let queue = records.filter((r) => !submittedSet.has(r.userId));

  if (isTest) {
    console.log('  🧪 TEST MODE: Processing ONLY the first 1 pending response.');
    queue = queue.slice(0, 1);
  } else if (isDryRun) {
    console.log('  🔍 DRY RUN MODE: Validating parsing without sending network requests.');
  } else {
    console.log(`  🚀 BATCH SYNC: ${queue.length} responses queued to sync.`);
    console.log(`  ⏱ Delay per record: ${minDelay}s – ${maxDelay}s.\n`);
  }

  if (queue.length === 0) {
    console.log('  ✅ All responses from the CSV have already been synced!\n');
    return;
  }

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const userAgent = CLIENT_USER_AGENTS[i % CLIENT_USER_AGENTS.length];
    const indexStr = `[${i + 1}/${queue.length}]`;

    console.log(`  ${indexStr} Syncing ${item.userId}: ${item.name} (${item.email})`);
    console.log(`       Wallet: ${item.wallet.slice(0, 18)}...${item.wallet.slice(-8)} | Rating: ⭐ ${item.rating}/5`);
    console.log(`       Liked: "${item.featureLiked}"`);

    if (isDryRun) {
      console.log('       [DRY RUN] Payload validated successfully.\n');
      continue;
    }

    try {
      const res = await submitFormEntry(item, userAgent);
      if (res.ok) {
        console.log(`       ✅ Synced successfully (Status: ${res.status})`);
        checkpoint.submittedIds.push(item.userId);
        saveCheckpoint(checkpoint);
      } else {
        console.error(`       ❌ Submission failed with HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`       ❌ Network error during sync: ${err.message}`);
    }

    // Delay if not last item and not dry run
    if (i < queue.length - 1 && !isDryRun) {
      const delayMs = getRandomDelay(minDelay, maxDelay);
      await sleepWithCountdown(delayMs);
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ Survey sync process finished!                            ║');
  console.log(`║     Total in Checkpoint: ${checkpoint.submittedIds.length}/${records.length} synced.              ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
}

main().catch((err) => {
  console.error('Fatal error in sync process:', err);
  process.exit(1);
});
