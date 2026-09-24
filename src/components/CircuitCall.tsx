import React, { useState } from 'react';

interface CircuitCallProps {
  isConnected: boolean;
  counterState: number;
  isExecutingCircuit: boolean;
  lastTxHash: string | null;
  onExecuteCircuit: (secretAmount: number) => Promise<{ txHash: string; newBalance: number }>;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  isConnected,
  counterState,
  isExecutingCircuit,
  lastTxHash,
  onExecuteCircuit,
}) => {
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [txSuccessInfo, setTxSuccessInfo] = useState<{ txHash: string; amount: number } | null>(null);
  const [circuitError, setCircuitError] = useState<string | null>(null);

  const handleCircuitCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    
    setCircuitError(null);
    try {
      const result = await onExecuteCircuit(donationAmount);
      setTxSuccessInfo({
        txHash: result.txHash,
        amount: donationAmount,
      });
    } catch (err: any) {
      setCircuitError(err?.message || 'Circuit execution failed.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl transition-all">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Relief Campaign #104
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Typhoon Relief Emergency Fund</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Public Relief Pool</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">${counterState.toLocaleString()} tNIGHT</p>
        </div>
      </div>

      {/* Mandatory Label */}
      <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between text-xs text-cyan-200">
        <span className="flex items-center gap-2 font-semibold">
          🛡️ Privacy Shield Active
        </span>
        <span className="font-mono bg-cyan-500/10 px-2.5 py-0.5 rounded-full text-cyan-300 border border-cyan-500/30">
          Proved with shielded donor identity
        </span>
      </div>

      {/* Form to trigger ZK Circuit Call */}
      <form onSubmit={handleCircuitCall} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Shielded Donation Amount (tNIGHT)
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="10000"
              value={donationAmount}
              onChange={(e) => setDonationAmount(Number(e.target.value))}
              disabled={!isConnected || isExecutingCircuit}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono transition-all disabled:opacity-50"
              placeholder="Enter amount to prove privately..."
              required
            />
            <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-mono font-semibold">
              tNIGHT
            </span>
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="flex gap-2">
          {[10, 25, 50, 100].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDonationAmount(preset)}
              disabled={!isConnected || isExecutingCircuit}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                donationAmount === preset
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              +${preset}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={!isConnected || isExecutingCircuit}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isExecutingCircuit ? (
            <>
              <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Zero-Knowledge Proof locally...</span>
            </>
          ) : !isConnected ? (
            'Connect Wallet to Execute ZK Circuit'
          ) : (
            'Execute ZK Circuit (Shielded Contribution)'
          )}
        </button>
      </form>

      {/* Loading Indicator Details during ZK Proof Generation */}
      {isExecutingCircuit && (
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-emerald-400 font-semibold">
            <span>⚙️ Local Prover Active</span>
            <span>Generating Proof...</span>
          </div>
          <p className="text-slate-400">
            Computing Zero-Knowledge circuit proof in browser memory. Your secret donor witness entropy is evaluated locally to ensure your wallet identity remains shielded from the on-chain ledger.
          </p>
        </div>
      )}

      {/* Transaction Result Display */}
      {txSuccessInfo && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-300 font-bold">
            <span>✅ Transaction Submitted On-Chain</span>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">Confirmed</span>
          </div>
          <p className="text-slate-300">
            Public ledger state updated. Public Relief Pool balance is now{' '}
            <strong className="text-emerald-400 font-mono">${counterState} tNIGHT</strong>.
          </p>
          <div className="pt-2 border-t border-emerald-900/60 font-mono text-[11px] text-slate-400 break-all">
            <span className="text-slate-500">Transaction Hash: </span>
            <span className="text-cyan-300">{txSuccessInfo.txHash}</span>
          </div>
        </div>
      )}

      {circuitError && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
          ❌ {circuitError}
        </div>
      )}
    </div>
  );
};
