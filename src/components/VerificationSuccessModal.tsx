import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Lock, 
  ArrowRight,
  X 
} from 'lucide-react';

export interface VerificationSuccessData {
  txHash: string;
  amount: number;
  newPoolBalance: number;
}

interface VerificationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: VerificationSuccessData | null;
  network?: string;
}

export const VerificationSuccessModal: React.FC<VerificationSuccessModalProps> = ({
  isOpen,
  onClose,
  data,
  network = 'preview',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = data.txHash;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const explorerUrl = `https://${network === 'preprod' ? 'preprod' : 'preview'}.midnightexplorer.com/transactions/${data.txHash}`;

  return (
    <div className="fixed inset-0 z-[110] bg-[#1C1917]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EFEBE6] shadow-2xl overflow-hidden text-[#1C1917]">
        
        {/* Top Accent Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#ea580c]" />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header with Close */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    ZK Verified On-Chain
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-[#1C1917] mt-0.5">
                  Contribution Verified
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtitle / Explanatory Guarantee */}
          <p className="text-xs text-[#78716C] leading-relaxed">
            Your shielded contribution was approved in your Lace wallet and verified by the Midnight consensus nodes. The public ledger has been incremented without disclosing your wallet identity.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] space-y-1">
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Shielded Contribution
              </span>
              <span className="text-2xl font-black text-emerald-600 font-mono block">
                ${data.amount.toLocaleString()} <span className="text-xs font-normal text-[#78716C]">tNIGHT</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] space-y-1">
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Updated Public Pool
              </span>
              <span className="text-2xl font-black text-[#ea580c] font-mono block">
                ${data.newPoolBalance.toLocaleString()} <span className="text-xs font-normal text-[#78716C]">tNIGHT</span>
              </span>
            </div>
          </div>

          {/* Cryptographic Proof Verification Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 font-extrabold text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Zero-Knowledge Verification Guarantees</span>
            </div>
            
            <div className="space-y-1.5 text-[11px] text-emerald-900/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>ZK Witness Validated:</strong> Proved mathematically against `donateShielded.verifier`.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Anti-Replay Nullifier:</strong> 32-byte cryptographic nonce committed to ledger nullifier set.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Donor Privacy Preserved:</strong> Wallet address and private state remained local.</span>
              </div>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#78716C]">
              <span>Transaction Hash (Midnight Network)</span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Confirmed
              </span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EFEBE6] rounded-2xl">
              <code className="text-xs font-mono font-bold text-[#1C1917] truncate flex-1 select-all">
                {data.txHash}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white hover:bg-stone-200/60 border border-[#EFEBE6] text-stone-600 hover:text-stone-900 transition-all flex items-center gap-1 text-xs font-bold shrink-0"
                title="Copy Transaction Hash"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#EFEBE6] text-[#1C1917] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <span>View on Explorer</span>
              <ExternalLink className="w-4 h-4 text-[#ea580c]" />
            </a>

            <button
              onClick={onClose}
              className="py-3.5 px-5 rounded-2xl bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold text-xs tracking-wide shadow-md shadow-[#ea580c]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Done</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
