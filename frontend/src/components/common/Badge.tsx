import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'low' | 'medium' | 'high' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className = '' }) => {
  let styleClass = 'bg-slate-100 dark:bg-[#192633] text-slate-800 dark:text-[#E5CB90] border border-slate-300 dark:border-[#458393]/40 px-2.5 py-0.5 rounded-full text-xs font-semibold';
  
  if (variant === 'low') styleClass = 'badge-low';
  if (variant === 'medium') styleClass = 'badge-medium';
  if (variant === 'high') styleClass = 'badge-high';
  if (variant === 'info') styleClass = 'bg-teal-50 dark:bg-[#458393]/20 text-teal-800 dark:text-[#FFF3C8] border border-teal-200 dark:border-[#458393]/40 px-2.5 py-0.5 rounded-full text-xs font-semibold';

  return (
    <span className={`${styleClass} ${className}`}>
      {label}
    </span>
  );
};
