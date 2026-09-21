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
  let colorStyles = 'text-indigo-400 bg-indigo-500/15 border-indigo-500/25';
  if (color === 'red') colorStyles = 'text-rose-400 bg-rose-500/15 border-rose-500/25';
  if (color === 'amber') colorStyles = 'text-amber-400 bg-amber-500/15 border-amber-500/25';
  if (color === 'emerald') colorStyles = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25';

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
