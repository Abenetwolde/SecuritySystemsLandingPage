'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAnalytics } from '@/lib/useAnalytics'

interface WafRequestModalProps {
  open: boolean
  onClose: () => void
}

interface FormData {
  companyName: string
  contactPerson: string
  hasInternalWebsite: boolean
  internalServerOS: string
  internalOSVersion: string
  internalServerApache: boolean
  internalServerNginx: boolean
  internalServerOther: boolean
  hasPublicWebsite: boolean
  publicWebsiteAddress: string
  publicServerOS: string
  publicOSVersion: string
  publicServerApache: boolean
  publicServerNginx: boolean
  publicServerOther: boolean
  contactName: string
  contactPhone: string
  contactEmail: string
  website: string
  officeNo: string
  jobTitle: string
  department: string
}

const INITIAL: FormData = {
  companyName: '', contactPerson: '',
  hasInternalWebsite: false, internalServerOS: '', internalOSVersion: '',
  internalServerApache: false, internalServerNginx: false, internalServerOther: false,
  hasPublicWebsite: false, publicWebsiteAddress: '', publicServerOS: '', publicOSVersion: '',
  publicServerApache: false, publicServerNginx: false, publicServerOther: false,
  contactName: '', contactPhone: '', contactEmail: '',
  website: '', officeNo: '', jobTitle: '', department: '',
}

function Field({ label, name, value, onChange, type = 'text', placeholder, error }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string; placeholder?: string; error?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[var(--text-primary)]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/30 transition-colors"
        style={{
          background: 'var(--input-bg)',
          border: '1px solid rgba(0,102,102,0.25)',
          color: 'var(--text-primary)',
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function CheckField({ label, name, checked, onChange }: {
  label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded accent-[var(--accent-cyan)]"
      />
      {label}
    </label>
  )
}

export function WafRequestModal({ open, onClose }: WafRequestModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const { track } = useAnalytics()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!form.companyName.trim()) errs.companyName = 'Institution name is required'
    if (!form.contactName.trim()) errs.contactName = 'Contact name is required'
    if (!form.contactPhone.trim()) errs.contactPhone = 'Phone is required'
    if (!form.contactEmail.trim()) errs.contactEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) errs.contactEmail = 'Invalid email'
    if (form.hasInternalWebsite) {
      if (!form.internalServerOS.trim()) errs.internalServerOS = 'Server OS is required'
      if (!form.internalOSVersion.trim()) errs.internalOSVersion = 'OS version is required'
    }
    if (form.hasPublicWebsite) {
      if (!form.publicWebsiteAddress.trim()) errs.publicWebsiteAddress = 'Website address is required'
      if (!form.publicServerOS.trim()) errs.publicServerOS = 'Server OS is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    const loadingToast = toast.loading('Submitting WAF request...')
    try {
      const payload = {
        ...form,
        website: form.website || 'https://example.com',
        officeNo: form.officeNo || '000000',
        jobTitle: form.jobTitle || 'N/A',
        department: form.department || 'IT',
        institutionName: form.companyName,
      }
      await Promise.allSettled([
        fetch('https://gashavpn.insa.gov.et/gashawaf.php', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        }),
        fetch('https://securitysystems.insa.gov.et/api/api/products/waf-request', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        }),
      ])
      toast.success('WAF request submitted successfully!')
      track('request_form_submit', { product: 'gasha-waf' })
      setForm(INITIAL)
      onClose()
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
      toast.dismiss(loadingToast)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{
                background: 'var(--modal-bg)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]"
                style={{ background: 'var(--modal-bg)' }}>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">Gasha WAF Request</h2>
                  <p className="text-xs text-[var(--text-muted)]">Fill in your institution details to request access</p>
                </div>
                <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-6">
                {/* Institution */}
                <section>
                  <h3 className="text-sm font-bold text-[var(--accent-cyan)] mb-3 uppercase tracking-wide">Institution</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Institution Name *" name="companyName" value={form.companyName} onChange={handleChange}
                      placeholder="Enter your institution name" error={errors.companyName} />
                    <Field label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange}
                      placeholder="Full name of responsible person" />
                  </div>
                </section>

                {/* Internal website */}
                <section>
                  <CheckField
                    label="The institution has an internal website or web application it manages"
                    name="hasInternalWebsite" checked={form.hasInternalWebsite} onChange={handleChange}
                  />
                  {form.hasInternalWebsite && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 border-l-2 border-[var(--accent-cyan)]/30">
                      <Field label="Server OS *" name="internalServerOS" value={form.internalServerOS} onChange={handleChange}
                        placeholder="Operating system name and version" error={errors.internalServerOS} />
                      <Field label="OS Version *" name="internalOSVersion" value={form.internalOSVersion} onChange={handleChange}
                        placeholder="Specific version number" error={errors.internalOSVersion} />
                      <div className="sm:col-span-2 flex flex-wrap gap-4">
                        <CheckField label="Apache" name="internalServerApache" checked={form.internalServerApache} onChange={handleChange} />
                        <CheckField label="Nginx" name="internalServerNginx" checked={form.internalServerNginx} onChange={handleChange} />
                        <CheckField label="Other" name="internalServerOther" checked={form.internalServerOther} onChange={handleChange} />
                      </div>
                    </div>
                  )}
                </section>

                {/* Public website */}
                <section>
                  <CheckField
                    label="The institution has a public-facing website"
                    name="hasPublicWebsite" checked={form.hasPublicWebsite} onChange={handleChange}
                  />
                  {form.hasPublicWebsite && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 border-l-2 border-[var(--accent-cyan)]/30">
                      <div className="sm:col-span-2">
                        <Field label="Public Website URL *" name="publicWebsiteAddress" value={form.publicWebsiteAddress}
                          onChange={handleChange} placeholder="Full URL of your public website" error={errors.publicWebsiteAddress} />
                      </div>
                      <Field label="Server OS *" name="publicServerOS" value={form.publicServerOS} onChange={handleChange}
                        placeholder="Operating system name" error={errors.publicServerOS} />
                      <Field label="OS Version" name="publicOSVersion" value={form.publicOSVersion} onChange={handleChange}
                        placeholder="Version number" />
                      <div className="sm:col-span-2 flex flex-wrap gap-4">
                        <CheckField label="Apache" name="publicServerApache" checked={form.publicServerApache} onChange={handleChange} />
                        <CheckField label="Nginx" name="publicServerNginx" checked={form.publicServerNginx} onChange={handleChange} />
                        <CheckField label="Other" name="publicServerOther" checked={form.publicServerOther} onChange={handleChange} />
                      </div>
                    </div>
                  )}
                </section>

                {/* Contact */}
                <section>
                  <h3 className="text-sm font-bold text-[var(--accent-cyan)] mb-3 uppercase tracking-wide">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Contact Name *" name="contactName" value={form.contactName} onChange={handleChange}
                      placeholder="Full name" error={errors.contactName} />
                    <Field label="Phone *" name="contactPhone" value={form.contactPhone} onChange={handleChange}
                      placeholder="Include country code" error={errors.contactPhone} />
                    <Field label="Email *" name="contactEmail" value={form.contactEmail} onChange={handleChange}
                      type="email" placeholder="Official work email" error={errors.contactEmail} />
                  </div>
                </section>

                {/* Additional */}
                <section>
                  <h3 className="text-sm font-bold text-[var(--accent-cyan)] mb-3 uppercase tracking-wide">Additional (Optional)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Website" name="website" value={form.website} onChange={handleChange} placeholder="Your institution website" />
                    <Field label="Office Number" name="officeNo" value={form.officeNo} onChange={handleChange} placeholder="Direct office phone line" />
                    <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Your current position" />
                    <Field label="Department" name="department" value={form.department} onChange={handleChange} placeholder="Your department name" />
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t border-[var(--glass-border)]"
                style={{ background: 'var(--modal-bg)' }}>
                <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2"
                  style={{ background: 'linear-gradient(135deg, #006666, #008080)', color: '#fff' }}
                >
                  {submitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  Submit Request
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
