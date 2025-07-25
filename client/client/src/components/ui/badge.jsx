// Color variants with YOUR brand colors
const variants = {
  default: 'border-transparent bg-primary text-white hover:bg-primary/90',
  secondary: 'border-transparent bg-secondary text-dark hover:bg-secondary/90', 
  success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  error: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
  info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
  outline: 'border-gray-300 text-dark bg-transparent hover:bg-gray-50',
  navy: 'border-transparent bg-dark text-white hover:bg-dark/90'
};import React from 'react';

// Simple utility function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Badge = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  ...props 
}) => {
  // Base styles
  const baseClasses = 'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  // Size variants
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    large: 'px-3 py-1 text-sm'
  };
  
  // Color variants
  const variants = {
    default: 'border-transparent bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
    success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
    destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
    info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
    primary: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50'
  };

  const variantClasses = variants[variant] || variants.default;
  const sizeClass = sizeClasses[size] || sizeClasses.default;

  return (
    <div 
      className={cn(baseClasses, sizeClass, variantClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Export both named and default for compatibility
export { Badge };
export default Badge;
