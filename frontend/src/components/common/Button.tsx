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
  let base = 'inline-flex items-center justify-center font-bold tracking-wide rounded-xl border-2 transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5';
  
  let sizeStyles = 'px-5 py-2.5 text-sm';
  if (size === 'sm') sizeStyles = 'px-4 py-2 text-xs';
  if (size === 'lg') sizeStyles = 'px-7 py-3.5 text-base';

  let variantStyles = 'bg-[#8B5320] hover:bg-[#6B3E16] text-[#FFF7ED] border-[#6B3E16] shadow-md shadow-[#8B5320]/30';
  if (variant === 'secondary') variantStyles = 'bg-[#FAEED1] dark:bg-[#382619] hover:bg-[#FDF7E4] dark:hover:bg-[#4A3324] text-[#392210] dark:text-[#F9EBD5] border-[#DCC391] dark:border-[#6B3E16] shadow-sm';
  if (variant === 'danger') variantStyles = 'bg-[#C0392B] hover:bg-[#A93226] text-white border-[#922B21] shadow-md shadow-[#C0392B]/25';
  if (variant === 'ghost') variantStyles = 'bg-transparent border-transparent hover:bg-[#F4EAD9]/70 dark:hover:bg-[#382619] text-[#52351B] dark:text-[#F9EBD5]';
  if (variant === 'outline') variantStyles = 'bg-transparent border-[#8B5320] dark:border-[#D39F67] text-[#8B5320] dark:text-[#D39F67] hover:bg-[#8B5320]/10 font-bold shadow-sm';

  return (
    <button className={`${base} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};
