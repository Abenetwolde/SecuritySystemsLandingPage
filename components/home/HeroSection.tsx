'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/lib/products'
import type { SiteSettings } from '@/lib/api'
import { resolveImageUrl } from '@/lib/api'

const RING_ANGLES = [0, 51, 102, 154, 206, 257, 309]
const RING_RADIUS = 210

const FALLBACK_TRUSTED_LOGOS = [
  { src: '/niss.png', alt: 'National Intelligence and Security Service' },
  { src: '/pmo.png', alt: 'Office of the Prime Minister' },
  { src: '/enter.png', alt: 'Ethiopian Enterprise Development' },
  { src: '/trade.png', alt: 'Ministry of Trade and Regional Integration' },
]

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
}

export function HeroSection({ products, settings }: { products: Product[]; settings: SiteSettings }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pulse, setPulse] = useState(false)

  const headlineLine1 = settings.heroHeadlineLine1?.length ? settings.heroHeadlineLine1 : ["Securing", "Ethiopia's"]
  const headlineLine2 = settings.heroHeadlineLine2?.length ? settings.heroHeadlineLine2 : ["Critical", "Digital", "Systems"]
  const subtext = settings.heroSubtext || "We provide AI-powered cybersecurity solutions to protect government systems, businesses, and critical infrastructure across Ethiopia — built and operated by INSA."
  const ctaText = settings.heroCTAText || "Explore Security Solutions"
  const trustedLogos = settings.trustedLogos?.length ? settings.trustedLogos : FALLBACK_TRUSTED_LOGOS

  useEffect(() => {
    if (!products.length) return
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
      setActiveIndex((i) => (i + 1) % products.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [products.length])

  return (
    <section className="hero-gradient relative flex min-h-screen items-center overflow-hidden" aria-label="Hero section">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-glow-tl absolute -left-24 -top-24 h-[600px] w-[600px] rounded-full blur-[100px]" />
        <div className="hero-glow-br absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(0,102,102,0.06)' }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          <div className="flex flex-col">
            <motion.div initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="mb-8">
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1">
                {headlineLine1.map((word, i) => (
                  <motion.span key={`l1-${i}`}
                    variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } } }}
                    className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-[var(--accent-cyan)]"
                    style={{ textShadow: '0 0 28px rgba(0,102,102,0.25)' }}>{word}</motion.span>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {headlineLine2.map((word, i) => (
                  <motion.span key={`l2-${i}`}
                    variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } } }}
                    className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-[var(--accent-cyan)]"
                    style={{ textShadow: '0 0 28px rgba(0,102,102,0.3)' }}>{word}</motion.span>
                ))}
              </div>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
              className="max-w-md text-base text-[var(--text-muted)] leading-relaxed mb-8">{subtext}</motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-10">
              <a href="#gasha-av"
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #006666 0%, #008080 100%)', color: '#ffffff', boxShadow: '0 4px 14px rgba(0,102,102,0.35)', letterSpacing: '0.01em' }}>
                <span>{ctaText}</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.1 }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Trusted by National Institutions
              </p>
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10"
                  style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }} />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
                  style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }} />
                <div className="flex animate-trusted" style={{ width: 'max-content' }}>
                  {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                    <div key={i} className="mx-5 flex h-14 w-14 flex-shrink-0 items-center justify-center" title={logo.alt}>
                      <Image src={resolveImageUrl(logo.src) || logo.src} alt={logo.alt} width={44} height={44}
                        className="object-contain opacity-60 hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, type: 'spring' }}
            className="relative flex items-center justify-center" aria-hidden="true" style={{ height: 520 }}>
            <div className="absolute rounded-full border border-[var(--accent-cyan)]/10"
              style={{ width: RING_RADIUS * 2 + 80, height: RING_RADIUS * 2 + 80 }} />
            <div className="absolute rounded-full border border-[var(--accent-teal)]/10"
              style={{ width: RING_RADIUS * 2 + 20, height: RING_RADIUS * 2 + 20 }} />

            <div className="relative z-10 flex h-32 w-32 items-center justify-center">
              <motion.div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,102,102,0.15) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
              <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <motion.div className="absolute left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,102,102,0.5), transparent)' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
              </div>
              <Image src="/ss.png" alt="Security Systems" width={150} height={150}
                className="relative z-10 object-contain"
                style={{ filter: 'drop-shadow(0 0 16px rgba(0,102,102,0.5))' }} />
            </div>

            {products.map((product, i) => {
              const { x, y } = polarToXY(RING_ANGLES[i % RING_ANGLES.length], RING_RADIUS)
              const isActive = i === activeIndex
              return (
                <motion.div key={product.slug} className="absolute flex flex-col items-center gap-1"
                  style={{ left: '50%', top: '50%', x: x - 28, y: y - 28 }}
                  animate={isActive ? { scale: 1.5 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <AnimatePresence>
                    {isActive && pulse && (
                      <motion.div initial={{ scale: 0.5, opacity: 0.9 }} animate={{ scale: 2.5, opacity: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: `radial-gradient(circle, ${product.color}60 0%, transparent 70%)` }} />
                    )}
                  </AnimatePresence>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500"
                    style={{
                      background: isActive ? `linear-gradient(135deg, ${product.color}20, ${product.color}08)` : 'var(--card-bg)',
                      borderColor: isActive ? product.color : 'var(--glass-border)',
                      boxShadow: isActive ? `0 0 20px ${product.color}50` : 'none',
                      backdropFilter: 'blur(8px)',
                    }}>
                    <Image src={product.image} alt={product.name} width={36} height={36} className="object-contain"
                      style={{ filter: isActive ? 'brightness(1.1)' : 'brightness(0.7) saturate(0.5)' }} />
                  </div>
                  <span className="text-[10px] font-medium whitespace-nowrap transition-colors duration-300 max-w-[80px] text-center leading-tight"
                    style={{ color: isActive ? product.color : 'var(--text-muted)' }}>
                    {product.name}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
