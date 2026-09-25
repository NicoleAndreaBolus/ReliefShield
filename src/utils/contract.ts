import deployments from '../deployments.json';
import { StateValue, fromHex } from '@midnight-ntwrk/compact-runtime';
import { ledger } from '../../contracts/managed/reliefshield/contract/index.js';

export interface ContractConfig {
  contractAddress: string;
  treasuryAddress: string;
  network: 'preview' | 'preprod';
  proofServerUrl: string;
  indexerUrl: string;
}

/**
 * Dynamically resolves deployed contract address from public deployment records or env overrides
 */
export function getDeployedContractAddress(network: 'preview' | 'preprod' = 'preview'): string {
  const envAddress = network === 'preprod'
    ? (import.meta.env?.VITE_PREPROD_CONTRACT_ADDRESS as string)
    : (import.meta.env?.VITE_CONTRACT_ADDRESS as string);

  if (envAddress && envAddress.trim().length > 0) {
    return envAddress.trim();
  }

  const record = (deployments as any)?.[network];
  if (record?.address) {
    return record.address;
  }

  return network === 'preprod'
    ? '2c8a91f54d0be7e91408a2df9c6e5204b78a9c3140df8e427189c43e9a01f58b'
    : '9691171cd279c8c97b6360cb76d7604dc397ec324fb9592c3047cbc34481e25a';
}

export const RELIEF_SHIELD_CONTRACT_CONFIG: ContractConfig = {
  get contractAddress() {
    return getDeployedContractAddress('preview');
  },
  treasuryAddress: 'mn_addr_preview1j3wddjr08funglalkectwpfv5fdr6p9c9qsce9em0qch27p0z5gsqtkdgd',
  network: 'preview',
  proofServerUrl: 'http://127.0.0.1:6300',
  indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
};

export const PREPROD_CONTRACT_CONFIG: ContractConfig = {
  get contractAddress() {
    return getDeployedContractAddress('preprod');
  },
  treasuryAddress: 'mn_addr_preprod1cd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpaswh0',
  network: 'preprod',
  proofServerUrl: 'http://127.0.0.1:6300',
  indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
};

/**
 * Format raw contract address into shortened readable display
 */
export function formatAddress(address: string, prefixLen = 8, suffixLen = 6): string {
  if (!address) return '';
  if (address.length <= prefixLen + suffixLen) return address;
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}

/**
 * Query live contract state directly from the Midnight GraphQL Indexer
 */
export async function queryIndexerContractState(
  address?: string,
  network: 'preview' | 'preprod' = 'preview'
): Promise<{ state: string | null; error?: string }> {
  const targetAddress = address || getDeployedContractAddress(network);
  const indexerEndpoint = network === 'preview' 
    ? RELIEF_SHIELD_CONTRACT_CONFIG.indexerUrl 
    : PREPROD_CONTRACT_CONFIG.indexerUrl;

  const query = `
    query CONTRACT_STATE_QUERY($address: HexEncoded!) {
      contractAction(address: $address) {
        state
      }
    }
  `;

  try {
    const res = await fetch(indexerEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { address: targetAddress }
      }),
    });

    if (!res.ok) {
      throw new Error(`Indexer responded with status ${res.status}`);
    }

    const json = await res.json();
    const rawState = json?.data?.contractAction?.state ?? null;
    return { state: rawState };
  } catch (err: any) {
    console.warn(`[Indexer] Query failed for ${network}:`, err?.message);
    return { state: null, error: err?.message };
  }
}

/**
 * Read totalReliefPool directly from the Midnight indexer.
 * Uses genuine StateValue decoding and Compact contract ledger state.
 * Returns null if the indexer is unavailable or contract state is not found,
 * allowing the UI to present a genuine error or stale indicator rather than inventing ledger state.
 */
export async function readTotalReliefPoolFromIndexer(
  address?: string,
  network: 'preview' | 'preprod' = 'preview'
): Promise<{ pool: number | null; isStale: boolean; error?: string }> {
  const targetAddress = address || getDeployedContractAddress(network);
  try {
    const { state, error } = await queryIndexerContractState(targetAddress, network);
    if (error || !state) {
      return {
        pool: null,
        isStale: true,
        error: error || 'Contract state not found on Midnight indexer',
      };
    }

    const hex = state.replace(/^0x/, '');
    const bytes = fromHex(hex);
    
    let poolVal: number | null = null;
    try {
      const onchain = await import('@midnight-ntwrk/onchain-runtime-v3');
      const cs = onchain.ContractState.deserialize(bytes);
      const decodedLedger = ledger(cs.data);
      poolVal = Number(decodedLedger.totalReliefPool);
    } catch {
      const stateValue = StateValue.decode(bytes);
      const decodedLedger = ledger(stateValue);
      poolVal = Number(decodedLedger.totalReliefPool);
    }

    if (!isNaN(poolVal) && poolVal >= 0) {
      return { pool: poolVal, isStale: false };
    }
    return {
      pool: null,
      isStale: true,
      error: 'Invalid pool state decoded from ledger',
    };
  } catch (err: any) {
    console.warn('[Indexer] Could not parse totalReliefPool:', err);
    return {
      pool: null,
      isStale: true,
      error: err?.message || 'Failed to read totalReliefPool from indexer',
    };
  }
}

/**
 * Validates whether the provided witness amount satisfies ZK circuit constraints
 */
export function validateWitnessConstraints(
  secretAmount: number,
  userBalance: number
): { valid: boolean; error?: string } {
  if (isNaN(secretAmount) || secretAmount <= 0) {
    return { valid: false, error: 'Contribution amount must be a positive number.' };
  }
  if (secretAmount > userBalance) {
    return { valid: false, error: 'Insufficient wallet balance for this shielded contribution.' };
  }
  return { valid: true };
}

/**
 * Fetch the current tip block height from the Midnight GraphQL Indexer
 */
export async function getCurrentBlockHeight(
  network: 'preview' | 'preprod' = 'preview'
): Promise<number> {
  const indexerEndpoint = network === 'preview' 
    ? RELIEF_SHIELD_CONTRACT_CONFIG.indexerUrl 
    : PREPROD_CONTRACT_CONFIG.indexerUrl;
  try {
    const res = await fetch(indexerEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ block { height } }' })
    });
    const json = await res.json();
    return json?.data?.block?.height || 0;
  } catch (err) {
    console.warn('[Indexer] Could not fetch current block height:', err);
    return 0;
  }
}

/**
 * Automatically detect an on-chain donation by querying recent blocks on the Midnight Indexer.
 * Matches when CreatedOutputs contains the treasury address with the expected donation amount.
 */
export async function detectLatestOnChainDonation(
  treasuryAddress: string,
  amountTokens: number,
  startHeight?: number,
  network: 'preview' | 'preprod' = 'preview',
  maxPollAttempts: number = 12
): Promise<{ hash: string; blockHeight: number } | null> {
  const indexerEndpoint = network === 'preview' 
    ? RELIEF_SHIELD_CONTRACT_CONFIG.indexerUrl 
    : PREPROD_CONTRACT_CONFIG.indexerUrl;
  
  const expectedMicroUnits = String(Math.round(amountTokens * 1_000_000));

  try {
    let currentTip = startHeight || await getCurrentBlockHeight(network);
    if (!currentTip) return null;

    const minHeight = Math.max(1, currentTip - 3);

    for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
      const latestTip = (await getCurrentBlockHeight(network)) || currentTip;

      // Scan from newest block back to minHeight
      for (let h = latestTip; h >= minHeight; h--) {
        const blkRes = await fetch(indexerEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query {
                block(offset: { height: ${h} }) {
                  height
                  transactions {
                    hash
                    ... on RegularTransaction {
                      unshieldedCreatedOutputs {
                        owner
                        value
                      }
                    }
                  }
                }
              }
            `
          })
        });
        const blkJson = await blkRes.json();
        const txs = blkJson.data?.block?.transactions || [];
        for (const tx of txs) {
          const match = (tx.unshieldedCreatedOutputs || []).some(
            (out: any) => {
              const cleanOutOwner = String(out.owner || '').replace(/^0x/, '').toLowerCase();
              const cleanTreasury = String(treasuryAddress || '').replace(/^0x/, '').toLowerCase();
              const ownerMatch = cleanOutOwner === cleanTreasury;
              const valueMatch =
                String(out.value) === expectedMicroUnits ||
                String(out.value) === String(amountTokens) ||
                Number(out.value) === Number(expectedMicroUnits) ||
                Number(out.value) === Number(amountTokens);
              return ownerMatch && valueMatch;
            }
          );
          if (match) {
            const cleanHash = tx.hash.startsWith('0x') ? tx.hash : `0x${tx.hash}`;
            return { hash: cleanHash, blockHeight: h };
          }
        }
      }

      // Wait 2.5s before checking the next block if not found yet
      if (attempt < maxPollAttempts - 1) {
        await new Promise((r) => setTimeout(r, 2500));
      }
    }

    return null;
  } catch (err) {
    console.warn('[AutoDetector] Failed to detect on-chain donation:', err);
    return null;
  }
}
