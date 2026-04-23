'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, X } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { motion, AnimatePresence } from 'framer-motion'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()

  const handleSelect = useCallback(
    (slug: string) => {
      router.push(`/products/${slug}`)
      onClose()
    },
    [router, onClose]
  )

  // Global CMD+K / CTRL+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (open) onClose()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <Command
              className="glass rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,206,200,0.2)]"
              loop
            >
              {/* Search input */}
              <div className="flex items-center border-b border-[var(--glass-border)] px-4 py-3 gap-3">
                <Search className="h-4 w-4 text-cyan shrink-0" />
                <Command.Input
                  autoFocus
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                />
                <button
                  onClick={onClose}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Close command palette"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">
                  No products found.
                </Command.Empty>

                <Command.Group heading="Security Products" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
                  {PRODUCTS.map((product) => (
                    <Command.Item
                      key={product.slug}
                      value={`${product.name} ${product.shortDescription}`}
                      onSelect={() => handleSelect(product.slug)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] cursor-pointer aria-selected:bg-[var(--glass-bg)] aria-selected:text-cyan transition-colors"
                    >
                      <span className="text-xl">{product.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">{product.shortDescription}</span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="border-t border-[var(--glass-border)] px-4 py-2 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">esc</kbd> close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
