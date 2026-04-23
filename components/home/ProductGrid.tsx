'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS, type Product } from '@/lib/products'

// Bento layout: first card is wide (col-span-2), rest are normal
const BENTO_SPANS = [2, 1, 1, 1, 1, 2, 1]

function ProductCard({ product, wide }: { product: Product; wide: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`block ${wide ? 'sm:col-span-2' : ''}`}
      aria-label={`View ${product.name}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursor((c) => ({ ...c, visible: false }))}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300"
        style={{
          background: 'rgba(13,27,42,0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'rgba(0,206,200,0.12)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = `${product.color}50`
          el.style.boxShadow = `0 0 28px ${product.color}20`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(0,206,200,0.12)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Cursor radial light */}
        {cursor.visible && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(200px circle at ${cursor.x}px ${cursor.y}px, ${product.color}12, transparent 70%)`,
            }}
          />
        )}

        {/* Gradient border shimmer on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${product.color}15 0%, rgba(139,92,246,0.08) 50%, transparent 100%)`,
          }}
        />

        <div className={`relative z-10 flex h-full ${wide ? 'flex-row items-center gap-8' : 'flex-col gap-4'}`}>
          {/* Icon with micro-animation */}
          <div className="shrink-0">
            <MicroAnimatedIcon product={product} wide={wide} />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-base sm:text-lg">{product.name}</h3>
                {product.hasDownload && (
                  <span
                    className="mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{ borderColor: `${product.color}50`, color: product.color }}
                  >
                    Download available
                  </span>
                )}
              </div>
            </div>

            <p className="flex-1 text-sm text-[var(--text-muted)] leading-relaxed">
              {product.shortDescription}
            </p>

            <div
              className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
              style={{ color: product.color }}
            >
              Learn more
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function MicroAnimatedIcon({ product, wide }: { product: Product; wide: boolean }) {
  const size = wide ? 80 : 64

  return (
    <div
      className="relative flex items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${product.color}15, ${product.color}05)`,
        border: `1px solid ${product.color}25`,
        boxShadow: `0 0 20px ${product.color}15`,
      }}
    >
      {/* Per-product micro-animation overlay */}
      {product.slug === 'gasha-av' && (
        <>
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl"
              style={{ border: `1px solid ${product.color}30` }}
              animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      {product.slug === 'gasha-waf' && (
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 w-2 rounded-full"
              style={{ background: product.color, top: `${30 + i * 20}%`, left: '-8px' }}
              animate={{ x: [0, size + 16], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
            />
          ))}
        </motion.div>
      )}

      {product.slug === 'enyuma-iam' && (
        <motion.div
          className="absolute inset-x-0 h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${product.color}80, transparent)` }}
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {product.slug === 'abis' && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ border: `1px solid ${product.color}40` }}
          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      <Image
        src={product.image}
        alt={product.name}
        width={wide ? 48 : 38}
        height={wide ? 48 : 38}
        className="relative z-10 object-contain"
      />
    </div>
  )
}

export function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="products-heading">
      {/* Section header */}
      <div className="mb-12 text-center">
        <motion.h2
          id="products-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-[var(--text-primary)] sm:text-4xl"
        >
          Our{' '}
          <span className="text-cyan" style={{ textShadow: '0 0 20px rgba(0,206,200,0.4)' }}>
            Security
          </span>{' '}
          Products
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-[var(--text-muted)]"
        >
          Comprehensive cybersecurity solutions developed by INSA
        </motion.p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product, index) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className={BENTO_SPANS[index] === 2 ? 'sm:col-span-2 lg:col-span-2' : ''}
          >
            <ProductCard product={product} wide={BENTO_SPANS[index] === 2} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
