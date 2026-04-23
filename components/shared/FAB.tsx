'use client'

import { motion } from 'framer-motion'
import { MessageSquarePlus } from 'lucide-react'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open request form"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-obsidian shadow-[0_0_20px_rgba(0,206,200,0.5)] ring-2 ring-cyan/30 transition-shadow hover:shadow-[0_0_32px_rgba(0,206,200,0.7)] focus:outline-none focus:ring-4 focus:ring-cyan/50"
    >
      <MessageSquarePlus className="h-6 w-6" />
    </motion.button>
  )
}
