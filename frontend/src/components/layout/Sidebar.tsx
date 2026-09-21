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
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 z-30 select-none transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wider text-slate-900 flex items-center gap-1">
            TRUST<span className="text-teal-600 font-extrabold">SCAN</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase">Border Screening OS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
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
                    ? 'bg-teal-50 text-teal-700 border border-teal-200/80 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footprint */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/60 text-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Node Status
          </span>
          <span className="font-mono text-[10px] text-teal-700 font-semibold">ONLINE</span>
        </div>
        <p className="text-[10px] text-slate-500 truncate font-mono">Decision-Support v1.0.0</p>
      </div>
    </aside>
  );
};
