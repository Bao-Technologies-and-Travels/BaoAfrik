import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'orange' | 'gray';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'white',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    white: 'text-white',
    orange: 'text-orange-500',
    gray: 'text-gray-600'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg 
        className="animate-spin" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        {/* Orange/colored dots */}
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeDasharray="8 4"
          className="opacity-75"
        />
        {/* Highlighted section */}
        <path 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          fill="currentColor"
          className="opacity-100"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
