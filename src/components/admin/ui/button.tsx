import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  let base =
    'px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none'
  let color =
    variant === 'primary'
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : variant === 'secondary'
      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      : 'bg-red-500 hover:bg-red-600 text-white'

  return (
    <button className={`${base} ${color} ${className}`} {...props}>
      {children}
    </button>
  )
}
