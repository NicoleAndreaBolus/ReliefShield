import React, { useState } from 'react';
import { 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  Building2, 
  UserCheck, 
  QrCode, 
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Truck
} from 'lucide-react';
import { 
  DonationRecord, 
  DisbursementRecord, 
  FieldOfficerStation, 
  CampaignType 
} from '../types';
import { RELIEF_SHIELD_CONTRACT_CONFIG } from '../utils/contract';

interface FieldOfficerPageProps {
  stations: FieldOfficerStation[];
  donations: DonationRecord[];
  disbursements: DisbursementRecord[];
  counterState: number;
  isConnected: boolean;
  onExecuteCircuit: (amount: number) => Promise<{ txHash: string; newBalance: number }>;
  onDisburseAid: (disb: DisbursementRecord) => void;
  onShowToast: (msg: string) => void;
}

export const FieldOfficerPage: React.FC<FieldOfficerPageProps> = ({
  stations,
  donations,
  disbursements,
  counterState,
  isConnected,
  onExecuteCircuit,
  onDisburseAid,
  onShowToast,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || 'STN-1');
  const [campaignFilter, setCampaignFilter] = useState<string>('All');
  
  // Terminal Scanner state
  const [inputToken, setInputToken] = useState<string>('ZK-TOKEN #AID-98425');
  const [tokenCategory, setTokenCategory] = useState<CampaignType>('Food & Shelter');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    receipt?: DisbursementRecord;
  } | null>(null);

  // Quick donate from field simulation
  const [quickAmount, setQuickAmount] = useState<number>(100);
  const [isDonating, setIsDonating] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const activeStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Sync token category default with station category
  const handleStationChange = (id: string) => {
    setSelectedStationId(id);
    const stn = stations.find(s => s.id === id);
    if (stn) {
      setTokenCategory(stn.assignedCategory);
    }
    setScanResult(null);
  };

  const filteredDonations = donations.filter(d => 
    campaignFilter === 'All' ? true : d.campaign === campaignFilter
  );

  const filteredDisbursements = disbursements.filter(d => 
    d.officerName === activeStation.officerName || d.category === activeStation.assignedCategory
  );

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      // Category Match Verification
      const isCategoryMatch = tokenCategory === activeStation.assignedCategory;

      if (!isCategoryMatch) {
        setScanResult({
          success: false,
          message: `Category Mismatch Alert: Recipient token is designated for "${tokenCategory}", but your station is assigned to "${activeStation.assignedCategory}". Please direct recipient to the designated depot.`
        });
        return;
      }

      const newDisbursement: DisbursementRecord = {
        id: `DISB-${Math.floor(1000 + Math.random() * 9000)}`,
        tokenId: inputToken || `ZK-TOKEN #AID-${Math.floor(10000 + Math.random() * 90000)}`,
        officerName: activeStation.officerName,
        category: activeStation.assignedCategory,
        itemsDisbursed: `1x ${activeStation.unitLabel}`,
        valueEquivalent: activeStation.assignedCategory === 'Medical Emergency' ? 150 : 75,
        timestamp: 'Just now',
        location: activeStation.stationLocation,
        status: 'Disbursed'
      };

      onDisburseAid(newDisbursement);
      setScanResult({
        success: true,
        message: `Aid Claim Authorized & Released! 1x ${activeStation.unitLabel} handed over. Anti-replay nullifier confirmed on-chain.`,
        receipt: newDisbursement
      });
      onShowToast(`Successfully disbursed aid token for ${activeStation.officerName}`);
    }, 1200);
  };

  const handleFieldDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      onShowToast('Please connect Lace wallet to execute on-chain contribution.');
      return;
    }
    setIsDonating(true);
    try {
      await onExecuteCircuit(quickAmount);
      onShowToast(`Contributed ${quickAmount} tNIGHT to pool! Balance updated.`);
    } catch (err: any) {
      onShowToast(err?.message || 'Transaction failed');
    } finally {
      setIsDonating(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Station Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#EFEBE6] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              Emergency Logistics
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" /> Live Field Station
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#1C1917] tracking-tight">
            Field Officer Portal & Supply Terminal
          </h2>
          <p className="text-xs text-[#78716C] font-medium">
            Category-locked aid voucher verification, live campaign donation tracking, and real-time pool audit.
          </p>
        </div>

        {/* Station / Officer Picker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#EFEBE6]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917] px-1">
            <Truck className="w-4 h-4 text-[#ea580c]" />
            <span>Active Officer:</span>
          </div>
          <select
            value={selectedStationId}
            onChange={(e) => handleStationChange(e.target.value)}
            className="bg-white border border-[#EFEBE6] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] outline-none shadow-sm cursor-pointer focus:border-[#ea580c]"
          >
            {stations.map(stn => (
              <option key={stn.id} value={stn.id}>
                {stn.officerName} — {stn.assignedCategory} ({stn.stationLocation.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Station Overview Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#1C1917] via-stone-900 to-stone-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Station #{activeStation.id} • {activeStation.assignedCategory}
            </span>
            <span className="text-xs text-stone-300 font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {activeStation.officerName} ({activeStation.role})
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {activeStation.stationLocation}
          </h3>
          <p className="text-xs text-stone-400 max-w-xl">
            Authorized to verify single-use ZK tokens and disburse <strong>{activeStation.unitLabel}</strong> to verified disaster victims.
          </p>
        </div>

        {/* Inventory Progress Metric */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-64 shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-300 font-medium">On-Hand Stock</span>
            <span className="font-mono font-bold text-orange-400">
              {activeStation.currentStock} / {activeStation.maxCapacity}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeStation.currentStock / activeStation.maxCapacity) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-300 truncate">
            Unit: {activeStation.unitLabel}
          </p>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#78716C] font-semibold">Total System Relief Pool</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#ea580c] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-[#ea580c]">
            ${counterState.toLocaleString()} <span className="text-xs font-bold text-[#78716C]">tNIGHT</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with Midnight
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#78716C] font-semibold">Active Station Stock</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-[#1C1917]">
            {activeStation.currentStock} <span className="text-xs font-bold text-[#78716C]">Units</span>
          </p>
          <p className="text-[11px] text-[#78716C] font-medium">
            Category: {activeStation.assignedCategory}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#78716C] font-semibold">Station Dispatches</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-700">
            {filteredDisbursements.length} <span className="text-xs font-bold text-[#78716C]">Vouchers</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-bold">
            100% Anti-Replay Proofs
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#78716C] font-semibold">Campaign Donations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-blue-700">
            {donations.length} <span className="text-xs font-bold text-[#78716C]">Incoming</span>
          </p>
          <p className="text-[11px] text-blue-700 font-bold">
            Live Funding Stream
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid: Scanner Terminal (Left) & Live Donation Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Field Aid Voucher Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EFEBE6] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFEBE6] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center font-bold shadow-md shadow-[#ea580c]/20">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1C1917]">Aid Token Verification Terminal</h3>
                  <p className="text-xs text-[#78716C]">Scan disaster victim token and authorize relief supplies</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Locked to: {activeStation.assignedCategory}
              </span>
            </div>

            {/* Simulated Scanner Visual Display */}
            <div className="relative p-6 bg-[#FAF8F5] border-2 border-dashed border-[#EFEBE6] rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-[#EFEBE6] shadow-md flex items-center justify-center relative overflow-hidden group">
                <QrCode className="w-full h-full text-[#1C1917]" />
                {isScanning && (
                  <div className="absolute inset-0 bg-[#ea580c]/20 border-b-2 border-[#ea580c] animate-pulse" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-[#1C1917]">
                  Target Token: {inputToken}
                </p>
                <p className="text-[11px] text-[#78716C]">
                  Holding Station: {activeStation.stationLocation}
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-[#78716C]">Quick Test Tokens:</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputToken('ZK-TOKEN #AID-98425');
                    setTokenCategory(activeStation.assignedCategory);
                    setScanResult(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#EFEBE6] text-[11px] font-bold hover:bg-stone-50 text-[#1C1917]"
                >
                  Matching Token (Valid)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputToken('ZK-TOKEN #AID-MISMATCH-12');
                    setTokenCategory(activeStation.assignedCategory === 'Medical Emergency' ? 'Food & Shelter' : 'Medical Emergency');
                    setScanResult(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                >
                  Mismatch Token (Test Alert)
                </button>
              </div>
            </div>

            {/* Verification Inputs Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1917]">Recipient Token Identifier</label>
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="e.g. ZK-TOKEN #AID-98425"
                    className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#1C1917] outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1917]">Token Claim Category</label>
                  <select
                    value={tokenCategory}
                    onChange={(e) => setTokenCategory(e.target.value as CampaignType)}
                    className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1C1917] outline-none focus:border-[#ea580c] cursor-pointer"
                  >
                    <option value="Food & Shelter">Food & Shelter</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Earthquake Aid">Earthquake Aid</option>
                    <option value="Typhoon Relief">Typhoon Relief</option>
                    <option value="Flood Recovery">Flood Recovery</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-[#ea580c]/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying ZK Token with Anti-Replay Nullifier...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Scan & Authorize Supply Handoff</span>
                  </>
                )}
              </button>

              {/* Scan / Verification Result Banner */}
              {scanResult && (
                <div 
                  className={`p-4 rounded-2xl text-xs space-y-2 animate-in fade-in ${
                    scanResult.success 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' 
                      : 'bg-rose-50 border border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {scanResult.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800">Authorization Granted</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-800">Verification Blocked</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed font-medium">{scanResult.message}</p>

                  {scanResult.receipt && (
                    <div className="pt-2 border-t border-emerald-200/60 font-mono text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-emerald-800">Dispatch Receipt:</span>
                        <span className="font-bold">{scanResult.receipt.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-800">Supplies Released:</span>
                        <span className="font-bold">{scanResult.receipt.itemsDisbursed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-800">Officer Signature:</span>
                        <span className="font-bold">{scanResult.receipt.officerName}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Shift Disbursement Audit Log */}
          <div className="p-6 rounded-3xl bg-white border border-[#EFEBE6] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFEBE6] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1C1917]">Officer Shift Disbursement Log</h3>
                <p className="text-xs text-[#78716C]">Audit trail of physical aid handed out during this shift</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {filteredDisbursements.length} Handed Out
              </span>
            </div>

            {filteredDisbursements.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No supplies disbursed yet this shift.</p>
            ) : (
              <div className="space-y-2.5">
                {filteredDisbursements.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1C1917]">{d.tokenId}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {d.category}
                        </span>
                      </div>
                      <p className="text-[#78716C] font-medium">{d.itemsDisbursed}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-emerald-700 font-bold block">{d.status}</span>
                      <span className="text-[11px] text-[#78716C]">{d.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Live Campaign Donation Stream & Pool Growth */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Donation Stream Box */}
          <div className="p-6 rounded-3xl bg-white border border-[#EFEBE6] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFEBE6] pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-base font-extrabold text-[#1C1917]">Live Campaign Donations</h3>
                </div>
                <p className="text-xs text-[#78716C]">Incoming donor contributions increasing the public pool</p>
              </div>
            </div>

            {/* Campaign Filter Pill Selector */}
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              {['All', 'Typhoon Relief', 'Earthquake Aid', 'Flood Recovery', 'Medical Emergency', 'Food & Shelter'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCampaignFilter(cat)}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    campaignFilter === cat
                      ? 'bg-[#ea580c] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EFEBE6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Stream List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredDonations.map((d) => (
                <div 
                  key={d.id} 
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE6] hover:border-orange-500/40 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-[#ea580c] border border-orange-500/20">
                      {d.campaign}
                    </span>
                    <span className="font-mono font-black text-sm text-emerald-700 flex items-center gap-0.5">
                      +${d.amount.toLocaleString()} tNIGHT
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C1917]">{d.donorType}</span>
                    <span className="text-[#78716C] font-medium text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {d.timestamp}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#EFEBE6]/80 flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                    <span className="truncate max-w-[180px]">
                      {d.txHash ? `${d.txHash.slice(0, 10)}...${d.txHash.slice(-6)}` : 'On-chain proof'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {d.txHash && (
                        <button
                          onClick={() => copyHash(d.txHash)}
                          className="hover:text-[#1C1917] p-0.5"
                          title="Copy Transaction Hash"
                        >
                          {copiedHash === d.txHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <a
                        href={`https://preview.midnightexplorer.com/contracts/${RELIEF_SHIELD_CONTRACT_CONFIG.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 hover:text-amber-900 flex items-center gap-0.5 font-bold"
                      >
                        <span>Ledger</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Field Contribution Test Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#1C1917]">Test Pool Increment</h4>
                <p className="text-[11px] text-amber-900 font-medium">Contribute to the live pool and verify stream update</p>
              </div>
            </div>

            <form onSubmit={handleFieldDonation} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="10"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Number(e.target.value))}
                  disabled={isDonating}
                  className="flex-1 bg-white border border-amber-300/80 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1C1917] outline-none focus:border-[#ea580c]"
                  placeholder="100"
                />
                <button
                  type="submit"
                  disabled={isDonating || !isConnected}
                  className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold text-xs shadow-md shadow-[#ea580c]/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDonating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Coins className="w-3.5 h-3.5" />
                  )}
                  <span>{isDonating ? 'Proving...' : 'Contribute'}</span>
                </button>
              </div>
              {!isConnected && (
                <p className="text-[11px] text-amber-800 font-medium">
                  * Connect Lace wallet in top navbar to trigger live ZK circuit execution.
                </p>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
