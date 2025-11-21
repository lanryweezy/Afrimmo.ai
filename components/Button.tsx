import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'normal' | 'small';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading = false, 
  icon, 
  variant = 'primary',
  size = 'normal',
  className = '', 
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center font-semibold rounded-xl focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95';
  
  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20',
  };

  const sizeClasses = {
    normal: 'py-2.5 px-5 text-sm',
    small: 'py-1.5 px-3 text-xs'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
            <Spinner />
            <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;