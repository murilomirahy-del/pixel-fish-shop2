import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  children: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  color = 'blue', 
  children, 
  className = '', 
  disabled,
  ...props 
}) => {
  
  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-400 border-blue-700 text-white',
    green: 'bg-green-500 hover:bg-green-400 border-green-700 text-white',
    red: 'bg-red-500 hover:bg-red-400 border-red-700 text-white',
    yellow: 'bg-yellow-400 hover:bg-yellow-300 border-yellow-600 text-black',
    gray: 'bg-gray-500 border-gray-700 text-gray-300',
  };

  const finalColor = disabled ? colors.gray : colors[color];

  return (
    <button
      disabled={disabled}
      className={`
        ${finalColor} 
        border-b-4 border-r-4 
        px-4 py-2 
        font-pixel text-xs sm:text-sm
        pixel-btn
        uppercase
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
