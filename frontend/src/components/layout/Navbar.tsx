import React from 'react';
import { ShieldCheck, UserCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white/90 dark:bg-[#121b24]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#458393]/30 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#458393] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search screening ID, passport number, or candidate name..."
            className="w-full bg-slate-100 dark:bg-[#0c1218]/80 border border-slate-300 dark:border-[#458393]/40 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-[#FFF3C8] placeholder-slate-400 focus:outline-none focus:border-[#34A99D] focus:ring-1 focus:ring-[#34A99D]/50 transition-all font-sans"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dark / Light Theme Toggle */}
        <ThemeToggle />

        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/screen/new')}
          className="bg-[#34A99D] hover:bg-[#2c9389] text-[#0c1218] text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-[#34A99D]/20 transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">New Screening</span>
        </button>

        {/* Demo Mode Button */}
        <button
          onClick={() => navigate('/demo-mode')}
          className="bg-slate-100 dark:bg-[#192633] hover:bg-slate-200 dark:hover:bg-[#233445] text-slate-700 dark:text-[#FFF3C8] border border-slate-300 dark:border-[#458393]/40 text-xs font-medium px-3 py-2 rounded-xl transition-all"
        >
          Try Demo
        </button>

        <div className="h-6 w-px bg-slate-300 dark:bg-[#458393]/30"></div>

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#192633] border border-slate-300 dark:border-[#458393]/40 flex items-center justify-center text-[#34A99D]">
            <UserCheck className="w-4 h-4 text-[#34A99D]" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-[#FFF3C8] leading-tight">Officer J. Vance</p>
            <p className="text-[10px] text-slate-500 dark:text-[#E5CB90] font-mono">Checkpoint Alpha-4</p>
          </div>
        </div>
      </div>
    </header>
  );
};
