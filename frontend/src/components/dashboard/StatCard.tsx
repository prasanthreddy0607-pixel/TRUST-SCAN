import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'red' | 'amber' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue'
}) => {
  let colorStyles = 'text-[#8B5320] dark:text-[#D39F67] bg-[#F4EAD9] dark:bg-[#382619] border-[#D6BB9B] dark:border-[#6B3E16]';
  if (color === 'red') colorStyles = 'text-[#C0392B] dark:text-[#F8B4B4] bg-[#FDE8E8] dark:bg-[#3E1A17] border-[#F8B4B4] dark:border-[#C0392B]/40';
  if (color === 'amber') colorStyles = 'text-[#B87322] dark:text-[#F2C994] bg-[#FDF3E6] dark:bg-[#3D2914] border-[#F5D8B3] dark:border-[#B87322]/40';
  if (color === 'emerald') colorStyles = 'text-[#2E7D5E] dark:text-[#A8E6CF] bg-[#E8F5EE] dark:bg-[#1B382B] border-[#A3D9C3] dark:border-[#2E7D5E]/40';

  return (
    <div className="glass-panel p-5 glass-panel-hover flex items-start justify-between">
      <div>
        <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 tracking-tight">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl border ${colorStyles}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
