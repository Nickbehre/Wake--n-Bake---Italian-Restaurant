'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  className?: string
}

const variantStyles = {
  primary: 'bg-tomato text-white',
  secondary: 'bg-crust text-espresso',
  success: 'bg-pistachio text-espresso',
  warning: 'bg-mortadella text-espresso',
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs font-montserrat font-bold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
