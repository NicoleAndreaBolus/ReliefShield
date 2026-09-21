import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Radio,
  Truck
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  unreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  unreadCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'field-portal', label: 'Field Officer Portal', icon: Truck },
    { id: 'requests', label: 'Requests / Cases', icon: FileText },
    { id: 'organizations', label: 'Organizations & Users', icon: Building2 },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-[#EFEBE6] text-[#1C1917] transition-all duration-300 flex flex-col justify-between shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top App Branding */}
      <div>
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#EFEBE6]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f59e0b] via-[#ea580c] to-[#d97706] p-0.5 shadow-md shadow-[#ea580c]/20 shrink-0">
              <div className="w-full h-full bg-[#FAF8F5] rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#d97706]" />
              </div>
            </div>
            {!collapsed && (
              <div className="whitespace-nowrap">
                <span className="font-extrabold text-lg text-[#1C1917] tracking-tight">Relief<span className="text-[#ea580c]">Shield</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] block -mt-1">SaaS Admin</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg bg-[#FAF8F5] hover:bg-stone-200/60 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-all shrink-0 border border-[#EFEBE6]"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'request-detail' && item.id === 'requests');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all relative group ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-md shadow-[#ea580c]/25'
                    : 'text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1C1917]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#78716C] group-hover:text-[#1C1917]'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                
                {item.badge && (
                  <span
                    className={`ml-auto font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#ea580c]' : 'bg-[#ea580c] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-[#EFEBE6]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF8F5] border border-[#EFEBE6]">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-9 h-9 rounded-xl object-cover border border-[#EFEBE6] shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1C1917] truncate">John Doe</p>
              <p className="text-[11px] text-[#78716C] truncate">Platform Administrator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
