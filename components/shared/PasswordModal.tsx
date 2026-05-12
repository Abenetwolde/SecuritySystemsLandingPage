'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAnalytics } from '@/lib/useAnalytics'

const DOWNLOAD_API = 'https://securitysystems.insa.gov.et/api/download'

export interface PasswordModalProps {
  open: boolean
  onClose: () => void
  /** Display name shown in the modal header */
  fileName: string
  /** Backend file identifier: 'av-exe' | 'vpn-exe' | 'vpn-apk' */
  fileId: string
}

export function PasswordModal({ open, onClose, fileName, fileId }: PasswordModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [shake, setShake] = useState(false)
  const { track } = useAnalytics()

  const handleClose = () => {
    setPassword('')
    setError('')
    setIsVerifying(false)
    onClose()
  }

  const handleSubmit = async () => {
    if (!password) return
    setIsVerifying(true)
    setError('')
    track('download_attempt', { file: fileId })

    try {
      const res = await fetch(DOWNLOAD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, file: fileId }),
      })

      if (res.status === 401) {
        setError('Incorrect password')
        setShake(true)
        setTimeout(() => setShake(false), 500)
        toast.error('Wrong password, please try again')
        track('download_failed', { file: fileId, reason: 'wrong_password' })
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? 'Download failed')
        toast.error(data.message ?? 'Download failed')
        track('download_failed', { file: fileId, reason: 'error' })
        return
      }

      // Stream blob and trigger browser download
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      track('download_success', { file: fileId, fileName })
      toast.success('Download started')
      handleClose()
    } catch {
      setError('Network error. Please try again.')
      toast.error('Network error. Please try again.')
      track('download_failed', { file: fileId, reason: 'error' })
    } finally {
      setIsVerifying(false)
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

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
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              }}
            >
              <div className="p-6 sm:p-8">
                {/* Scanning line */}
                {isVerifying && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.2, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5"
                      style={{
                        background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
                        position: 'absolute',
                      }}
                    />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ background: 'rgba(0,102,102,0.1)', border: '1px solid rgba(0,102,102,0.3)' }}>
                      <Lock className="h-5 w-5" style={{ color: 'var(--accent-cyan)' }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Secure Download</h2>
                      <p className="text-xs text-[var(--text-muted)]">{fileName}</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
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
                    className="w-full rounded-lg px-4 py-3 pr-12 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid rgba(0,102,102,0.25)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 text-xs text-red-500"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isVerifying}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!password || isVerifying}
                    className="flex-1 gap-2"
                    style={{ background: 'linear-gradient(135deg, #006666, #008080)', color: '#fff' }}
                  >
                    {isVerifying ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
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
