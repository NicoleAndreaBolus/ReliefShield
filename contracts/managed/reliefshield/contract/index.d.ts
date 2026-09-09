import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  donateShielded(context: __compactRuntime.CircuitContext<PS>,
                 secretAmount_0: bigint,
                 secretNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resetPool(context: __compactRuntime.CircuitContext<PS>,
            adminSecret_0: Uint8Array,
            newValue_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  donateShielded(context: __compactRuntime.CircuitContext<PS>,
                 secretAmount_0: bigint,
                 secretNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resetPool(context: __compactRuntime.CircuitContext<PS>,
            adminSecret_0: Uint8Array,
            newValue_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  donateShielded(context: __compactRuntime.CircuitContext<PS>,
                 secretAmount_0: bigint,
                 secretNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resetPool(context: __compactRuntime.CircuitContext<PS>,
            adminSecret_0: Uint8Array,
            newValue_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly totalReliefPool: bigint;
  readonly admin: Uint8Array;
  nullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initialAdmin_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
