import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FilePlus, 
  GitCompare, 
  History, 
  FileText, 
  Sparkles, 
  Settings 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/screen/new', label: 'New Screening', icon: FilePlus },
    { to: '/compare', label: 'Compare Documents', icon: GitCompare },
    { to: '/demo-mode', label: 'Demo Mode', icon: Sparkles, badge: 'Preset Scenarios' },
    { to: '/history', label: 'Screening History', icon: History },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#FAEED1] dark:bg-[#281B12] border-r border-[#EEDCB2] dark:border-[#4A3324] flex flex-col h-screen sticky top-0 z-30 select-none transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#EEDCB2] dark:border-[#4A3324] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDF7E4] dark:bg-[#382619] border border-[#DCC391] dark:border-[#6B3E16] flex items-center justify-center text-[#8B5320] dark:text-[#D39F67] shadow-sm">
          <ShieldAlert className="w-5 h-5 text-[#8B5320] dark:text-[#D39F67]" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wider text-[#2C1A0E] dark:text-[#F9EBD5] flex items-center gap-1">
            TRUST<span className="text-[#8B5320] dark:text-[#D39F67] font-extrabold">SCAN</span>
          </h1>
          <p className="text-[10px] text-[#8A715C] dark:text-[#C8A889] font-mono tracking-tight uppercase">Border Screening OS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-[#8A715C] dark:text-[#C8A889]/80 uppercase tracking-wider font-mono">
          Inspection Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#FDF7E4] dark:bg-[#382619] text-[#8B5320] dark:text-[#F9EBD5] border border-[#DCC391] dark:border-[#6B3E16] font-semibold shadow-sm'
                    : 'text-[#6E5745] dark:text-[#C8A889] hover:text-[#2C1A0E] dark:hover:text-[#F9EBD5] hover:bg-[#FDF7E4]/70 dark:hover:bg-[#382619]/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-[#FDF7E4] dark:bg-[#3D2914] text-[#B87322] dark:text-[#F2C994] border border-[#EEDCB2] dark:border-[#B87322]/40 px-2 py-0.5 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footprint */}
      <div className="p-4 border-t border-[#EEDCB2] dark:border-[#4A3324] bg-[#FDF7E4]/50 dark:bg-[#1C110A]/60 text-xs">
        <div className="flex items-center justify-between text-[#8A715C] dark:text-[#C8A889] mb-1">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#8B5320] dark:bg-[#D39F67] animate-pulse"></span>
            Node Status
          </span>
          <span className="font-mono text-[10px] text-[#8B5320] dark:text-[#D39F67] font-semibold">ONLINE</span>
        </div>
        <p className="text-[10px] text-[#8A715C] dark:text-[#C8A889]/80 truncate font-mono">Decision-Support v1.0.0</p>
      </div>
    </aside>
  );
};
