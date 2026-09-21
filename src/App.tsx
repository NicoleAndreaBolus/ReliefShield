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
import { FieldOfficerPage } from './pages/FieldOfficerPage';
import { CreateRequestModal } from './components/CreateRequestModal';
import { TransactionModal } from './components/TransactionModal';
import { WalletDetailsModal } from './components/WalletDetailsModal';
import { CircuitExecutionModal } from './components/CircuitExecutionModal';
import { VerificationSuccessModal, VerificationSuccessData } from './components/VerificationSuccessModal';
import { Toast } from './components/Toast';
import { 
  ActiveTab, 
  ReliefRequest, 
  NotificationItem, 
  DonationRecord, 
  DisbursementRecord, 
  FieldOfficerStation 
} from './types';
import { 
  initialRequests, 
  initialNotifications, 
  initialDonations, 
  initialOfficerStations, 
  initialDisbursements 
} from './data/seedData';
import { LayoutDashboard, Globe, ArrowLeftRight, Truck } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'saas'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [requestsList, setRequestsList] = useState<ReliefRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<ReliefRequest | null>(null);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(initialNotifications);
  
  // Field Officer, Donations & Disbursements State
  const [donationsList, setDonationsList] = useState<DonationRecord[]>(initialDonations);
  const [officerStations, setOfficerStations] = useState<FieldOfficerStation[]>(initialOfficerStations);
  const [disbursementsList, setDisbursementsList] = useState<DisbursementRecord[]>(initialDisbursements);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Verification & Circuit Execution Modal States
  const [verificationData, setVerificationData] = useState<VerificationSuccessData | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [executingAmount, setExecutingAmount] = useState<number>(100);

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
    circuitStage,
    lastTxHash,
    counterState,
  } = useMidnight();

  const handleExecuteCircuitWithVerification = async (amount: number, campaign: string = 'Typhoon Relief') => {
    setExecutingAmount(amount);
    try {
      const result = await executeCircuit(amount);
      setVerificationData({
        txHash: result.txHash,
        amount,
        newPoolBalance: result.newBalance,
      });
      setIsVerificationModalOpen(true);

      // Add to live donations history
      const newDonation: DonationRecord = {
        id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
        campaign: (campaign as any) || 'Typhoon Relief',
        amount,
        donorType: walletAddress ? `Shielded ZK Donor (${walletAddress.slice(0, 8)}...)` : 'Shielded Contributor',
        timestamp: 'Just now',
        txHash: result.txHash,
        status: 'Confirmed On-Chain',
      };
      setDonationsList(prev => [newDonation, ...prev]);

      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleDisburseAid = (newDisb: DisbursementRecord) => {
    setDisbursementsList(prev => [newDisb, ...prev]);
    setOfficerStations(prev => prev.map(stn => {
      if (stn.officerName === newDisb.officerName || stn.assignedCategory === newDisb.category) {
        return {
          ...stn,
          currentStock: Math.max(0, stn.currentStock - 1)
        };
      }
      return stn;
    }));
  };

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
          onClick={() => {
            setViewMode('saas');
            if (activeTab === 'field-portal') setActiveTab('dashboard');
          }}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            viewMode === 'saas' && activeTab !== 'field-portal' ? 'bg-blue-600 text-white shadow-md' : 'text-stone-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>SaaS Admin</span>
        </button>

        <button
          onClick={() => {
            setViewMode('saas');
            setActiveTab('field-portal');
          }}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            viewMode === 'saas' && activeTab === 'field-portal' ? 'bg-[#ea580c] text-white shadow-md' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Field Portal</span>
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
          onExecuteCircuit={handleExecuteCircuitWithVerification}
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
                  onExecuteCircuit={handleExecuteCircuitWithVerification}
                />
              )}

              {activeTab === 'field-portal' && (
                <FieldOfficerPage
                  stations={officerStations}
                  donations={donationsList}
                  disbursements={disbursementsList}
                  counterState={counterState}
                  isConnected={isConnected}
                  onExecuteCircuit={handleExecuteCircuitWithVerification}
                  onDisburseAid={handleDisburseAid}
                  onShowToast={showToast}
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
        onExecuteCircuit={handleExecuteCircuitWithVerification}
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

      {/* Live ZK Circuit Execution Progress Modal */}
      <CircuitExecutionModal
        isOpen={isExecutingCircuit}
        stage={circuitStage}
        amount={executingAmount}
      />

      {/* Post-Signing On-Chain Verification Success Modal */}
      <VerificationSuccessModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        data={verificationData}
        network={network}
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
