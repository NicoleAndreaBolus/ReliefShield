import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fromHex } from '@midnight-ntwrk/compact-runtime';
import { Transaction } from '@midnight-ntwrk/ledger-v8';
import { RELIEF_SHIELD_CONTRACT_CONFIG, PREPROD_CONTRACT_CONFIG } from './contract';

/**
 * Browser-compatible ZKConfigProvider that fetches prover keys, verifier keys,
 * and ZKIR assets over HTTP from the application's public assets directory.
 * Implements the structural ZKConfigProvider interface without inheriting from
 * midnight-js-types (avoiding ESM circular dependency in browser bundles).
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
 * Browser-native PrivateStateProvider that securely manages private state
 * and contract signing keys in browser storage without Node.js level/events dependencies.
 */
export class BrowserPrivateStateProvider {
  private contractAddress: string = '';

  setContractAddress(address: string): void {
    this.contractAddress = address;
  }

  async get(key: string): Promise<any | null> {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(`rs_ps_${this.contractAddress}_${key}`);
    return item ? JSON.parse(item) : null;
  }

  async set(key: string, state: any): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rs_ps_${this.contractAddress}_${key}`, JSON.stringify(state));
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`rs_ps_${this.contractAddress}_${key}`);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    const prefix = `rs_ps_${this.contractAddress}_`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) localStorage.removeItem(k);
    }
  }

  async getSigningKey(address: string): Promise<any | null> {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(`rs_sk_${address}`);
    return item ? JSON.parse(item) : null;
  }

  async setSigningKey(address: string, signingKey: any): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rs_sk_${address}`, JSON.stringify(signingKey));
    }
  }

  async removeSigningKey(address: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`rs_sk_${address}`);
    }
  }

  async clearSigningKeys(): Promise<void> {
    if (typeof window === 'undefined') return;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('rs_sk_')) localStorage.removeItem(k);
    }
  }
}

/**
 * Assembles official MidnightProviders for the browser:
 * - httpClientProofProvider (official Midnight ledger proof server)
 * - BrowserPrivateStateProvider (browser-native storage-backed private state provider)
 * - indexerPublicDataProvider (official Midnight GraphQL Indexer)
 * - FetchZkConfigProvider (official ZK artifacts provider)
 * - walletProvider & midnightProvider (bridged to Midnight Lace DApp Connector API)
 */
export async function createBrowserProviders(apiInstance: any, network: 'preview' | 'preprod') {
  // 1. Ensure global Midnight network ID is configured before any operation
  try {
    const config = await apiInstance?.getConfiguration?.();
    if (config?.networkId) {
      setNetworkId(config.networkId);
      console.log(`[ReliefShield ZK] Set network ID from wallet config: ${config.networkId}`);
    } else {
      setNetworkId(network);
      console.log(`[ReliefShield ZK] Set network ID: ${network}`);
    }
  } catch {
    setNetworkId(network);
    console.log(`[ReliefShield ZK] Fallback network ID: ${network}`);
  }

  const activeConfig = network === 'preprod' ? PREPROD_CONTRACT_CONFIG : RELIEF_SHIELD_CONTRACT_CONFIG;
  const zkConfigProvider = new FetchZkConfigProvider('/reliefshield');

  // 2. Official HTTP Client Proof Provider
  const proofProvider = httpClientProofProvider(activeConfig.proofServerUrl, zkConfigProvider as any);

  // 3. Official Indexer Public Data Provider
  const indexerWs = activeConfig.indexerUrl.replace(/^http/, 'ws');
  const publicDataProvider = indexerPublicDataProvider(activeConfig.indexerUrl, indexerWs);

  // 4. Browser-native Private State Provider
  const privateStateProvider = new BrowserPrivateStateProvider();

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
        let payload: string;
        if (typeof tx === 'string') {
          payload = tx;
        } else if (tx && typeof tx.serialize === 'function') {
          const bytes = tx.serialize();
          payload = Array.from(bytes).map((b: number) => b.toString(16).padStart(2, '0')).join('');
        } else {
          throw new Error('Transaction provided to balanceTx does not support serialization');
        }
        const balanced = await apiInstance.balanceUnsealedTransaction(payload, { payFees: true });
        const balancedHex = balanced?.tx || (typeof balanced === 'string' ? balanced : null);
        if (balancedHex) {
          try {
            const rawBytes = fromHex(balancedHex.replace(/^0x/, ''));
            const finalizedTx = Transaction.deserialize('signature', 'proof', 'binding', rawBytes);
            return finalizedTx;
          } catch (deserErr) {
            console.warn('[Lace] FinalizedTransaction deserialization notice:', deserErr);
            return balanced?.tx ? balanced.tx : balanced;
          }
        }
        return balanced;
      }
      return tx;
    },
    submitTx: async (tx: any) => {
      console.log('[Lace] Submitting contract transaction through Lace relayer...');
      if (typeof apiInstance?.submitTransaction === 'function') {
        let payload: string;
        let txId: string = '';
        if (typeof tx === 'string') {
          payload = tx;
          if (payload.length > 64) {
            try {
              const raw = fromHex(payload.replace(/^0x/, ''));
              const hashBuf = await crypto.subtle.digest('SHA-256', raw);
              txId = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
            } catch {}
          } else {
            txId = payload;
          }
        } else if (tx && typeof tx.serialize === 'function') {
          const bytes = tx.serialize();
          payload = Array.from(bytes).map((b: number) => b.toString(16).padStart(2, '0')).join('');
          if (typeof tx.transactionHash === 'function') {
            try {
              txId = tx.transactionHash();
            } catch {}
          }
          if (!txId && typeof tx.identifiers === 'function') {
            try {
              const ids = tx.identifiers();
              if (ids && ids.length > 0) txId = ids[0];
            } catch {}
          }
          if (!txId) {
            try {
              const hashBuf = await crypto.subtle.digest('SHA-256', bytes);
              txId = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
            } catch {}
          }
        } else if (tx?.tx && typeof tx.tx === 'string') {
          payload = tx.tx;
          txId = tx.txId || '';
        } else {
          payload = String(tx);
        }
        await apiInstance.submitTransaction(payload);
        return txId || payload;
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
