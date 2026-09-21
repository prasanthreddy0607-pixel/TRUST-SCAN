import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  let base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  let sizeStyles = 'px-4 py-2 text-xs';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-xs';
  if (size === 'lg') sizeStyles = 'px-6 py-3 text-sm';

  let variantStyles = 'bg-[#34A99D] hover:bg-[#2c9389] text-slate-950 font-bold shadow-md shadow-[#34A99D]/20';
  if (variant === 'secondary') variantStyles = 'bg-slate-100 dark:bg-[#192633] hover:bg-slate-200 dark:hover:bg-[#233445] text-slate-800 dark:text-[#FFF3C8] border border-slate-300 dark:border-[#458393]/50';
  if (variant === 'danger') variantStyles = 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20';
  if (variant === 'ghost') variantStyles = 'bg-transparent hover:bg-slate-200/60 dark:hover:bg-[#192633] text-slate-700 dark:text-[#FFF3C8]';
  if (variant === 'outline') variantStyles = 'bg-transparent border border-[#34A99D] text-[#2c8d83] dark:text-[#34A99D] hover:bg-[#34A99D]/10 font-semibold';

  return (
    <button className={`${base} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};
