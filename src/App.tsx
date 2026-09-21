import React, { useState } from 'react';
import { useMidnight } from './hooks/useMidnight';
import { ReliefShieldLanding } from './components/ReliefShieldLanding';
import { Sidebar } from './layouts/Sidebar';
import { TopNav } from './layouts/TopNav';
import { DashboardPage } from './pages/DashboardPage';
import { RequestsPage } from './pages/RequestsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CreateRequestModal } from './components/CreateRequestModal';
import { TransactionModal } from './components/TransactionModal';
import { WalletDetailsModal } from './components/WalletDetailsModal';
import { Toast } from './components/Toast';
import { ActiveTab, ReliefRequest, NotificationItem } from './types';
import { initialRequests, initialNotifications } from './data/seedData';
import { LayoutDashboard, Globe, ArrowLeftRight } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'saas'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requestsList, setRequestsList] = useState<ReliefRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<ReliefRequest | null>(null);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(initialNotifications);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Midnight Lace Wallet & ZK Circuit Hook
  const {
    isConnected,
    walletAddress,
    walletBalance,
    network,
    isConnecting,
    isLaceInstalled,
    error,
    connectWallet,
    disconnectWallet,
    executeCircuit,
    isExecutingCircuit,
    lastTxHash,
    counterState,
  } = useMidnight();

  const handleConnectClick = async () => {
    try {
      await connectWallet();
    } catch (err: any) {
      showToast(err?.message || 'Connection failed');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCreateRequest = (newReq: Partial<ReliefRequest>) => {
    const created = newReq as ReliefRequest;
    setRequestsList([created, ...requestsList]);
    showToast(`Request ${created.id} successfully created.`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationsCount = notificationsList.filter(n => !n.read).length;

  return (
    <div>
      {/* Floating Controls: Mode Switcher & Quick Transaction Hub */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#1C1917]/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-2xl flex items-center gap-1.5 font-sans text-xs">
        <button
          onClick={() => setViewMode('landing')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            viewMode === 'landing' ? 'bg-[#ea580c] text-[#FAF8F5] shadow-md' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Landing Flow</span>
        </button>
        
        <button
          onClick={() => setViewMode('saas')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            viewMode === 'saas' ? 'bg-blue-600 text-white shadow-md' : 'text-stone-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>SaaS Admin</span>
        </button>

        <div className="h-5 w-px bg-stone-800 mx-1" />

        <button
          onClick={() => setIsTxModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Donate / Receive via QR</span>
        </button>
      </div>

      {viewMode === 'landing' ? (
        /* ReliefShield Landing Page View */
        <ReliefShieldLanding
          isConnected={isConnected}
          walletAddress={walletAddress}
          walletBalance={walletBalance}
          isLaceDetected={isLaceInstalled}
          network={network}
          isConnecting={isConnecting}
          onConnect={handleConnectClick}
          onDisconnect={disconnectWallet}
          onOpenDashboard={() => setViewMode('saas')}
          onOpenTxModal={() => setIsTxModalOpen(true)}
          onOpenWalletDetails={() => setIsWalletDetailsOpen(true)}
          counterState={counterState}
          isExecutingCircuit={isExecutingCircuit}
          onExecuteCircuit={executeCircuit}
        />
      ) : (
        /* Enterprise SaaS Admin View */
        <div className="min-h-screen bg-surface-bg text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab !== 'request-detail') setSelectedRequest(null);
            }}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            unreadCount={unreadNotificationsCount}
          />

          <TopNav
            activeTab={activeTab}
            sidebarCollapsed={sidebarCollapsed}
            isConnected={isConnected}
            walletAddress={walletAddress}
            walletBalance={walletBalance}
            network={network}
            isConnecting={isConnecting}
            onConnect={handleConnectClick}
            onDisconnect={disconnectWallet}
            onOpenNotifications={() => setActiveTab('notifications')}
            onOpenWalletDetails={() => setIsWalletDetailsOpen(true)}
            unreadCount={unreadNotificationsCount}
          />

          <main
            className={`pt-20 pb-12 px-6 transition-all duration-300 ${
              sidebarCollapsed ? 'pl-24' : 'pl-72'
            }`}
          >
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && (
                <DashboardPage
                  onCreateRequest={() => setIsCreateModalOpen(true)}
                  onViewRequests={() => setActiveTab('requests')}
                  isConnected={isConnected}
                  counterState={counterState}
                  isExecutingCircuit={isExecutingCircuit}
                  lastTxHash={lastTxHash}
                  onExecuteCircuit={executeCircuit}
                />
              )}

              {activeTab === 'requests' && (
                <RequestsPage
                  requests={requestsList}
                  onCreateRequest={() => setIsCreateModalOpen(true)}
                  onSelectRequest={(req) => {
                    setSelectedRequest(req);
                    setActiveTab('request-detail');
                  }}
                />
              )}

              {activeTab === 'request-detail' && selectedRequest && (
                <RequestDetailPage
                  request={selectedRequest}
                  onBack={() => setActiveTab('requests')}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'organizations' && (
                <OrganizationsPage />
              )}

              {activeTab === 'reports' && (
                <ReportsPage onShowToast={showToast} />
              )}

              {activeTab === 'notifications' && (
                <NotificationsPage
                  notifications={notificationsList}
                  onMarkAllAsRead={handleMarkAllNotificationsRead}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage onShowToast={showToast} />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Transaction Hub Modal (Donate or Receive via QR) */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        isConnected={isConnected}
        onConnect={handleConnectClick}
        counterState={counterState}
        isExecutingCircuit={isExecutingCircuit}
        onExecuteCircuit={executeCircuit}
      />

      {/* Reusable Modals & Toasts */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
      />

      {/* Full Wallet Address & Account Details Modal */}
      <WalletDetailsModal
        isOpen={isWalletDetailsOpen}
        onClose={() => setIsWalletDetailsOpen(false)}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        network={network}
        onDisconnect={disconnectWallet}
      />

      {/* Error or Status Toast */}
      <Toast
        message={error || toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default App;
