import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Scan, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onConnect: () => void;
  counterState: number;
  isExecutingCircuit: boolean;
  onExecuteCircuit: (amount: number, campaign?: string) => Promise<{ txHash: string; newBalance: number }>;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  onConnect,
  counterState,
  isExecutingCircuit,
  onExecuteCircuit,
}) => {
  const [activeTab, setActiveTab] = useState<'donate' | 'receive'>('donate');
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [selectedCampaign, setSelectedCampaign] = useState('typhoon');
  const [txHash, setTxHash] = useState<string | null>(null);

  // Receive via QR State
  const [aidCategory, setAidCategory] = useState('shelter');
  const [qrVerified, setQrVerified] = useState(false);

  if (!isOpen) return null;

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      onConnect();
      return;
    }
    try {
      const campaignName = 
        selectedCampaign === 'typhoon' ? 'Typhoon Relief' :
        selectedCampaign === 'earthquake' ? 'Earthquake Aid' :
        selectedCampaign === 'flood' ? 'Flood Recovery' : 'General Emergency Pool';

      const res = await onExecuteCircuit(donationAmount, campaignName);
      setTxHash(res.txHash);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateQRScan = () => {
    setQrVerified(false);
    setTimeout(() => {
      setQrVerified(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#EFEBE6] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#EFEBE6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">ReliefShield Transaction Hub</h3>
              <p className="text-[11px] text-[#78716C]">Choose to Donate or Receive Disaster Aid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200/60 text-stone-500 hover:text-stone-900 flex items-center justify-center border border-[#EFEBE6] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Donate vs Receive via QR */}
        <div className="p-6 space-y-6">
          <div className="flex bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#EFEBE6]">
            <button
              onClick={() => setActiveTab('donate')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'donate'
                  ? 'bg-[#ea580c] text-white shadow-md shadow-[#ea580c]/20'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate (Shielded ZK)</span>
            </button>

            <button
              onClick={() => setActiveTab('receive')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'receive'
                  ? 'bg-[#ea580c] text-white shadow-md shadow-[#ea580c]/20'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Receive Aid via QR</span>
            </button>
          </div>

          {/* MODE 1: DONATE VIA SHIELDED ZK */}
          {activeTab === 'donate' ? (
            <form onSubmit={handleDonateSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C1917]">Select Disaster Relief Campaign</label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-4 py-3 text-xs font-bold text-[#1C1917] outline-none cursor-pointer focus:border-[#ea580c]"
                >
                  <option value="typhoon">🌀 Typhoon Relief Emergency Fund</option>
                  <option value="earthquake">🌋 Earthquake Shelter & Medical Aid</option>
                  <option value="flood">🌧️ Flood Disaster Rescue Operation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#1C1917]">Shielded Contribution Amount (tNIGHT)</span>
                  <span className="text-[#ea580c] font-mono">${counterState.toLocaleString()} Pool Balance</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    disabled={isExecutingCircuit}
                    className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-4 py-3.5 text-base font-mono font-bold text-[#1C1917] outline-none focus:border-[#ea580c]"
                    placeholder="100.00"
                    required
                  />
                </div>
              </div>

              {/* Amount Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDonationAmount(preset)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      donationAmount === preset
                        ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-sm'
                        : 'bg-[#FAF8F5] border-[#EFEBE6] text-[#78716C] hover:bg-white'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              {/* Privacy Banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span className="font-semibold">Proved with shielded donor identity</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isExecutingCircuit}
                className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:brightness-110 shadow-lg shadow-[#ea580c]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExecutingCircuit ? (
                  <span>Executing ZK Circuit locally...</span>
                ) : !isConnected ? (
                  'Connect Wallet to Execute ZK Circuit'
                ) : (
                  'Execute ZK Contribution Circuit'
                )}
              </button>

              {txHash && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 text-emerald-900 font-mono break-all">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Transaction Confirmed On-Chain</span>
                  </div>
                  <p className="text-[11px] text-emerald-950">Hash: {txHash}</p>
                  <a
                    href={`https://preview.midnightexplorer.com/transactions/${txHash.startsWith('0x') ? txHash : `0x${txHash}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline pt-1"
                  >
                    <span>View on Midnight Explorer →</span>
                  </a>
                </div>
              )}
            </form>
          ) : (
            /* MODE 2: RECEIVE AID VIA QR VERIFICATION */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-extrabold text-sm block text-amber-950 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#ea580c]" />
                  Disaster Victim Aid Token
                </span>
                <p className="leading-relaxed">
                  Disaster residents present this single-use ZK QR code to field relief officers. The ZK circuit verifies aid eligibility without exposing your legal name or home location.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C1917]">Select Aid Grant Category</label>
                <select
                  value={aidCategory}
                  onChange={(e) => setAidCategory(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-4 py-3 text-xs font-bold text-[#1C1917] outline-none cursor-pointer"
                >
                  <option value="shelter">⛺ Emergency Shelter & Construction Grant ($100)</option>
                  <option value="food">🍱 Food Ration & Clean Water Family Pack ($50)</option>
                  <option value="medical">🏥 Medical First Aid & Refrigeration Supply ($150)</option>
                </select>
              </div>

              {/* QR Code Container */}
              <div className="p-6 bg-[#FAF8F5] border border-[#EFEBE6] rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-[#EFEBE6] shadow-md flex items-center justify-center">
                  <QrCode className="w-full h-full text-[#1C1917]" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#78716C]">
                  ZK-TOKEN #AID-98425
                </span>

                <button
                  type="button"
                  onClick={handleSimulateQRScan}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#EFEBE6] hover:bg-stone-100 text-xs font-bold text-[#1C1917] shadow-sm flex items-center gap-2 transition-all"
                >
                  <Scan className="w-4 h-4 text-[#ea580c]" />
                  <span>Scan / Verify Token (Field Officer)</span>
                </button>
              </div>

              {qrVerified && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Aid Claim Authorized & Released</span>
                  </div>
                  <p>
                    ZK Eligibility proof verified. Aid grant disbursed with 0 bytes of private identity leaked on-chain.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
