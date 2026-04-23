'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRODUCTS } from '@/lib/products'

interface NavbarProps {
  onOpenCommandPalette: () => void
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-40 w-full" role="banner">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Security Systems home">
          <Image
            src="/ss.png"
            alt="Security Systems"
            width={50}
            height={50}
            className="object-contain transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,102,102,0.6)]"
          />
        </Link>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Hamburger — opens product menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl transition-all hover:scale-105"
              style={{
                background: menuOpen ? 'var(--accent-cyan)' : 'rgba(0,102,102,0.1)',
                border: '1.5px solid rgba(0,102,102,0.25)',
                boxShadow: menuOpen ? '0 0 16px rgba(0,102,102,0.35)' : 'none',
              }}
              aria-label="Toggle products menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-4 w-4" style={{ color: '#ffffff' }} />
              ) : (
                <>
                  <span className="h-[2px] w-5 rounded-full transition-all" style={{ background: 'var(--accent-cyan)' }} />
                  <span className="h-[2px] w-4 rounded-full transition-all" style={{ background: 'var(--accent-cyan)' }} />
                  <span className="h-[2px] w-3 rounded-full transition-all" style={{ background: 'var(--accent-cyan)' }} />
                </>
              )}
            </button>

            {/* Dropdown product list */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-11 w-64 rounded-2xl border border-[var(--glass-border)] shadow-xl overflow-hidden"
                  style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="px-3 py-2 border-b border-[var(--glass-border)]">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Products</p>
                  </div>
                  <ul className="py-1">
                    {PRODUCTS.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-cyan)]/8 transition-colors"
                        >
                          <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                            style={{ background: `${product.color}18`, border: `1px solid ${product.color}30` }}
                          >
                            <Image src={product.image} alt={product.name} width={20} height={20} className="object-contain" />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle — at the end */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl transition-all"
            style={{
              background: menuOpen ? 'var(--accent-cyan)' : 'rgba(0,102,102,0.1)',
              border: '1.5px solid rgba(0,102,102,0.25)',
            }}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-4 w-4 text-white" />
            ) : (
              <>
                <span className="h-[2px] w-5 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
                <span className="h-[2px] w-4 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
                <span className="h-[2px] w-3 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
              </>
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden border-t border-[var(--glass-border)] overflow-hidden backdrop-blur-md"
            style={{ background: 'var(--card-bg)' }}
          >
            <div className="px-3 py-2 border-b border-[var(--glass-border)]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Products</p>
            </div>
            <ul className="py-1">
              {PRODUCTS.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)]"
                  >
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${product.color}18`, border: `1px solid ${product.color}30` }}
                    >
                      <Image src={product.image} alt={product.name} width={20} height={20} className="object-contain" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
