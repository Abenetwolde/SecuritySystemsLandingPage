'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface PasswordModalProps {
  open: boolean
  onClose: () => void
  fileName: string
}

const CORRECT_PASSWORD = 'gasha123'

export function verifyPassword(input: string): boolean {
  return input === CORRECT_PASSWORD
}

export function PasswordModal({ open, onClose, fileName }: PasswordModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [shake, setShake] = useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleClose = () => {
    setPassword('')
    setError('')
    setIsVerifying(false)
    onClose()
  }

  const handleSubmit = async () => {
    setIsVerifying(true)
    setError('')

    // Simulate scanning animation duration
    await new Promise((r) => setTimeout(r, 1200))

    if (verifyPassword(password)) {
      setIsVerifying(false)
      toast.success('Download started')
      // Trigger download
      const link = document.createElement('a')
      link.href = `/${fileName}`
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      handleClose()
    } else {
      setIsVerifying(false)
      setError('Incorrect password')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      toast.error('Wrong password, please try again')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') handleClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-2xl"
              style={{
                background: 'var(--modal-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 0 60px rgba(0,102,102,0.12), 0 25px 50px rgba(0,0,0,0.15)',
              }}
            >
              <div className="p-6 sm:p-8">
              {/* Scanning line animation */}
              {isVerifying && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-80"
                    style={{ position: 'absolute' }}
                  />
                  <div className="absolute inset-0 bg-cyan/5" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30">
                    <Lock className="h-5 w-5 text-[var(--accent-cyan)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Secure Download</h2>
                    <p className="text-xs text-[var(--text-muted)]">{fileName}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-[var(--text-muted)] mb-4">
                Enter the download password to access this file.
              </p>

              {/* Password input */}
              <motion.div
                animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative mb-2"
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter password"
                  disabled={isVerifying}
                  aria-label="Download password"
                  aria-describedby={error ? 'password-error' : undefined}
                  className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 pr-12 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan disabled:opacity-50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-cyan transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.p
                  id="password-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-xs text-red-400"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isVerifying}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!password || isVerifying}
                  className="flex-1 gap-2"
                >
                  {isVerifying ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-4 w-4 rounded-full border-2 border-obsidian border-t-transparent"
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
