import React from 'react';
import { ShieldCheck, UserCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#FAEED1]/95 dark:bg-[#281B12]/90 backdrop-blur-md border-b border-[#EEDCB2] dark:border-[#4A3324] px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8A715C] dark:text-[#C8A889] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search screening ID, passport number, or candidate name..."
            className="w-full bg-[#FDF7E4] dark:bg-[#1C110A]/60 border border-[#EEDCB2] dark:border-[#4A3324] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#2C1A0E] dark:text-[#F9EBD5] placeholder-[#8A715C] dark:placeholder-[#C8A889]/60 focus:outline-none focus:bg-[#FAEED1] dark:focus:bg-[#281B12] focus:border-[#8B5320] dark:focus:border-[#D39F67] focus:ring-1 focus:ring-[#8B5320]/20 transition-all font-sans"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">

        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/screen/new')}
          className="bg-[#8B5320] hover:bg-[#6B3E16] text-[#FFF7ED] text-xs font-bold px-4 py-2.5 rounded-xl border-2 border-[#6B3E16] flex items-center gap-2 shadow-md transition-all active:translate-y-0.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">New Screening</span>
        </button>

        {/* Demo Mode Button */}
        <button
          onClick={() => navigate('/demo-mode')}
          className="bg-[#FDF7E4] dark:bg-[#382619] hover:bg-[#FAEED1] dark:hover:bg-[#4A3324] text-[#392210] dark:text-[#F9EBD5] border-2 border-[#DCC391] dark:border-[#6B3E16] text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all active:translate-y-0.5"
        >
          Try Demo
        </button>

        <div className="h-6 w-px bg-[#EEDCB2] dark:bg-[#4A3324]"></div>

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FDF7E4] dark:bg-[#382619] border border-[#DCC391] dark:border-[#6B3E16] flex items-center justify-center text-[#8B5320] dark:text-[#D39F67]">
            <UserCheck className="w-4 h-4 text-[#8B5320] dark:text-[#D39F67]" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-[#2C1A0E] dark:text-[#F9EBD5] leading-tight">Officer J. Vance</p>
            <p className="text-[10px] text-[#6E5745] dark:text-[#C8A889] font-mono">Checkpoint Alpha-4</p>
          </div>
        </div>
      </div>
    </header>
  );
};
