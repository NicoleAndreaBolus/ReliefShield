import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react';
import { validateWitnessConstraints } from '../utils/contract';

interface ShieldedDonationProps {
  isConnected: boolean;
  walletBalance: number;
  counterState: number;
  isExecutingCircuit: boolean;
  onExecuteCircuit: (amount: number) => Promise<{ txHash: string; newBalance: number }>;
  onConnect: () => void;
}

export const ShieldedDonation: React.FC<ShieldedDonationProps> = ({
  isConnected,
  walletBalance,
  counterState,
  isExecutingCircuit,
  onExecuteCircuit,
  onConnect,
}) => {
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = [50, 100, 250, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateWitnessConstraints(donationAmount, walletBalance);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid amount');
      return;
    }

    try {
      const res = await onExecuteCircuit(donationAmount);
      setTxHash(res.txHash);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to execute zero-knowledge circuit');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-[#EFEBE6] shadow-xl p-6 sm:p-8 space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFEBE6] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-[#ea580c] flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">Shielded Aid Allocation</h3>
            <p className="text-xs text-[#78716C]">Zero-Knowledge Private Witness Circuit</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
          Compact ZK
        </span>
      </div>

      {/* Public Pool Display */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] flex items-center justify-between">
        <div>
          <p className="text-[11px] text-[#78716C] font-semibold uppercase tracking-wider">Public Relief Pool</p>
          <p className="text-2xl font-black text-[#ea580c] font-mono mt-0.5">
            ${counterState.toLocaleString()} <span className="text-xs font-normal text-[#78716C]">tNIGHT</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[#78716C] font-semibold uppercase tracking-wider">Privacy Protocol</p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Witness Active
          </span>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <Lock className="w-4 h-4 text-[#ea580c]" />
          <span>Cryptographic Privacy Guarantee</span>
        </div>
        <p className="text-[11px] text-amber-900/90">
          Your transaction is proven using Zero-Knowledge cryptography with your donor identity completely shielded. On-chain observers can verify that the public relief pool was incremented by your contribution amount and protected by an anti-replay nullifier, without ever exposing your wallet address or linking you to the donation.
        </p>
      </div>

      {/* Donation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1C1917]">Shielded Amount ($tNIGHT)</label>
            <span className="text-[11px] text-[#78716C] font-mono">
              Available: {walletBalance.toLocaleString()} tNIGHT
            </span>
          </div>
          <input
            type="number"
            min="1"
            max={walletBalance || 10000}
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            disabled={!isConnected || isExecutingCircuit}
            className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-2xl px-4 py-3 text-sm font-mono text-[#1C1917] focus:border-[#ea580c] focus:outline-none transition-all disabled:opacity-50"
            placeholder="Enter amount to contribute"
          />
        </div>

        {/* Amount Presets */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDonationAmount(preset)}
              disabled={!isConnected || isExecutingCircuit}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                donationAmount === preset
                  ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-sm'
                  : 'bg-[#FAF8F5] border-[#EFEBE6] text-[#1C1917] hover:bg-stone-200/60'
              } disabled:opacity-50`}
            >
              ${preset}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {errorMessage}
          </div>
        )}

        {txHash && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ZK Proof Verified & Ledger Updated</span>
            </div>
            <p className="text-[10px] break-all text-emerald-800">Tx: {txHash}</p>
          </div>
        )}

        {isConnected ? (
          <button
            type="submit"
            disabled={isExecutingCircuit}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold text-xs tracking-wide shadow-lg shadow-[#ea580c]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isExecutingCircuit ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing ZK Proof & Settling...</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-4 h-4" />
                <span>Execute ZK Contribution Circuit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold text-xs tracking-wide shadow-lg shadow-[#ea580c]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Shield className="w-4 h-4" />
            <span>Connect Midnight Lace Wallet to Contribute</span>
          </button>
        )}
      </form>
    </div>
  );
};
