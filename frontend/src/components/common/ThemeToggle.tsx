import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-200 border flex items-center gap-1.5 text-xs font-semibold select-none ${
        theme === 'dark'
          ? 'bg-[#192633] text-[#FFF3C8] border-[#458393]/40 hover:bg-[#233445] shadow-sm'
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm'
      } ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-[#E5CB90]" />
          <span className="hidden sm:inline font-mono">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#34A99D]" />
          <span className="hidden sm:inline font-mono">Dark Mode</span>
        </>
      )}
    </button>
  );
};
