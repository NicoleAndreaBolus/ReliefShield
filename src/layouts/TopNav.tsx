import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Wallet, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck,
  Coins,
  Eye
} from 'lucide-react';
import { ActiveTab } from '../types';

interface TopNavProps {
  activeTab: ActiveTab;
  sidebarCollapsed: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  walletBalance?: number;
  network: string;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenNotifications: () => void;
  onOpenWalletDetails?: () => void;
  unreadCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  sidebarCollapsed,
  isConnected,
  walletAddress,
  walletBalance = 2450,
  network,
  isConnecting,
  onConnect,
  onDisconnect,
  onOpenNotifications,
  onOpenWalletDetails,
  unreadCount,
}) => {
  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Platform Overview';
      case 'requests': return 'Requests & Case Management';
      case 'request-detail': return 'Case Details View';
      case 'organizations': return 'Organizations & Directory';
      case 'reports': return 'Performance & Analytics';
      case 'notifications': return 'Notification Center';
      case 'settings': return 'Platform Settings';
      default: return 'Dashboard';
    }
  };

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`
    : '';

  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFEBE6] z-30 transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left Breadcrumb & Page Title */}
      <div className="flex items-center gap-3">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#78716C] font-medium">
            <span>ReliefShield</span>
            <span>/</span>
            <span className="text-[#1C1917] capitalize">{activeTab.replace('-', ' ')}</span>
          </nav>
          <h1 className="text-lg font-bold text-[#1C1917] leading-tight">
            {getPageTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right Actions & Controls */}
      <div className="flex items-center gap-4">
        {/* Compact Search */}
        <div className="relative hidden md:block w-56">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search requests, IDs..."
            className="w-full bg-white border border-[#EFEBE6] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#ea580c] outline-none transition-all"
          />
        </div>

        {/* Midnight Network Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-[11px] font-mono text-amber-900 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
          <span>Midnight <strong className="text-[#ea580c]">PREPROD</strong></span>
        </div>

        {/* Wallet Connect Control & Account Balance Pill */}
        {isConnected ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>{walletBalance.toLocaleString()} tNIGHT</span>
            </div>

            <button
              type="button"
              onClick={onOpenWalletDetails}
              title="Click to view full wallet address & details"
              className="px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/90 border border-amber-300/70 text-xs font-mono font-semibold text-amber-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 group"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{truncatedAddress}</span>
              <Eye className="w-3 h-3 text-amber-700 group-hover:text-amber-950 ml-0.5 transition-colors" />
            </button>
            <button
              onClick={onDisconnect}
              className="text-xs font-semibold text-[#78716C] hover:text-rose-600 px-2 py-1 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="px-4 py-1.5 rounded-xl bg-[#ea580c] hover:bg-[#d97706] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{isConnecting ? 'Connecting...' : 'Connect Lace'}</span>
          </button>
        )}

        <div className="h-6 w-px bg-[#EFEBE6] mx-1" />

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-white rounded-xl border border-transparent hover:border-[#EFEBE6] transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ea580c] rounded-full" />
          )}
        </button>

        {/* Help Icon */}
        <button
          className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-white rounded-xl border border-transparent hover:border-[#EFEBE6] transition-all hidden sm:block"
          title="Help & Midnight Docs"
          onClick={() => window.open('https://docs.midnight.network', '_blank')}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 cursor-pointer border-l border-[#EFEBE6] pl-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-8 h-8 rounded-xl object-cover border border-[#EFEBE6]"
          />
          <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
        </div>
      </div>
    </header>
  );
};
