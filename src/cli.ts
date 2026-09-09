/**
 * CLI for interacting with ReliefShield Zero-Knowledge contract on Midnight Network
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';
import crypto from 'node:crypto';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateWallet, formatWalletBackupNotice, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'reliefshieldPrivateState';

const { network, config: networkConfig } = resolveNetwork();
const WALLET = getOrCreateWallet(network);
const SEED = WALLET.seed;
{
  const notice = formatWalletBackupNotice(WALLET, network);
  if (notice) console.log(notice);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'reliefshield');

// Load compiled contract
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const ReliefShield = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('reliefshield', ReliefShield.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

// ─── Providers ─────────────────────────────────────────────────────────────────

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'reliefshield-private-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log(`║  ReliefShield CLI (${network})`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    const deployment = getDeployment(network);
    if (!deployment?.address) {
      console.error(`\n❌ No deployment found for network "${network}".`);
      console.error('   Run: npm run deploy\n');
      process.exit(1);
    }

    console.log(`  Contract Address: ${deployment.address}`);
    console.log(`  Deployed by:      ${deployment.deployer || 'unknown'}\n`);

    console.log('  Connecting wallet...');
    const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
    const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
    if (restoredCount > 0) {
      console.log(`  Restored ${restoredCount}/3 child wallets from .midnight-wallet-state.`);
    }

    console.log('  Syncing with network...');
    const syncStart = Date.now();
    const syncInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - syncStart) / 1000);
      process.stdout.write(`\r  ⏳ Still syncing... (${elapsed}s elapsed)   `);
    }, 5000);
    const state = await walletCtx.wallet.waitForSyncedState();
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Synced with network.                                      \n');

    await persistWalletState(network, walletCtx);
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

    if (balance === 0n && network !== 'undeployed' && networkConfig.faucet) {
      const address = walletCtx.unshieldedKeystore.getBech32Address();
      console.log('  ⚠ Wallet has no tNight. Fund it from the faucet to send transactions:');
      console.log(`     ${networkConfig.faucet}`);
      console.log(`     Wallet address: ${address}\n`);
    }

    console.log('  Setting up ZK providers and connecting to ReliefShield contract...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Connected to ReliefShield contract!\n');

    let running = true;
    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Donate shielded relief funds (donateShielded circuit)');
      console.log('  2. Read total relief pool & on-chain state (Indexer)');
      console.log('  3. Reset relief pool (Admin authorization circuit)');
      console.log('  4. Check wallet balance');
      console.log('  5. Exit\n');

      const choice = await rl.question('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          const rawAmount = await rl.question('  Enter shielded contribution amount ($tNIGHT): ');
          const amount = BigInt(rawAmount.trim());
          if (amount <= 0n) {
            console.log('  ❌ Amount must be greater than 0.');
            break;
          }

          // Generate 32-byte cryptographic nullifier salt
          const secretNonce = crypto.randomBytes(32);

          console.log('\n  Generating local Compact ZK proof for private witness...');
          console.log('  Submitting shielded transaction to Midnight network (30-60s)...');
          try {
            const tx = await deployed.callTx.donateShielded(amount, new Uint8Array(secretNonce));
            console.log(`\n  ✅ Shielded donation accepted!`);
            console.log(`  Amount: ${amount} tNIGHT`);
            console.log(`  Nullifier: 0x${secretNonce.toString('hex')}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Donation circuit execution failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '2': {
          console.log('\n  Querying on-chain state from Midnight Indexer...');
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (contractState) {
              const ledgerState = ReliefShield.ledger(contractState.data);
              const pool = ledgerState.totalReliefPool;
              const adminHex = Buffer.from(ledgerState.admin).toString('hex');
              const nullifierCount = ledgerState.nullifiers?.size ? ledgerState.nullifiers.size() : 0n;

              console.log(`\n  📋 Current ReliefShield Ledger State:`);
              console.log(`     Total Relief Pool: ${pool} tNIGHT`);
              console.log(`     Admin Key Hash:    0x${adminHex}`);
              console.log(`     Active Nullifiers: ${nullifierCount}\n`);
            } else {
              console.log('\n  📋 No contract state found on indexer.\n');
            }
          } catch (error) {
            console.error('\n  ❌ Query failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '3': {
          const rawNewValue = await rl.question('  Enter new pool target value: ');
          const newValue = BigInt(rawNewValue.trim());

          console.log('\n  Using deployer admin key credentials...');
          const adminKey = new Uint8Array(32);
          const pubKeyData = walletCtx.shieldedSecretKeys.coinPublicKey?.data ?? walletCtx.unshieldedKeystore.getPublicKey()?.data;
          if (pubKeyData) {
            adminKey.set(pubKeyData.slice(0, 32));
          }

          console.log('  Submitting admin resetPool transaction...');
          try {
            const tx = await deployed.callTx.resetPool(adminKey, newValue);
            console.log(`\n  ✅ Pool reset successfully to ${newValue} tNIGHT!`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Admin reset failed (unauthorized or proof error):', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '4': {
          console.log('\n  Checking balance...');
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST:   ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '5':
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-5.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
