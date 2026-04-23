import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-cyan text-obsidian hover:bg-teal shadow-[0_0_16px_rgba(0,206,200,0.4)] hover:shadow-[0_0_24px_rgba(0,206,200,0.6)]',
        outline:
          'border border-[var(--glass-border)] bg-transparent text-[var(--accent-cyan)] hover:bg-[var(--glass-bg)] hover:border-cyan',
        ghost:
          'bg-transparent text-[var(--text-primary)] hover:bg-[var(--glass-bg)]',
        destructive:
          'bg-red-600 text-white hover:bg-red-700',
        secondary:
          'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border border-[var(--glass-border)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
