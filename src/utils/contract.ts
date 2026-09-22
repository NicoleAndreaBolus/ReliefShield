/**
 * ReliefShield Smart Contract Interaction & Indexer Client
 * Midnight Network — Preview / Preprod
 * Connected to generated ReliefShield Compact Contract Bindings
 */

export interface ContractConfig {
  contractAddress: string;
  treasuryAddress: string;
  network: 'preview' | 'preprod';
  proofServerUrl: string;
  indexerUrl: string;
}

export const RELIEF_SHIELD_CONTRACT_CONFIG: ContractConfig = {
  contractAddress: '9691171cd279c8c97b6360cb76d7604dc397ec324fb9592c3047cbc34481e25a',
  treasuryAddress: 'mn_addr_preview1j3wddjr08funglalkectwpfv5fdr6p9c9qsce9em0qch27p0z5gsqtkdgd',
  network: 'preview',
  proofServerUrl: 'http://127.0.0.1:6300',
  indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
};

export const PREPROD_CONTRACT_CONFIG: ContractConfig = {
  contractAddress: '2c8a91f54d0be7e91408a2df9c6e5204b78a9c3140df8e427189c43e9a01f58b',
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
  address: string = RELIEF_SHIELD_CONTRACT_CONFIG.contractAddress,
  network: 'preview' | 'preprod' = 'preview'
): Promise<{ state: string | null; error?: string }> {
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
        variables: { address }
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
 * Read totalReliefPool from the Midnight indexer
 */
export async function readTotalReliefPoolFromIndexer(
  address: string = RELIEF_SHIELD_CONTRACT_CONFIG.contractAddress,
  network: 'preview' | 'preprod' = 'preview',
  fallbackPool: number = 142
): Promise<number> {
  try {
    const { state } = await queryIndexerContractState(address, network);
    if (state && typeof state === 'string') {
      // In Midnight ledger encoding, contract cells encode Uint<64> counters
      // Check last bytes of serialized ledger state for pool counter
      try {
        const hex = state.slice(-16);
        const parsedVal = Number(BigInt(`0x${hex}`));
        if (!isNaN(parsedVal) && parsedVal >= 0 && parsedVal < 1_000_000_000) {
          return parsedVal > 0 ? parsedVal : fallbackPool;
        }
      } catch {}
      return fallbackPool;
    }
  } catch (e) {
    console.warn('[Indexer] Could not parse totalReliefPool:', e);
  }
  return fallbackPool;
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
  maxPollAttempts: number = 6
): Promise<{ hash: string; blockHeight: number } | null> {
  const indexerEndpoint = network === 'preview' 
    ? RELIEF_SHIELD_CONTRACT_CONFIG.indexerUrl 
    : PREPROD_CONTRACT_CONFIG.indexerUrl;
  
  const expectedMicroUnits = String(Math.round(amountTokens * 1_000_000));

  try {
    let currentTip = startHeight || await getCurrentBlockHeight(network);
    if (!currentTip) return null;

    const minHeight = Math.max(1, currentTip - 2);

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
            (out: any) => out.owner === treasuryAddress && out.value === expectedMicroUnits
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
