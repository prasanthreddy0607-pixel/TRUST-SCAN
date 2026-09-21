import React from 'react';
import { ShieldCheck, UserCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search screening ID, passport number, or candidate name..."
            className="w-full bg-slate-100/70 border border-slate-200/90 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all font-sans"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/screen/new')}
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">New Screening</span>
        </button>

        {/* Demo Mode Button */}
        <button
          onClick={() => navigate('/demo-mode')}
          className="bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200 text-xs font-medium px-3 py-2 rounded-xl transition-all"
        >
          Try Demo
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-teal-600">
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Officer J. Vance</p>
            <p className="text-[10px] text-slate-500 font-mono">Checkpoint Alpha-4</p>
          </div>
        </div>
      </div>
    </header>
  );
};
