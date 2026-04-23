'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '@/lib/products'

const HEADLINE_LINE1 = ['Securing', "Ethiopia's"]
const HEADLINE_LINE2 = ['Critical', 'Digital', 'Systems']
const RING_ANGLES = [0, 51, 102, 154, 206, 257, 309]
const RING_RADIUS = 210

// Logos shown in the "Trusted by" marquee
const TRUSTED_LOGOS = [
  { src: '/niss.png',               alt: 'Gasha AV' },
  { src: '/pmo.png',              alt: 'Gasha WAF' },
  { src: '/enter.png',              alt: 'Gasha VPN' },
  { src: '/trade.png',     alt: 'Nisir' },
  // { src: '/images/IAM.png',       alt: 'Enyuma IAM' },
  // { src: '/abis.png',             alt: 'ABIS' },
  // { src: '/images/codeprotection.png', alt: 'Code Protection' },
]

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [pulse, setPulse] = useState(false)

  // Particle mesh
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; color: string }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: Math.random() > 0.6 ? 'rgba(0,128,128,' : 'rgba(0,102,102,',
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '0.5)'
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,102,102,${0.12 * (1 - dist / 110)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // Focus cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
      setActiveIndex((i) => (i + 1) % PRODUCTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero-gradient relative flex min-h-screen items-center overflow-hidden" aria-label="Hero section">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-glow-tl absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-[120px]" />
        <div className="hero-glow-br absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full blur-[120px]" />
      </div>

      {/* Fade to page bg at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* ── Left: Text + Trusted by ── */}
          <div className="flex flex-col">
            {/* Headline — two lines */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              className="mb-8"
            >
              {/* Line 1 */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1">
                {HEADLINE_LINE1.map((word, i) => (
                  <motion.span
                    key={`l1-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } },
                    }}
                    className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-[var(--accent-cyan)]"
                    style={{ textShadow: '0 0 28px rgba(0,102,102,0.25)' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              {/* Line 2 — accent color */}
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {HEADLINE_LINE2.map((word, i) => (
                  <motion.span
                    key={`l2-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } },
                    }}
                    className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-[var(--accent-cyan)]"
                    style={{ textShadow: '0 0 28px rgba(0,102,102,0.3)' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Subtext — concrete, not vague */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="max-w-md text-base text-[var(--text-muted)] leading-relaxed mb-8"
            >
              We provide AI-powered cybersecurity solutions to protect government systems, businesses, and critical infrastructure across Ethiopia — built and operated by INSA.
            </motion.p>

            {/* Dual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <a
                href="#gasha-av"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #006666, #008080)',
                  color: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,102,102,0.35)',
                }}
              >
                <span>Explore Security Solutions</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
        
            </motion.div>

            {/* ── Trusted by — left column only ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Trusted by National Institutions
              </p>
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10"
                  style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }} />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
                  style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }} />
                <div className="flex animate-trusted" style={{ width: 'max-content' }}>
                  {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, i) => (
                    <div
                      key={i}
                      className="mx-5 flex h-14 w-14 flex-shrink-0 items-center justify-center"
                      title={logo.alt}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={44}
                        height={44}
                        className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Glow Orbit ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, type: 'spring' }}
            className="relative flex items-center justify-center"
            aria-hidden="true"
            style={{ height: 520 }}
          >
            {/* Orbit rings */}
            <div className="absolute rounded-full border border-[var(--accent-cyan)]/10"
              style={{ width: RING_RADIUS * 2 + 80, height: RING_RADIUS * 2 + 80 }} />
            <div className="absolute rounded-full border border-[var(--accent-teal)]/10"
              style={{ width: RING_RADIUS * 2 + 20, height: RING_RADIUS * 2 + 20 }} />

            {/* ── Central: Security Systems logo ── */}
            <div className="relative z-10 flex h-32 w-32 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,102,102,0.15) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <motion.div
                  className="absolute left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,102,102,0.5), transparent)' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <Image
                src="/ss.png"
                alt="Security Systems"
                width={150}
                height={150}
                className="relative z-10 object-contain"
                style={{ filter: 'drop-shadow(0 0 16px rgba(0,102,102,0.5))' }}
              />
            </div>

            {/* Product logos in orbit */}
            {PRODUCTS.map((product, i) => {
              const { x, y } = polarToXY(RING_ANGLES[i], RING_RADIUS)
              const isActive = i === activeIndex

              return (
                <motion.div
                  key={product.slug}
                  className="absolute flex flex-col items-center gap-1"
                  style={{ left: '50%', top: '50%', x: x - 28, y: y - 28 }}
                  animate={isActive ? { scale: 1.5 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <AnimatePresence>
                    {isActive && pulse && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.9 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: `radial-gradient(circle, ${product.color}60 0%, transparent 70%)` }}
                      />
                    )}
                  </AnimatePresence>

                  <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${product.color}20, ${product.color}08)`
                        : 'var(--card-bg)',
                      borderColor: isActive ? product.color : 'var(--glass-border)',
                      boxShadow: isActive ? `0 0 20px ${product.color}50` : 'none',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="object-contain"
                      style={{ filter: isActive ? 'brightness(1.1)' : 'brightness(0.7) saturate(0.5)' }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-medium whitespace-nowrap transition-colors duration-300 max-w-[80px] text-center leading-tight"
                    style={{ color: isActive ? product.color : 'var(--text-muted)' }}
                  >
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
