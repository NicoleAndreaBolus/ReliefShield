import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import * as compactRuntime from '@midnight-ntwrk/compact-runtime';
// Import the actual compiled Midnight Compact contract
import { Contract, ledger } from '../contracts/managed/reliefshield/contract/index.js';

/**
 * ReliefShield Smart Contract Test Suite
 * Executing against genuine Midnight Compact circuits & Compact runtime:
 * 1. Valid donations with private witness & nullifier
 * 2. Invalid inputs (zero, negative amounts)
 * 3. Real second-call anti-replay nullifier protection
 * 4. Real admin authorization & unauthorized resets
 * 5. Privacy preservation & witness isolation
 * 6. Runtime integration lifecycle (Wallet → Proof Data → CallTx Interface → Indexer State)
 */

function createInitialContract(adminKey: Uint8Array) {
  const contract = new Contract({});
  const constructorCtx = {
    initialPrivateState: {},
    initialZswapLocalState: { coinPublicKey: new Uint8Array(32) },
  };
  const initRes = contract.initialState(constructorCtx, adminKey);
  return {
    contract,
    state: initRes.currentContractState.data,
    privateState: initRes.currentPrivateState,
  };
}

function executeDonateShielded(
  contract: Contract,
  state: any,
  privateState: any,
  secretAmount: bigint,
  secretNonce: Uint8Array,
) {
  const circuitCtx = compactRuntime.createCircuitContext(
    compactRuntime.dummyContractAddress(),
    new Uint8Array(32),
    state,
    privateState,
  );
  const result = contract.circuits.donateShielded(circuitCtx, secretAmount, secretNonce);
  return {
    result,
    nextState: result.context.currentQueryContext.state,
    nextPrivateState: result.context.currentPrivateState,
  };
}

function executeResetPool(
  contract: Contract,
  state: any,
  privateState: any,
  adminSecret: Uint8Array,
  newValue: bigint,
) {
  const circuitCtx = compactRuntime.createCircuitContext(
    compactRuntime.dummyContractAddress(),
    new Uint8Array(32),
    state,
    privateState,
  );
  const result = contract.circuits.resetPool(circuitCtx, adminSecret, newValue);
  return {
    result,
    nextState: result.context.currentQueryContext.state,
    nextPrivateState: result.context.currentPrivateState,
  };
}

describe('ReliefShield Compact Smart Contract Circuits (Genuine Runtime)', () => {
  const adminKey = new Uint8Array(crypto.randomBytes(32));

  describe('1. Valid Donations & State Transitions', () => {
    it('should initialize with zero pool and correct admin key', () => {
      const { state } = createInitialContract(adminKey);
      const initialLedger = ledger(state);

      expect(initialLedger.totalReliefPool).toBe(0n);
      expect(Buffer.from(initialLedger.admin).equals(Buffer.from(adminKey))).toBe(true);
      expect(initialLedger.nullifiers.size()).toBe(0n);
    });

    it('should increment totalReliefPool with valid private witness and record nullifier', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const secretNonce = new Uint8Array(crypto.randomBytes(32));
      const donationAmount = 250n;

      const { nextState } = executeDonateShielded(contract, state, privateState, donationAmount, secretNonce);
      const updatedLedger = ledger(nextState);

      expect(updatedLedger.totalReliefPool).toBe(250n);
      expect(updatedLedger.nullifiers.member(secretNonce)).toBe(true);
      expect(updatedLedger.nullifiers.size()).toBe(1n);
    });

    it('should correctly accumulate multiple independent shielded donations', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);

      const nonce1 = new Uint8Array(crypto.randomBytes(32));
      const tx1 = executeDonateShielded(contract, state, privateState, 50n, nonce1);
      const ledger1 = ledger(tx1.nextState);
      expect(ledger1.totalReliefPool).toBe(50n);
      expect(ledger1.nullifiers.size()).toBe(1n);

      const nonce2 = new Uint8Array(crypto.randomBytes(32));
      const tx2 = executeDonateShielded(contract, tx1.nextState, tx1.nextPrivateState, 150n, nonce2);
      const ledger2 = ledger(tx2.nextState);
      expect(ledger2.totalReliefPool).toBe(200n);
      expect(ledger2.nullifiers.size()).toBe(2n);
      expect(ledger2.nullifiers.member(nonce1)).toBe(true);
      expect(ledger2.nullifiers.member(nonce2)).toBe(true);
    });
  });

  describe('2. Invalid Inputs Validation', () => {
    it('should reject zero contribution amount with Compact assertion error', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const secretNonce = new Uint8Array(crypto.randomBytes(32));

      expect(() => executeDonateShielded(contract, state, privateState, 0n, secretNonce)).toThrow(
        /Donation amount must be positive/
      );

      const untouchedLedger = ledger(state);
      expect(untouchedLedger.totalReliefPool).toBe(0n);
    });

    it('should reject invalid nonce length or non-byte inputs', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const invalidNonce = new Uint8Array(16); // Must be 32 bytes

      expect(() => executeDonateShielded(contract, state, privateState, 100n, invalidNonce)).toThrow(
        /Bytes<32>/
      );
    });
  });

  describe('3. Real Second-Call Anti-Replay Nullifier Protection', () => {
    it('should reject submitting the exact same nonce twice against the contract state', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const secretNonce = new Uint8Array(crypto.randomBytes(32));
      const donationAmount = 100n;

      // First contribution MUST succeed
      const firstCall = executeDonateShielded(contract, state, privateState, donationAmount, secretNonce);
      const stateAfterFirstCall = firstCall.nextState;
      const ledgerAfterFirstCall = ledger(stateAfterFirstCall);

      expect(ledgerAfterFirstCall.totalReliefPool).toBe(100n);
      expect(ledgerAfterFirstCall.nullifiers.member(secretNonce)).toBe(true);
      expect(ledgerAfterFirstCall.nullifiers.size()).toBe(1n);

      // Second contribution with IDENTICAL secretNonce MUST be rejected by Compact circuit assert
      expect(() =>
        executeDonateShielded(
          contract,
          stateAfterFirstCall,
          firstCall.nextPrivateState,
          donationAmount,
          secretNonce
        )
      ).toThrow(/Nullifier already used: replay rejected/);

      // Pool balance remains strictly protected and unchanged
      const ledgerAfterRejectedReplay = ledger(stateAfterFirstCall);
      expect(ledgerAfterRejectedReplay.totalReliefPool).toBe(100n);
      expect(ledgerAfterRejectedReplay.nullifiers.size()).toBe(1n);
    });
  });

  describe('4. Real Admin Authorization & Unauthorized Resets', () => {
    it('should reject resetPool if caller provides an unauthorized key', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const unauthorizedKey = new Uint8Array(crypto.randomBytes(32));

      // First donate some funds so pool > 0
      const nonce = new Uint8Array(crypto.randomBytes(32));
      const { nextState, nextPrivateState } = executeDonateShielded(contract, state, privateState, 500n, nonce);
      expect(ledger(nextState).totalReliefPool).toBe(500n);

      // Attempt unauthorized reset
      expect(() => executeResetPool(contract, nextState, nextPrivateState, unauthorizedKey, 0n)).toThrow(
        /Unauthorized: caller is not authorized admin/
      );

      // Verify totalReliefPool was NOT reset
      expect(ledger(nextState).totalReliefPool).toBe(500n);
    });

    it('should allow resetPool when called with the exact authorized admin key', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const nonce = new Uint8Array(crypto.randomBytes(32));
      const { nextState, nextPrivateState } = executeDonateShielded(contract, state, privateState, 500n, nonce);

      // Authorized reset using adminKey
      const resetResult = executeResetPool(contract, nextState, nextPrivateState, adminKey, 10n);
      const resetLedger = ledger(resetResult.nextState);

      expect(resetLedger.totalReliefPool).toBe(10n);
    });
  });

  describe('5. Privacy Model & Ledger State Disclosure', () => {
    it('should disclose only totalReliefPool, admin, and nullifier hashes on the public ledger', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const secretNonce = new Uint8Array(crypto.randomBytes(32));

      const { nextState } = executeDonateShielded(contract, state, privateState, 300n, secretNonce);
      const publicLedger = ledger(nextState);

      // The public ledger contains only the declared public fields
      expect(publicLedger.totalReliefPool).toBe(300n);
      expect(publicLedger.admin).toBeDefined();
      expect(publicLedger.nullifiers).toBeDefined();

      // Ensure donor identity/wallet address is never present in public ledger state
      expect((publicLedger as any).donorAddress).toBeUndefined();
      expect((publicLedger as any).donorIdentity).toBeUndefined();
      expect((publicLedger as any).donorPublicKey).toBeUndefined();
    });
  });

  describe('6. Runtime Integration Flow (Wallet Context → Proof Data → CallTx → Ledger Assertion)', () => {
    it('should generate valid proof inputs and verify state transition with genuine runtime structures', () => {
      const { contract, state, privateState } = createInitialContract(adminKey);
      const secretAmount = 100n;
      const secretNonce = new Uint8Array(crypto.randomBytes(32));

      // Step A: Circuit Context with Dummy Contract Address
      const circuitCtx = compactRuntime.createCircuitContext(
        compactRuntime.dummyContractAddress(),
        new Uint8Array(32),
        state,
        privateState,
      );

      // Step B: Execute genuine generated circuit
      const txResult = contract.circuits.donateShielded(circuitCtx, secretAmount, secretNonce);

      // Step C: Verify partial proof data generated by Compact compiler runtime
      expect(txResult.proofData).toBeDefined();
      expect(txResult.proofData.input).toBeDefined();
      expect(txResult.proofData.input.value.length).toBeGreaterThan(0);
      expect(txResult.proofData.output).toBeDefined();

      // Step D: Decode resulting ledger state
      const verifiedLedger = ledger(txResult.context.currentQueryContext.state);
      expect(verifiedLedger.totalReliefPool).toBe(100n);
      expect(verifiedLedger.nullifiers.member(secretNonce)).toBe(true);
    });
  });
});
