import React from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PrivacyMatrix: React.FC = () => {
  return (
    <section id="privacy-claim" className="w-full max-w-4xl mx-auto py-8">
      <div className="clay-card p-6 sm:p-8 space-y-6 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Official Privacy Claim & Audit Matrix</h3>
              <p className="text-xs text-slate-400">What an on-chain observer sees vs cannot see on Midnight blockchain</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            ZKP Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Public On-Chain Data</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Total Accumulated Public Relief Pool ($tNIGHT)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Disclosed Contribution Amount & Anti-Replay Nullifier</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero-Knowledge Proof Verification & Settlement State</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Block Timestamp & Smart Contract Address</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-orange-400" />
              <span>Private Shielded Data</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Donor Wallet Address / Identity Linkage (Shielded)</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Donor Secret Witness Entropy & Unshielded History</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Victim Relief Recipient Legal Names / Residence</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/20 text-xs text-orange-200/90 leading-relaxed font-mono">
          <strong>Privacy Claim Guarantee:</strong> Any third-party observer auditing the block explorer can mathematically confirm that the donation amount was validly processed and added to the public relief pool, but can NEVER determine who donated or link the transaction to the donor's identity.
        </div>
      </div>
    </section>
  );
};
