import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'low' | 'medium' | 'high' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className = '' }) => {
  let styleClass = 'bg-[#F4EAD9] dark:bg-[#382619] text-[#52351B] dark:text-[#F9EBD5] border border-[#D6BB9B] dark:border-[#6B3E16] px-2.5 py-0.5 rounded-full text-xs font-semibold';
  
  if (variant === 'low') styleClass = 'badge-low';
  if (variant === 'medium') styleClass = 'badge-medium';
  if (variant === 'high') styleClass = 'badge-high';
  if (variant === 'info') styleClass = 'bg-[#F4EAD9] dark:bg-[#382619] text-[#8B5320] dark:text-[#D39F67] border border-[#D6BB9B] dark:border-[#6B3E16] px-2.5 py-0.5 rounded-full text-xs font-semibold';

  return (
    <span className={`${styleClass} ${className}`}>
      {label}
    </span>
  );
};
