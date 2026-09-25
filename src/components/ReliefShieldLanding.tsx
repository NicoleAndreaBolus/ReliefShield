import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Lock, 
  QrCode, 
  CheckCircle2, 
  Zap, 
  Users, 
  ShieldCheck, 
  Heart, 
  EyeOff, 
  TrendingUp, 
  Wallet,
  ArrowLeftRight,
  Coins,
  Check,
  Eye,
  ExternalLink
} from 'lucide-react';
import { LiveTransactionsFeed } from './LiveTransactionsFeed';
import { PrivacyMatrix } from './PrivacyMatrix';

interface ReliefShieldLandingProps {
  isConnected: boolean;
  walletAddress: string | null;
  walletBalance?: number;
  isLaceDetected?: boolean;
  network: string;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenDashboard: () => void;
  onOpenTxModal: () => void;
  onOpenWalletDetails?: () => void;
  counterState: number;
  isExecutingCircuit: boolean;
  onExecuteCircuit: (amount: number) => Promise<{ txHash: string; newBalance: number }>;
}

export const ReliefShieldLanding: React.FC<ReliefShieldLandingProps> = ({
  isConnected,
  walletAddress,
  walletBalance = 1000,
  isLaceDetected = false,
  network,
  isConnecting,
  onConnect,
  onDisconnect,
  onOpenDashboard,
  onOpenTxModal,
  onOpenWalletDetails,
  counterState,
  isExecutingCircuit,
  onExecuteCircuit,
}) => {
  const [contributionAmount, setContributionAmount] = useState<number>(100);
  const [txResultHash, setTxResultHash] = useState<string | null>(null);

  const handleCircuitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    try {
      const res = await onExecuteCircuit(contributionAmount);
      setTxResultHash(res.txHash);
    } catch (err) {
      console.error(err);
    }
  };

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`
    : '';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased selection:bg-[#d97706] selection:text-white">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFEBE6]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f59e0b] via-[#ea580c] to-[#d97706] p-0.5 shadow-md shadow-[#ea580c]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#FAF8F5] rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#d97706]" />
              </div>
            </div>
            <span className="font-sans font-extrabold text-xl text-[#1C1917] tracking-tight">
              Relief<span className="text-[#d97706]">Shield</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#78716C]">
            <a href="#how-it-works" className="hover:text-[#1C1917] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#1C1917] transition-colors">Features</a>
            <a href="#security" className="hover:text-[#1C1917] transition-colors">Security Audit</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTxModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100/90 text-amber-950 font-bold text-xs border border-amber-300/60 hover:bg-amber-200/80 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Donate / Receive via QR</span>
            </button>

            {/* Wallet Connection Status & Balance Display */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                {/* Account Balance Pill */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{walletBalance.toLocaleString()} tNIGHT</span>
                </div>

                {/* Wallet Address Snippet (Clickable to view full address) */}
                <button
                  type="button"
                  onClick={onOpenWalletDetails}
                  title="Click to view full wallet address & details"
                  className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/90 text-amber-900 border border-amber-300/70 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 group"
                >
                  <Eye className="w-3 h-3 text-amber-700 group-hover:text-amber-950 transition-colors" />
                  <span>{truncatedAddress}</span>
                </button>

                <button
                  onClick={onDisconnect}
                  className="text-xs font-semibold text-[#78716C] hover:text-rose-600 px-2 py-1"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={isConnecting}
                className="hidden sm:inline-flex items-center justify-center text-xs font-bold px-4 py-2.5 rounded-xl border border-[#EFEBE6] bg-white text-[#1C1917] hover:bg-[#F5F2EC] transition-all flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>{isConnecting ? 'Connecting...' : isLaceDetected ? 'Connect Lace Extension' : 'Connect Lace'}</span>
              </button>
            )}

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center justify-center text-xs font-bold px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#d97706] text-white shadow-md shadow-[#ea580c]/20 active:scale-95 transition-all gap-2"
            >
              <span>Open SaaS Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#f59e0b]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#ea580c]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Left Column */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100/90 rounded-full border border-amber-300/60 text-xs font-bold text-amber-900 mb-6 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#ea580c] text-[#ea580c]" />
            <span>Midnight ZK Disaster Relief & Shielded Escrow</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1C1917] leading-[1.12] mb-6">
            Give with Heart.<br />
            <span className="text-[#ea580c]">Stay Anonymous.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#78716C] font-normal leading-relaxed mb-8 max-w-xl">
            ReliefShield protects donor privacy and disaster victim dignity through Zero-Knowledge smart contract escrow circuits on the Midnight Network, ensuring 100% verified ledger transparency without exposing identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenTxModal}
              className="px-8 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:brightness-110 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-[#ea580c]/25 flex items-center justify-center gap-2.5 transition-all"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Start Transaction (Donate or Receive via QR)</span>
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-8 py-3.5 bg-white text-[#1C1917] border border-[#EFEBE6] text-sm font-bold rounded-xl hover:bg-[#F5F2EC] shadow-sm flex items-center justify-center gap-2.5 transition-all"
            >
              View Admin Dashboard
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-[#EFEBE6] w-full">
            <div>
              <p className="text-2xl font-black text-[#1C1917]">99.9%</p>
              <p className="text-xs text-[#78716C] font-normal mt-1">ZK Proof Verification Rate</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#ea580c] font-mono">${counterState.toLocaleString()} tNIGHT</p>
              <p className="text-xs text-[#78716C] font-normal mt-1">Total Public Relief Pool</p>
            </div>
          </div>
        </div>

        {/* Hero Right Column */}
        <div className="lg:col-span-6 relative flex justify-center items-center w-full z-10">
          <div className="w-full max-w-[540px] bg-white rounded-2xl border border-[#EFEBE6] shadow-2xl overflow-hidden relative">
            <div className="bg-[#FAF8F5] border-b border-[#EFEBE6] px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>
              <div className="text-[10px] text-[#78716C] font-mono bg-white px-6 py-0.5 rounded-md border border-[#EFEBE6] select-none">
                dashboard.reliefshield.org/zk-escrow
              </div>
              <div className="w-10" />
            </div>

            <div className="p-6 bg-[#FAF8F5]/50 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#EFEBE6] shadow-sm">
                  <span className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider block">Public Relief Pool</span>
                  <span className="text-lg font-black text-[#ea580c] font-mono mt-1 block">${counterState.toLocaleString()}.00</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#EFEBE6] shadow-sm relative overflow-hidden">
                  <span className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider block">Privacy Protocol</span>
                  <span className="text-sm font-bold text-amber-700 mt-1 block flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ZK Witness Active
                  </span>
                  <span className="absolute top-3 right-3 text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                    Preview
                  </span>
                </div>
              </div>

              {/* Interactive Form */}
              <form onSubmit={handleCircuitSubmit} className="bg-white p-5 rounded-xl border border-[#EFEBE6] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1C1917]">Shielded Contribution (tNIGHT)</span>
                  {isConnected && (
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      Bal: ${walletBalance.toLocaleString()} tNIGHT
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(Number(e.target.value))}
                    disabled={!isConnected || isExecutingCircuit}
                    className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-4 py-3 text-sm font-mono font-bold text-[#1C1917] focus:border-[#ea580c] outline-none"
                    placeholder="100.00"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isConnected || isExecutingCircuit}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-[#ea580c] hover:bg-[#d97706] shadow-md shadow-[#ea580c]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExecutingCircuit ? (
                    <span>Executing ZK Circuit locally...</span>
                  ) : !isConnected ? (
                    'Connect Wallet to Execute ZK Circuit'
                  ) : (
                    'Execute ZK Contribution Circuit'
                  )}
                </button>
              </form>

              {txResultHash && (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1.5 text-[11px] font-mono text-emerald-900">
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ZK Proof Verified & Ledger Updated
                    </span>
                    <span className="text-[10px] bg-emerald-100/90 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-800 break-all">
                    Tx: {txResultHash}
                  </p>
                  <a
                    href={`https://preview.midnightexplorer.com/transactions/${txResultHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-sans text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline pt-0.5"
                  >
                    <span>View on Midnight Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-[-24px] right-[-10px] md:right-[-20px] w-[190px] bg-white rounded-3xl border-4 border-[#1C1917] shadow-2xl overflow-hidden hidden sm:block animate-float cursor-pointer" onClick={onOpenTxModal}>
            <div className="bg-[#1C1917] h-4 w-28 mx-auto rounded-b-xl flex justify-center items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-600" />
            </div>
            <div className="p-3 bg-white text-left flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-[#EFEBE6] pb-1.5">
                <span className="text-[8px] font-bold text-[#78716C] font-mono">Aid QR Handoff</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex flex-col items-center bg-[#FAF8F5] p-2 rounded-xl border border-[#EFEBE6] text-center">
                <p className="text-[9px] font-bold text-[#1C1917]">Disaster Aid Verification</p>
                <div className="w-20 h-20 my-2 bg-white border border-[#EFEBE6] p-1.5 rounded-lg flex items-center justify-center">
                  <QrCode className="w-full h-full text-[#1C1917]" />
                </div>
                <span className="text-[8px] text-[#78716C]">Click to Claim Aid via QR</span>
              </div>
              <div className="bg-amber-100/80 rounded-lg p-1.5 border border-amber-300/60 text-center">
                <p className="text-[9px] font-bold text-amber-900">ZK Proof Verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Verified On-Chain Transactions Feed */}
      <LiveTransactionsFeed network={network as any} latestTxHash={txResultHash} />

      {/* 4-Step How It Works Section */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-24 text-center border-t border-[#EFEBE6]">
        <div className="mb-16">
          <span className="text-[#ea580c] text-xs font-bold uppercase tracking-widest block mb-3">Simple Handoff Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917]">How ReliefShield Works</h2>
          <p className="text-sm sm:text-base text-[#78716C] font-medium mt-3 max-w-2xl mx-auto">
            A frictionless zero-knowledge relief cycle designed to protect both the donor and the disaster victim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl border border-[#EFEBE6] p-8 shadow-sm text-center relative group hover:border-[#ea580c]/40 transition-all">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#EFEBE6]">01</span>
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-6 mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Connect Wallet</h3>
            <p className="text-xs text-[#78716C]">Donor connects Midnight Lace wallet without filling personal KYC forms.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EFEBE6] p-8 shadow-sm text-center relative group hover:border-[#ea580c]/40 transition-all">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#EFEBE6]">02</span>
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-6 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Execute ZK Circuit</h3>
            <p className="text-xs text-[#78716C]">Local Compact prover generates zero-knowledge proof in browser memory.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EFEBE6] p-8 shadow-sm text-center relative group hover:border-[#ea580c]/40 transition-all">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#EFEBE6]">03</span>
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-6 mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C1917] mb-2">QR Aid Verification</h3>
            <p className="text-xs text-[#78716C]">Disaster victims verify relief claim using secure QR handoff tokens.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EFEBE6] p-8 shadow-sm text-center relative group hover:border-[#ea580c]/40 transition-all">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#EFEBE6]">04</span>
            <div className="w-12 h-12 rounded-xl bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-6 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Automatic Settlement</h3>
            <p className="text-xs text-[#78716C]">Verified proof updates the public relief pool on-chain automatically.</p>
          </div>
        </div>
      </section>

      {/* Metrics Banner Section */}
      <section className="w-full bg-white border-y border-[#EFEBE6] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] font-mono">$500K+</p>
            <p className="text-xs text-[#78716C] font-semibold mt-1 uppercase tracking-wider">Processed Relief</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] font-mono">1,420+</p>
            <p className="text-xs text-[#78716C] font-semibold mt-1 uppercase tracking-wider">Shielded Donors</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] font-mono">100%</p>
            <p className="text-xs text-[#78716C] font-semibold mt-1 uppercase tracking-wider">ZK Verified</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] font-mono">99.9%</p>
            <p className="text-xs text-[#78716C] font-semibold mt-1 uppercase tracking-wider">Ledger Uptime</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#ea580c]">Zero</p>
            <p className="text-xs text-[#78716C] font-semibold mt-1 uppercase tracking-wider">Identity Leakage</p>
          </div>
        </div>
      </section>

      {/* 6 Core Capabilities Section */}
      <section id="features" className="w-full bg-[#FAF8F5] py-24 border-b border-[#EFEBE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#ea580c] text-xs font-bold uppercase tracking-widest block mb-3">Core Platform Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">Built for Zero-Knowledge Trust</h2>
            <p className="text-sm sm:text-base text-[#78716C] font-medium mt-3 max-w-2xl mx-auto">ReliefShield removes identity exposure while delivering complete public transaction verification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-[#EFEBE6] p-8 rounded-2xl shadow-sm hover:border-[#ea580c]/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#1C1917] mb-2">Smart ZK Escrow</h4>
              <p className="text-xs text-[#78716C] font-normal leading-relaxed">Donation funds are secured in Compact smart contracts before release to authorized disaster logistics.</p>
            </div>

            <div className="bg-white border border-[#EFEBE6] p-8 rounded-2xl shadow-sm hover:border-[#ea580c]/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-5">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#1C1917] mb-2">QR Aid Verification</h4>
              <p className="text-xs text-[#78716C] font-normal leading-relaxed">Disaster victims scan secure QR handoff codes for physical aid delivery without revealing legal names.</p>
            </div>

            <div className="bg-white border border-[#EFEBE6] p-8 rounded-2xl shadow-sm hover:border-[#ea580c]/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#1C1917] mb-2">Public Fund Transparency</h4>
              <p className="text-xs text-[#78716C] font-normal leading-relaxed">Real-time public tally on the Midnight Preprod ledger allows anyone to audit accumulated relief funds.</p>
            </div>

            <div className="bg-white border border-[#EFEBE6] p-8 rounded-2xl shadow-sm hover:border-[#ea580c]/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-5">
                <EyeOff className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#1C1917] mb-2">Donor Privacy Guarantee</h4>
              <p className="text-xs text-[#78716C] font-normal leading-relaxed">Private witness inputs remain inside your browser memory. Wallet addresses are never leaked on-chain.</p>
            </div>

            <div className="bg-white border border-[#EFEBE6] p-8 rounded-2xl shadow-sm hover:border-[#ea580c]/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#1C1917] mb-2">Instant Settlement</h4>
              <p className="text-xs text-[#78716C] font-normal leading-relaxed">Verified zero-knowledge circuits trigger immediate aid grant release to field units in under 5 seconds.</p>
            </div>

            <div className="bg-white border border-[#EFEBE6] p-8 rounded-2xl shadow-sm hover:border-[#ea580c]/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#ea580c] mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#1C1917] mb-2">Auditor Trust Alignment</h4>
              <p className="text-xs text-[#78716C] font-normal leading-relaxed">Align relief organizations and public donors with auditable, zero-knowledge cryptographic proofs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Privacy Claim & Audit Matrix */}
      <PrivacyMatrix network={network as any} />

      {/* Footer */}
      <footer className="w-full bg-[#1C1917] text-white py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base">ReliefShield</span>
          </div>

          <p className="text-stone-400">
            © 2026 ReliefShield — Midnight Builder Challenge Project
          </p>

          <div className="flex items-center gap-6 font-medium text-stone-300">
            <a href="https://github.com/NicoleAndreaBolus/Midnight-Andrea" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              GitHub Repo
            </a>
            <a href="https://midnight.network" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              Midnight Network
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
