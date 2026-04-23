'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, hover = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'glass rounded-2xl p-6',
        hover && 'cursor-pointer hover:shadow-[0_0_24px_rgba(0,206,200,0.3)] transition-shadow duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
