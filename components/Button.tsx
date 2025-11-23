import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  as?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  as: Component = 'button',
  ...props 
}) => {
  // Base styles shared across all variants
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
  
  // Determine disabled state
  const isDisabled = isLoading || props.disabled;

  // Use manual classes for disabled state since 'span' doesn't support :disabled pseudo-class
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
  };

  // Filter out disabled from props if not a button to avoid invalid HTML attribute
  const { disabled, ...restProps } = props;

  return (
    <Component 
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled ? "true" : undefined}
      {...restProps}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </Component>
  );
};