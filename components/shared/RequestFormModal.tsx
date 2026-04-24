'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { PRODUCTS, type ProductSlug } from '@/lib/products'

// ── API submission ───────────────────────────────────────────────
const DEFAULTS = {
  website: 'https://example.com',
  officeNo: '000000',
  jobTitle: 'N/A',
  department: 'IT',
}

async function post(url: string, body: unknown) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function submitToAPI(slug: ProductSlug, payload: Record<string, unknown>) {
  const enriched = { ...DEFAULTS, ...payload }
  if (slug === 'gasha-av') {
    await Promise.allSettled([
      post('https://securitysystems.insa.gov.et/api/api/products/av-request', enriched),
      post('https://gashavpn.insa.gov.et/gashaav.php', enriched),
    ])
  } else if (slug === 'gasha-waf') {
    // WAF uses same AV endpoint (no separate WAF endpoint in old repo)
    await Promise.allSettled([
      post('https://securitysystems.insa.gov.et/api/api/products/av-request', { ...enriched, product: 'waf' }),
      post('https://gashavpn.insa.gov.et/gashaav.php', enriched),
    ])
  } else if (slug === 'gasha-vpn') {
    await Promise.allSettled([
      post('https://securitysystems.insa.gov.et/api/api/products/vpn-request', enriched),
      post('https://gashavpn.insa.gov.et/gashavpn.php', enriched),
    ])
  } else if (slug === 'nisir') {
    await Promise.allSettled([
      post('https://securitysystems.insa.gov.et/api/api/products/add-siem-request', enriched),
      post('https://gashavpn.insa.gov.et/nisir.php', enriched),
    ])
  } else if (slug === 'abis') {
    await Promise.allSettled([
      post('https://securitysystems.insa.gov.et/api/api/products/abis-request', enriched),
      post('https://gashavpn.insa.gov.et/biom.php', enriched),
    ])
  } else {
    // enyuma-iam, code-protection — use SIEM endpoint (same as old CODE/IAM)
    await post('https://securitysystems.insa.gov.et/api/api/products/add-siem-request', {
      ...enriched, product: slug,
    })
  }
}

// ── Shared field helpers ─────────────────────────────────────────
function F({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-[var(--text-muted)] mb-1 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
    </div>
  )
}

// ── Common contact + org fields ──────────────────────────────────
type CommonFields = {
  companyName: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  website: string
  officeNo: string
  jobTitle: string
  department: string
}

const EMPTY_COMMON: CommonFields = {
  companyName: '', contactPerson: '', contactEmail: '', contactPhone: '',
  website: '', officeNo: '', jobTitle: '', department: '',
}

function validateCommon(f: CommonFields) {
  const e: Partial<Record<keyof CommonFields, string>> = {}
  if (!f.companyName.trim()) e.companyName = 'Required'
  if (!f.contactPerson.trim()) e.contactPerson = 'Required'
  if (!f.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.contactEmail = 'Invalid email'
  if (!f.contactPhone.match(/^\+?[0-9]{10,15}$/)) e.contactPhone = '10–15 digits'
  return e
}

function CommonFields({
  f, e, set,
}: {
  f: CommonFields
  e: Partial<Record<keyof CommonFields, string>>
  set: (k: keyof CommonFields, v: string) => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <F label="Institution / Company Name *" error={e.companyName}>
          <Input value={f.companyName} onChange={ev => set('companyName', ev.target.value)} placeholder="Enter your institution or company name" className="input-surface mt-1" />
        </F>
        <F label="Contact Person *" error={e.contactPerson}>
          <Input value={f.contactPerson} onChange={ev => set('contactPerson', ev.target.value)} placeholder="Full name of the responsible person" className="input-surface mt-1" />
        </F>
        <F label="Work Email *" error={e.contactEmail}>
          <Input type="email" value={f.contactEmail} onChange={ev => set('contactEmail', ev.target.value)} placeholder="Official work email address" className="input-surface mt-1" />
        </F>
        <F label="Phone Number *" error={e.contactPhone}>
          <Input value={f.contactPhone} onChange={ev => set('contactPhone', ev.target.value)} placeholder="Include country code, e.g. +251911..." className="input-surface mt-1" />
        </F>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <F label="Website">
          <Input value={f.website} onChange={ev => set('website', ev.target.value)} placeholder="Your institution website" className="input-surface mt-1" />
        </F>
        <F label="Office No.">
          <Input value={f.officeNo} onChange={ev => set('officeNo', ev.target.value)} placeholder="Direct office line" className="input-surface mt-1" />
        </F>
        <F label="Job Title">
          <Input value={f.jobTitle} onChange={ev => set('jobTitle', ev.target.value)} placeholder="Your current position" className="input-surface mt-1" />
        </F>
        <F label="Department">
          <Input value={f.department} onChange={ev => set('department', ev.target.value)} placeholder="e.g. IT, Security" className="input-surface mt-1" />
        </F>
      </div>
    </>
  )
}

// ── Per-product form bodies ──────────────────────────────────────

// Gasha AV — companyName, totalComputers, windows, linux, 32/64bit, contact
function AVForm({ product }: { product: ProductSlug }) {
  const [common, setCommon] = useState<CommonFields>(EMPTY_COMMON)
  const [os, setOs] = useState({ totalComputers: '', windowOperatingSystems: '', linuxOperatingSystems: '', Bit32: '', Bit64: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setC = (k: keyof CommonFields, v: string) => setCommon(p => ({ ...p, [k]: v }))
  const setO = (k: keyof typeof os, v: string) => setOs(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = { ...validateCommon(common) } as Record<string, string>
    if (!os.totalComputers) e.totalComputers = 'Required'
    if (!os.windowOperatingSystems) e.windowOperatingSystems = 'Required'
    if (!os.linuxOperatingSystems) e.linuxOperatingSystems = 'Required'
    if (!os.Bit32) e.Bit32 = 'Required'
    if (!os.Bit64) e.Bit64 = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      await submitToAPI(product, { ...common, ...os })
      toast.success('Request submitted successfully!')
      return true
    } catch { toast.error('Network error. Please try again.') } finally { setLoading(false) }
  }

  return { fields: (
    <div className="space-y-4">
      <CommonFields f={common} e={errors} set={setC} />
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Operating Systems</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <F label="Total Computers *" error={errors.totalComputers}>
            <Input type="number" value={os.totalComputers} onChange={ev => setO('totalComputers', ev.target.value)} placeholder="Total number of computers" className="input-surface mt-1" />
          </F>
          <F label="Windows Machines *" error={errors.windowOperatingSystems}>
            <Input type="number" value={os.windowOperatingSystems} onChange={ev => setO('windowOperatingSystems', ev.target.value)} placeholder="Number running Windows" className="input-surface mt-1" />
          </F>
          <F label="Linux Machines *" error={errors.linuxOperatingSystems}>
            <Input type="number" value={os.linuxOperatingSystems} onChange={ev => setO('linuxOperatingSystems', ev.target.value)} placeholder="Number running Linux" className="input-surface mt-1" />
          </F>
          <F label="32-Bit Systems *" error={errors.Bit32}>
            <Input type="number" value={os.Bit32} onChange={ev => setO('Bit32', ev.target.value)} placeholder="Number of 32-bit systems" className="input-surface mt-1" />
          </F>
          <F label="64-Bit Systems *" error={errors.Bit64}>
            <Input type="number" value={os.Bit64} onChange={ev => setO('Bit64', ev.target.value)} placeholder="Number of 64-bit systems" className="input-surface mt-1" />
          </F>
        </div>
      </div>
    </div>
  ), submit, loading }
}

// Gasha VPN — same as AV + android + iOS
function VPNForm() {
  const [common, setCommon] = useState<CommonFields>(EMPTY_COMMON)
  const [os, setOs] = useState({
    totalComputers: '', windowOperatingSystems: '', linuxOperatingSystems: '',
    androidOperatingSystems: '', iosOperatingSystems: '', Bit32: '', Bit64: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setC = (k: keyof CommonFields, v: string) => setCommon(p => ({ ...p, [k]: v }))
  const setO = (k: keyof typeof os, v: string) => setOs(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = { ...validateCommon(common) } as Record<string, string>
    if (!os.totalComputers) e.totalComputers = 'Required'
    if (!os.windowOperatingSystems) e.windowOperatingSystems = 'Required'
    if (!os.linuxOperatingSystems) e.linuxOperatingSystems = 'Required'
    if (!os.Bit32) e.Bit32 = 'Required'
    if (!os.Bit64) e.Bit64 = 'Required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      await submitToAPI('gasha-vpn', { ...common, ...os })
      toast.success('VPN request submitted successfully!')
      return true
    } catch { toast.error('Network error. Please try again.') } finally { setLoading(false) }
  }

  return { fields: (
    <div className="space-y-4">
      <CommonFields f={common} e={errors} set={setC} />
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Operating Systems</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <F label="Total Computers *" error={errors.totalComputers}>
            <Input type="number" value={os.totalComputers} onChange={ev => setO('totalComputers', ev.target.value)} placeholder="Total number of devices" className="input-surface mt-1" />
          </F>
          <F label="Windows Machines *" error={errors.windowOperatingSystems}>
            <Input type="number" value={os.windowOperatingSystems} onChange={ev => setO('windowOperatingSystems', ev.target.value)} placeholder="Number running Windows" className="input-surface mt-1" />
          </F>
          <F label="Linux Machines *" error={errors.linuxOperatingSystems}>
            <Input type="number" value={os.linuxOperatingSystems} onChange={ev => setO('linuxOperatingSystems', ev.target.value)} placeholder="Number running Linux" className="input-surface mt-1" />
          </F>
          <F label="Android Devices">
            <Input type="number" value={os.androidOperatingSystems} onChange={ev => setO('androidOperatingSystems', ev.target.value)} placeholder="Number of Android devices" className="input-surface mt-1" />
          </F>
          <F label="iOS Devices">
            <Input type="number" value={os.iosOperatingSystems} onChange={ev => setO('iosOperatingSystems', ev.target.value)} placeholder="Number of iOS devices" className="input-surface mt-1" />
          </F>
          <F label="32-Bit Systems *" error={errors.Bit32}>
            <Input type="number" value={os.Bit32} onChange={ev => setO('Bit32', ev.target.value)} placeholder="Number of 32-bit systems" className="input-surface mt-1" />
          </F>
          <F label="64-Bit Systems *" error={errors.Bit64}>
            <Input type="number" value={os.Bit64} onChange={ev => setO('Bit64', ev.target.value)} placeholder="Number of 64-bit systems" className="input-surface mt-1" />
          </F>
        </div>
      </div>
    </div>
  ), submit, loading }
}

// Nisir SIEM — companyName, totalNumberOfAgentless, windows, mac, linux, 32/64bit, contact
function NisirForm() {
  const [common, setCommon] = useState<CommonFields>(EMPTY_COMMON)
  const [os, setOs] = useState({
    totalNumberOfAgentless: '', windowOperatingSystems: '', Mac: '', Linux: '', Bit32: '', Bit64: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setC = (k: keyof CommonFields, v: string) => setCommon(p => ({ ...p, [k]: v }))
  const setO = (k: keyof typeof os, v: string) => setOs(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = { ...validateCommon(common) } as Record<string, string>
    if (!os.totalNumberOfAgentless) e.totalNumberOfAgentless = 'Required'
    if (!os.windowOperatingSystems) e.windowOperatingSystems = 'Required'
    if (!os.Mac) e.Mac = 'Required'
    if (!os.Linux) e.Linux = 'Required'
    if (!os.Bit32) e.Bit32 = 'Required'
    if (!os.Bit64) e.Bit64 = 'Required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      await submitToAPI('nisir', { ...common, ...os })
      toast.success('SIEM request submitted successfully!')
      return true
    } catch { toast.error('Network error. Please try again.') } finally { setLoading(false) }
  }

  return { fields: (
    <div className="space-y-4">
      <CommonFields f={common} e={errors} set={setC} />
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">System Details</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <F label="Total Agentless Endpoints *" error={errors.totalNumberOfAgentless}>
            <Input type="number" value={os.totalNumberOfAgentless} onChange={ev => setO('totalNumberOfAgentless', ev.target.value)} placeholder="Total endpoints to monitor" className="input-surface mt-1" />
          </F>
          <F label="Windows Endpoints *" error={errors.windowOperatingSystems}>
            <Input type="number" value={os.windowOperatingSystems} onChange={ev => setO('windowOperatingSystems', ev.target.value)} placeholder="Number running Windows" className="input-surface mt-1" />
          </F>
          <F label="Mac Endpoints *" error={errors.Mac}>
            <Input type="number" value={os.Mac} onChange={ev => setO('Mac', ev.target.value)} placeholder="Number running macOS" className="input-surface mt-1" />
          </F>
          <F label="Linux Endpoints *" error={errors.Linux}>
            <Input type="number" value={os.Linux} onChange={ev => setO('Linux', ev.target.value)} placeholder="Number running Linux" className="input-surface mt-1" />
          </F>
          <F label="32-Bit Systems *" error={errors.Bit32}>
            <Input type="number" value={os.Bit32} onChange={ev => setO('Bit32', ev.target.value)} placeholder="Number of 32-bit systems" className="input-surface mt-1" />
          </F>
          <F label="64-Bit Systems *" error={errors.Bit64}>
            <Input type="number" value={os.Bit64} onChange={ev => setO('Bit64', ev.target.value)} placeholder="Number of 64-bit systems" className="input-surface mt-1" />
          </F>
        </div>
      </div>
    </div>
  ), submit, loading }
}

// ABIS — contact + biometric-specific fields
const BIOMETRIC_OPTIONS = [
  'Fingerprint', 'Face', 'Iris',
  'Face and Fingerprint', 'Face and Iris',
  'Fingerprint and Iris', 'Face, Fingerprint and Iris',
] as const

function ABISForm() {
  const [common, setCommon] = useState<CommonFields>(EMPTY_COMMON)
  const [bio, setBio] = useState({
    typeOfService: '', purposeOfRequest: '', numberOfUsers: '',
    integrationRequirements: '', biometricModality: '', serviceDuration: '', additionalNotes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setC = (k: keyof CommonFields, v: string) => setCommon(p => ({ ...p, [k]: v }))
  const setB = (k: keyof typeof bio, v: string) => setBio(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = { ...validateCommon(common) } as Record<string, string>
    if (!bio.typeOfService) e.typeOfService = 'Required'
    if (!bio.purposeOfRequest) e.purposeOfRequest = 'Required'
    if (!bio.numberOfUsers) e.numberOfUsers = 'Required'
    if (!bio.integrationRequirements) e.integrationRequirements = 'Required'
    if (!bio.biometricModality) e.biometricModality = 'Required'
    if (!bio.serviceDuration) e.serviceDuration = 'Required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      await submitToAPI('abis', { ...common, ...bio })
      toast.success('ABIS request submitted successfully!')
      return true
    } catch { toast.error('Network error. Please try again.') } finally { setLoading(false) }
  }

  return { fields: (
    <div className="space-y-4">
      <CommonFields f={common} e={errors} set={setC} />
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Biometric Details</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <F label="Type of Service *" error={errors.typeOfService}>
            <Input value={bio.typeOfService} onChange={ev => setB('typeOfService', ev.target.value)} placeholder="e.g. Identification, Verification" className="input-surface mt-1" />
          </F>
          <F label="Purpose of Request *" error={errors.purposeOfRequest}>
            <Input value={bio.purposeOfRequest} onChange={ev => setB('purposeOfRequest', ev.target.value)} placeholder="Describe the use case" className="input-surface mt-1" />
          </F>
          <F label="Number of Users *" error={errors.numberOfUsers}>
            <Input type="number" value={bio.numberOfUsers} onChange={ev => setB('numberOfUsers', ev.target.value)} placeholder="Expected number of users" className="input-surface mt-1" />
          </F>
          <F label="Service Duration *" error={errors.serviceDuration}>
            <Input value={bio.serviceDuration} onChange={ev => setB('serviceDuration', ev.target.value)} placeholder="e.g. 1 year, 6 months" className="input-surface mt-1" />
          </F>
          <F label="Biometric Modality *" error={errors.biometricModality}>
            <Select onValueChange={v => setB('biometricModality', v)}>
              <SelectTrigger className="input-surface mt-1"><SelectValue placeholder="Select modality" /></SelectTrigger>
              <SelectContent>
                {BIOMETRIC_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>
          <F label="Integration Requirements *" error={errors.integrationRequirements}>
            <Input value={bio.integrationRequirements} onChange={ev => setB('integrationRequirements', ev.target.value)} placeholder="Describe existing systems to integrate with" className="input-surface mt-1" />
          </F>
          <div className="sm:col-span-2">
            <F label="Additional Notes">
              <Textarea value={bio.additionalNotes} onChange={ev => setB('additionalNotes', ev.target.value)} rows={3} className="input-surface mt-1" />
            </F>
          </div>
        </div>
      </div>
    </div>
  ), submit, loading }
}

// Generic form (IAM, Code Protection) — contact only
function GenericForm({ slug }: { slug: ProductSlug }) {
  const [common, setCommon] = useState<CommonFields>(EMPTY_COMMON)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setC = (k: keyof CommonFields, v: string) => setCommon(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = validateCommon(common) as Record<string, string>
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      await submitToAPI(slug, common)
      toast.success('Request submitted successfully!')
      return true
    } catch { toast.error('Network error. Please try again.') } finally { setLoading(false) }
  }

  return { fields: <CommonFields f={common} e={errors} set={setC} />, submit, loading }
}

// ── Hook: pick the right form per product ────────────────────────
function useProductForm(slug: ProductSlug) {
  const av   = AVForm({ product: slug })
  const vpn  = VPNForm()
  const nisir = NisirForm()
  const abis = ABISForm()
  const generic = GenericForm({ slug })

  if (slug === 'gasha-av' || slug === 'gasha-waf') return av
  if (slug === 'gasha-vpn') return vpn
  if (slug === 'nisir') return nisir
  if (slug === 'abis') return abis
  return generic
}

// ── Modal shell ──────────────────────────────────────────────────
interface RequestFormModalProps {
  open: boolean
  onClose: () => void
  defaultProduct?: ProductSlug
}

export function RequestFormModal({ open, onClose, defaultProduct }: RequestFormModalProps) {
  const product = defaultProduct ?? 'gasha-av'
  const productMeta = PRODUCTS.find(p => p.slug === product)
  const { fields, submit, loading } = useProductForm(product)

  const handleSubmit = async () => {
    const ok = await submit()
    if (ok) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="modal-surface w-full max-w-2xl rounded-2xl shadow-[0_0_60px_rgba(0,206,200,0.12),0_25px_50px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
            >
              {/* Header — product name + logo, no product selector */}
              <div
                className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--glass-border)] shrink-0"
                style={{ borderBottom: `1px solid ${productMeta?.color ?? 'var(--glass-border)'}30` }}
              >
                <div className="flex items-center gap-3">
                  {productMeta && (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border"
                      style={{
                        background: `${productMeta.color}15`,
                        borderColor: `${productMeta.color}40`,
                      }}
                    >
                      <Image src={productMeta.image} alt="" width={24} height={24} className="object-contain" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      {productMeta?.name ?? 'Send a Request'}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">Product Request Form</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="overflow-y-auto px-6 py-5 flex-1">
                {fields}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[var(--glass-border)] flex gap-3 shrink-0">
                <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 gap-2"
                  style={productMeta ? {
                    background: productMeta.color,
                    color: '#0a0f1e',
                    boxShadow: `0 0 16px ${productMeta.color}40`,
                  } : {}}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-4 w-4 rounded-full border-2 border-obsidian border-t-transparent"
                      />
                      Submitting...
                    </>
                  ) : (
                    <><Send className="h-4 w-4" />Submit Request</>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
