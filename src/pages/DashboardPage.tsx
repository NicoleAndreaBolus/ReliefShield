import React, { useState } from 'react';
import { 
  FileText, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  ShieldCheck, 
  ArrowUpRight,
  Shield,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { initialChartData, initialActivities } from '../data/seedData';
import { RELIEF_SHIELD_CONTRACT_CONFIG } from '../utils/contract';

interface DashboardPageProps {
  onCreateRequest: () => void;
  onViewRequests: () => void;
  isConnected: boolean;
  counterState: number;
  isExecutingCircuit: boolean;
  lastTxHash: string | null;
  onExecuteCircuit: (amount: number) => Promise<{ txHash: string; newBalance: number }>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onCreateRequest,
  onViewRequests,
  isConnected,
  counterState,
  isExecutingCircuit,
  lastTxHash,
  onExecuteCircuit,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '3M' | '1Y'>('7D');
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [circuitSuccess, setCircuitSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentContractAddress = RELIEF_SHIELD_CONTRACT_CONFIG.contractAddress;

  const handleCircuitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    try {
      const res = await onExecuteCircuit(donationAmount);
      setCircuitSuccess(res.txHash);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const statCards = [
    {
      label: 'Total Requests',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      subtext: 'vs last month',
      icon: FileText,
      iconColor: 'text-[#ea580c]',
      iconBg: 'bg-amber-100/80',
    },
    {
      label: 'Active Cases',
      value: '324',
      change: '+8.2%',
      trend: 'up',
      subtext: 'vs last month',
      icon: Activity,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100/80',
    },
    {
      label: 'Completed',
      value: '856',
      change: '+14.3%',
      trend: 'up',
      subtext: 'vs last month',
      icon: CheckCircle2,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
    },
    {
      label: 'Pending Review',
      value: '68',
      change: '-5.4%',
      trend: 'down',
      subtext: 'vs last month',
      icon: Clock,
      iconColor: 'text-rose-700',
      iconBg: 'bg-rose-100/80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Greeting & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1C1917] tracking-tight">Good morning, Admin</h2>
          <p className="text-xs text-[#78716C] font-medium">Here's an overview of your platform activity & Midnight ZK status.</p>
        </div>
        <button
          onClick={onCreateRequest}
          className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#d97706] text-white font-bold text-xs shadow-md shadow-[#ea580c]/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Request</span>
        </button>
      </div>

      {/* Contract Address Status Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              Midnight Preview Contract Address
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Deployed & Verified
            </span>
          </div>
          <p className="text-xs font-mono text-[#1C1917] font-bold break-all">
            {currentContractAddress}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://preview.midnightexplorer.com/contracts/${currentContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/20"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>View on Explorer</span>
          </a>

          <button
            onClick={() => copyToClipboard(currentContractAddress)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#EFEBE6] hover:bg-stone-200/60 text-[#1C1917] font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#1C1917] font-mono tracking-tight">{stat.value}</span>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#78716C] mt-1">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Section */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1C1917]">Activity Overview</h3>
              <p className="text-xs text-[#78716C]">Submitted vs Completed relief requests</p>
            </div>
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl text-xs font-semibold text-[#78716C] border border-[#EFEBE6]">
              {(['7D', '30D', '3M', '1Y'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    timeFilter === filter ? 'bg-white text-[#ea580c] shadow-sm font-bold border border-[#EFEBE6]' : 'hover:text-[#1C1917]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={initialChartData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f2ec" />
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716c" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#efebe6', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Requests" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
                <Area type="monotone" dataKey="Completed" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive ZK Circuit Action Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
                Midnight Smart Contract
              </span>
              <Lock className="w-4 h-4 text-[#ea580c]" />
            </div>

            <h3 className="text-lg font-bold text-[#1C1917] mt-3">Execute ZK Relief Circuit</h3>
            <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
              Contribute to the public relief pool using Zero-Knowledge proofs. Your private witness remains on your machine.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFEBE6] flex items-center justify-between">
              <span className="text-xs text-[#78716C] font-medium">Public Relief Pool:</span>
              <span className="text-xl font-extrabold text-[#ea580c] font-mono">${counterState.toLocaleString()} tNIGHT</span>
            </div>
          </div>

          <form onSubmit={handleCircuitSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#78716C]">Shielded Amount (tNIGHT)</label>
              <input
                type="number"
                min="1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                disabled={!isConnected || isExecutingCircuit}
                className="w-full bg-[#FAF8F5] border border-[#EFEBE6] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-mono focus:border-[#ea580c] outline-none disabled:opacity-50"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span>Proved with shielded donor identity</span>
            </div>

            <button
              type="submit"
              disabled={!isConnected || isExecutingCircuit}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#ea580c] hover:bg-[#d97706] shadow-md shadow-[#ea580c]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isExecutingCircuit ? (
                <span>Executing ZK Circuit...</span>
              ) : !isConnected ? (
                'Connect Wallet to Execute'
              ) : (
                'Execute Circuit (Shielded Contribution)'
              )}
            </button>
          </form>

          {circuitSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-mono break-all space-y-1">
              <div>✓ Tx Hash: {circuitSuccess.slice(0, 24)}...</div>
              <a
                href={`https://preview.midnightexplorer.com/transactions/${circuitSuccess.startsWith('0x') ? circuitSuccess : `0x${circuitSuccess}`}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                View on Midnight Explorer →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFEBE6] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1C1917]">Recent Activity</h3>
            <p className="text-xs text-[#78716C]">Real-time audit log of platform actions</p>
          </div>
          <button
            onClick={onViewRequests}
            className="text-xs font-semibold text-[#ea580c] hover:text-[#d97706] flex items-center gap-1"
          >
            <span>View all cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EFEBE6]">
          {initialActivities.map((act) => (
            <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={act.user}
                  alt={act.user}
                  className="w-8 h-8 rounded-full object-cover border border-[#EFEBE6]"
                />
                <div>
                  <p className="text-xs font-bold text-[#1C1917]">{act.user}</p>
                  <p className="text-xs text-[#78716C]">{act.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  act.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  act.status === 'Pending' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {act.status}
                </span>
                <p className="text-[11px] text-[#78716C] mt-0.5">{act.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
