import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = {
    variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variantStyles = {
    default: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-gray-700 text-gray-300 hover:text-gray-100'
}

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'default',
    size = 'md',
    className,
    children,
    disabled,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            disabled={disabled}
            className={twMerge(
                'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = 'Button'
