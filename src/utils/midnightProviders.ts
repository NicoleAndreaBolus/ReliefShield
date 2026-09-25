import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { fromHex } from '@midnight-ntwrk/compact-runtime';
import { RELIEF_SHIELD_CONTRACT_CONFIG, PREPROD_CONTRACT_CONFIG } from './contract';

/**
 * Browser-compatible ZKConfigProvider that fetches prover keys, verifier keys,
 * and ZKIR assets over HTTP from the application's public assets directory.
 * Implements the structural ZKConfigProvider interface without inheriting from
 * midnight-js-types (avoiding ESM circular dependency / undefined class extension in browser bundles).
 */
export class FetchZkConfigProvider {
  private baseUrl: string;

  constructor(baseUrl: string = '/reliefshield') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getProverKey(circuitId: string): Promise<Uint8Array> {
    const res = await fetch(`${this.baseUrl}/keys/${circuitId}.prover`);
    if (!res.ok) {
      throw new Error(`Failed to fetch prover key for ${circuitId}: ${res.status} ${res.statusText}`);
    }
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  async getVerifierKey(circuitId: string): Promise<Uint8Array> {
    const res = await fetch(`${this.baseUrl}/keys/${circuitId}.verifier`);
    if (!res.ok) {
      throw new Error(`Failed to fetch verifier key for ${circuitId}: ${res.status} ${res.statusText}`);
    }
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  async getVerifierKeys(circuitIds: string[]): Promise<[string, Uint8Array][]> {
    return Promise.all(
      circuitIds.map(async (circuitId) => [circuitId, await this.getVerifierKey(circuitId)])
    );
  }

  async getZKIR(circuitId: string): Promise<Uint8Array> {
    // Attempt .bzkir first, fall back to .zkir
    let res = await fetch(`${this.baseUrl}/zkir/${circuitId}.bzkir`);
    if (!res.ok) {
      res = await fetch(`${this.baseUrl}/zkir/${circuitId}.zkir`);
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch ZKIR for ${circuitId}: ${res.status} ${res.statusText}`);
    }
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }
}

/**
 * Assembles official MidnightProviders for the browser:
 * - httpClientProofProvider (official Midnight ledger proof server)
 * - levelPrivateStateProvider (official level-backed private state with browser storage)
 * - indexerPublicDataProvider (official Midnight GraphQL Indexer)
 * - FetchZkConfigProvider (official ZK artifacts provider)
 * - walletProvider & midnightProvider (bridged to Midnight Lace DApp Connector API)
 */
export async function createBrowserProviders(apiInstance: any, network: 'preview' | 'preprod') {
  const activeConfig = network === 'preprod' ? PREPROD_CONTRACT_CONFIG : RELIEF_SHIELD_CONTRACT_CONFIG;
  const zkConfigProvider = new FetchZkConfigProvider('/reliefshield');

  // 1. Official HTTP Client Proof Provider
  const proofProvider = httpClientProofProvider(activeConfig.proofServerUrl, zkConfigProvider as any);

  // 2. Official Indexer Public Data Provider
  const indexerWs = activeConfig.indexerUrl.replace(/^http/, 'ws');
  const publicDataProvider = indexerPublicDataProvider(activeConfig.indexerUrl, indexerWs);

  // 3. Resolve user address from Lace
  let userAddress = '';
  try {
    const addrObj = await apiInstance?.getUnshieldedAddress?.();
    userAddress = addrObj?.unshieldedAddress || '';
  } catch {}

  // 4. Official Level Private State Provider
  const privateStateProvider = levelPrivateStateProvider({
    privateStateStoreName: 'reliefshield-private-state',
    accountId: userAddress || 'reliefshield-donor-account',
    privateStoragePasswordProvider: () => 'ReliefShield-Private-State-Storage-Key-1234',
  });

  // 5. Resolve user keys from Lace
  let shieldedInfo: any = null;
  try {
    shieldedInfo = await apiInstance?.getShieldedAddresses?.();
  } catch (err) {
    console.warn('[Lace] getShieldedAddresses warning:', err);
  }

  const coinPublicKeyBytes = shieldedInfo?.coinPublicKey
    ? fromHex(shieldedInfo.coinPublicKey.replace(/^0x/, ''))
    : new Uint8Array(32);

  const encPublicKeyBytes = shieldedInfo?.encryptionPublicKey
    ? fromHex(shieldedInfo.encryptionPublicKey.replace(/^0x/, ''))
    : new Uint8Array(32);

  // 6. Wallet Provider & Midnight Provider bridged to Lace ConnectedAPI
  const walletProvider = {
    getCoinPublicKey: () => coinPublicKeyBytes as any,
    getEncryptionPublicKey: () => encPublicKeyBytes as any,
    balanceTx: async (tx: any) => {
      console.log('[Lace] Balancing unsealed contract transaction in Lace wallet...');
      if (typeof apiInstance?.balanceUnsealedTransaction === 'function') {
        const payload = typeof tx === 'string' ? tx : JSON.stringify(tx);
        const balanced = await apiInstance.balanceUnsealedTransaction(payload, { payFees: true });
        return balanced?.tx || balanced;
      }
      return tx;
    },
    submitTx: async (tx: any) => {
      console.log('[Lace] Submitting contract transaction through Lace relayer...');
      if (typeof apiInstance?.submitTransaction === 'function') {
        const payload = typeof tx === 'string' ? tx : JSON.stringify(tx);
        await apiInstance.submitTransaction(payload);
        return payload;
      }
      throw new Error('Lace submitTransaction API is unavailable');
    },
  };

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider: walletProvider,
  };
}
