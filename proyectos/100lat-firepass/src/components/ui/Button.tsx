'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-brand-green text-white hover:opacity-90 active:scale-95',
  secondary: 'bg-brand-blue text-white hover:opacity-90 active:scale-95',
  gold: 'bg-brand-gold text-brand-blue font-bold hover:opacity-90 active:scale-95',
  outline: 'border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white active:scale-95',
};

const sizeClasses = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'lg',
  children,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-2xl font-semibold
        transition-all duration-150
        shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
