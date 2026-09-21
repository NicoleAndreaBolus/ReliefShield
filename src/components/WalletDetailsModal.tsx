import React, { useState } from 'react';
import { 
  Wallet, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Coins, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  walletBalance: number;
  network: string;
  onDisconnect?: () => void;
}

export const WalletDetailsModal: React.FC<WalletDetailsModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  walletBalance,
  network,
  onDisconnect,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !walletAddress) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for non-secure contexts
      const el = document.createElement('textarea');
      el.value = walletAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const explorerUrl = `https://${network === 'preprod' ? 'preprod' : 'preview'}.midnightexplorer.com/`;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EFEBE6] shadow-2xl p-6 sm:p-7 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFEBE6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#ea580c] flex items-center justify-center font-bold shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">Midnight Wallet Details</h3>
              <p className="text-xs text-[#78716C]">Connected via Midnight Lace DApp Connector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Network & Live Balance Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] space-y-1">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Network</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#1C1917] uppercase">
                Midnight {network}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Balance</span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-emerald-900">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>{walletBalance.toLocaleString()} tNIGHT</span>
            </div>
          </div>
        </div>

        {/* Full Bech32m Address Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
              <span>Full Midnight Bech32m Address</span>
            </label>
            <span className="text-[11px] font-mono text-[#78716C]">{walletAddress.length} chars</span>
          </div>

          <div className="relative group p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] hover:border-amber-300 transition-colors">
            <p className="font-mono text-xs text-[#1C1917] leading-relaxed break-all select-all font-medium">
              {walletAddress}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#ea580c] hover:bg-[#d97706] shadow-md shadow-[#ea580c]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied Full Address!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Address</span>
              </>
            )}
          </button>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-bold text-xs text-[#1C1917] bg-[#FAF8F5] border border-[#EFEBE6] hover:bg-stone-200/60 transition-all flex items-center justify-center gap-2"
          >
            <span>Midnight Explorer</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
          </a>

          {onDisconnect && (
            <button
              type="button"
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="w-full sm:w-auto py-3 px-3 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center justify-center gap-1.5"
              title="Disconnect Wallet"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
