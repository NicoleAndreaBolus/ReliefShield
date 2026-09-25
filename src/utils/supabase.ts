import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return String(import.meta.env[key]);
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]);
  }
  return '';
};

const rawUrl = getEnv('VITE_SUPABASE_URL').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Record donation metadata in Supabase for UI history & application activity.
 * Supabase does NOT store or manufacture authoritative blockchain state;
 * the authoritative totalReliefPool is read directly from the Midnight contract indexer.
 */
export async function recordGlobalDonation(
  network: 'preview' | 'preprod',
  amount: number,
  txHash: string
): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from('donations').insert({
      network,
      amount,
      tx_hash: txHash,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to log donation metadata:', err);
  }
}

export interface GlobalDonation {
  id?: string;
  network: string;
  amount: number;
  tx_hash: string;
  created_at: string;
}

/**
 * Fetch the list of recent on-chain donations from Supabase
 */
export async function fetchRecentDonations(
  network: 'preview' | 'preprod' = 'preview',
  limit: number = 10
): Promise<GlobalDonation[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('network', network)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('[Supabase] Error reading donations:', error.message);
      return [];
    }

    const rows = (data || []) as GlobalDonation[];
    return rows.filter((r) => !r.tx_hash.startsWith('0xfe34') && !r.tx_hash.startsWith('0x5e2a'));
  } catch (err) {
    console.warn('[Supabase] Failed to fetch donations:', err);
    return [];
  }
}
