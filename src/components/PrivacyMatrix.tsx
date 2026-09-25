import React from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, ExternalLink, ShieldCheck } from 'lucide-react';
import { getDeployedContractAddress } from '../utils/contract';

interface PrivacyMatrixProps {
  network?: 'preview' | 'preprod';
}

export const PrivacyMatrix: React.FC<PrivacyMatrixProps> = ({ network = 'preview' }) => {
  const contractAddress = getDeployedContractAddress(network);
  const explorerContractUrl = `https://preview.midnightexplorer.com/contracts/${contractAddress}`;

  return (
    <section id="security" className="w-full bg-[#1C1917] text-white py-24 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ea580c] text-xs font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Security Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Official Privacy Claim & Audit Matrix
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-normal leading-relaxed">
            ReliefShield operates under a strict dual-ledger Zero-Knowledge architecture on the Midnight Network.
            Reviewers and donors can inspect exactly what data is publicly disclosed versus what remains strictly shielded.
          </p>
        </div>

        {/* 2-Column Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Public Ledger State */}
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm tracking-wide uppercase">
                <Eye className="w-5 h-5 text-emerald-400" />
                <span>Public On-Chain Ledger State</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verifiable
              </span>
            </div>

            <ul className="text-xs text-stone-300 space-y-3 font-mono">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Total Accumulated Relief Pool (`totalReliefPool`)</strong>
                  <span className="text-stone-400">Public balance counter incremented on Midnight testnet.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Disclosed Donation Amount (`secretAmount`)</strong>
                  <span className="text-stone-400">Disclosed on-chain to transparently audit and increment the relief pool.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Cryptographic Nullifier (`nullifiers` set)</strong>
                  <span className="text-stone-400">One-way hash stored on-chain to mathematically prevent replay attacks.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">ZK-Proof Verification & Settlement State</strong>
                  <span className="text-stone-400">Consensus proof verifying execution without exposing witness memory.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Private Witness Data */}
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5 text-orange-400 font-bold text-sm tracking-wide uppercase">
                <EyeOff className="w-5 h-5 text-orange-400" />
                <span>Private Witness Memory (Off-Chain)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                100% Shielded
              </span>
            </div>

            <ul className="text-xs text-stone-300 space-y-3 font-mono">
              <li className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Donor Wallet Address & Identity Linkage</strong>
                  <span className="text-stone-400">Completely hidden. No wallet address or identity tag is ever sent to the contract.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Donor Private Keys & UTXO Notes</strong>
                  <span className="text-stone-400">Retained securely inside the browser Lace wallet; never leaves device.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Secret Nonce Entropy (`secretNonce`)</strong>
                  <span className="text-stone-400">Private random witness entropy used to securely derive the public nullifier.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Beneficiary / Victim Real-World Identity</strong>
                  <span className="text-stone-400">Aid tokens are redeemed via ephemeral QR handoff codes without KYC.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Official Privacy Guarantee Banner */}
        <div className="max-w-5xl mx-auto p-5 sm:p-6 rounded-3xl bg-orange-950/30 border border-orange-500/30 space-y-3">
          <div className="flex items-center gap-2.5 text-sm font-bold text-orange-300">
            <ShieldCheck className="w-5 h-5 text-[#ea580c]" />
            <span>Formal Privacy Claim Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
            Any third-party observer or auditor inspecting the Midnight block explorer can mathematically confirm that a donation was validly processed, verified by a Zero-Knowledge proof, and credited to the public relief pool. However, it is mathematically impossible to determine who donated or link the transaction to the donor's personal wallet address.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-stone-400 border-t border-orange-500/20">
            <span className="truncate">
              Deployed Contract: <code className="text-orange-300 font-bold">{contractAddress}</code>
            </span>
            <a
              href={explorerContractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#ea580c] hover:text-orange-300 font-bold shrink-0 transition-colors"
            >
              <span>Inspect on Midnight Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
