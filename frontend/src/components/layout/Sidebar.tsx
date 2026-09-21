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
    <aside className="w-64 bg-white dark:bg-[#121b24] border-r border-slate-200 dark:border-[#458393]/30 flex flex-col h-screen sticky top-0 z-30 select-none transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-[#458393]/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#34A99D]/15 border border-[#34A99D]/30 flex items-center justify-center text-[#34A99D] shadow-md shadow-[#34A99D]/10">
          <ShieldAlert className="w-5 h-5 text-[#34A99D]" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wider text-slate-800 dark:text-[#FFF3C8] flex items-center gap-1">
            TRUST<span className="text-[#34A99D] font-extrabold">SCAN</span>
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-[#E5CB90] font-mono tracking-tight uppercase">Border Screening OS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-medium text-slate-400 dark:text-[#458393] uppercase tracking-wider font-mono">
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
                    ? 'bg-[#34A99D]/15 text-[#34A99D] border border-[#34A99D]/30 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#FFF3C8] hover:bg-slate-100 dark:hover:bg-[#192633]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-[#E5CB90]/20 text-amber-800 dark:text-[#E5CB90] border border-[#E5CB90]/30 px-2 py-0.5 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footprint */}
      <div className="p-4 border-t border-slate-200 dark:border-[#458393]/30 bg-slate-50 dark:bg-[#0c1218]/80 text-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#34A99D] animate-pulse"></span>
            Node Status
          </span>
          <span className="font-mono text-[10px] text-[#34A99D]">ONLINE</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-[#E5CB90] truncate font-mono">Decision-Support v1.0.0</p>
      </div>
    </aside>
  );
};
