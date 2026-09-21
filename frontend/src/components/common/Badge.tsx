import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'low' | 'medium' | 'high' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className = '' }) => {
  let styleClass = 'bg-[#192633] text-[#E5CB90] border border-[#458393]/40 px-2.5 py-0.5 rounded-full text-xs font-semibold';
  
  if (variant === 'low') styleClass = 'badge-low';
  if (variant === 'medium') styleClass = 'badge-medium';
  if (variant === 'high') styleClass = 'badge-high';
  if (variant === 'info') styleClass = 'bg-[#458393]/20 text-[#FFF3C8] border border-[#458393]/40 px-2.5 py-0.5 rounded-full text-xs font-semibold';

  return (
    <span className={`${styleClass} ${className}`}>
      {label}
    </span>
  );
};
