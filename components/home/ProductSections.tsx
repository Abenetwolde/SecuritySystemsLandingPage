'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { PRODUCTS, type Product } from '@/lib/products'

// ── Platform icons ───────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  windows: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-label="Windows">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-label="Linux">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h-.013c-.215 0-.397.062-.586.2-.19.132-.328.327-.438.532-.104.256-.158.459-.162.724v.02c0 .095.007.19.02.283-.06.024-.12.048-.177.075a1.96 1.96 0 00-.284.134.7.7 0 00-.09.04.957.957 0 01-.212-.334 1.808 1.808 0 01-.15-.706l-.004.024a.086.086 0 01-.004.021V7.17c0-.02.002-.04.006-.06a1.467 1.467 0 01.168-.725c.109-.2.248-.397.44-.533.19-.135.373-.197.586-.197h.014c.213 0 .395.062.583.197z" />
    </svg>
  ),
  android: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-label="Android">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" />
    </svg>
  ),
  ios: (
    <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold border border-current">iOS</span>
  ),
}

const PRODUCT_PLATFORMS: Record<string, string[]> = {
  'gasha-av':        ['windows', 'linux'],
  'gasha-waf':       ['windows', 'linux'],
  'gasha-vpn':       ['windows', 'linux', 'android', 'ios'],
  'nisir':           ['windows', 'linux'],
  'enyuma-iam':      ['windows', 'linux'],
  'abis':            ['windows', 'linux'],
  'code-protection': ['windows', 'linux'],
}

// Always use dark text on these specific light product colors
const DARK_TEXT_SLUGS = new Set(['gasha-av', 'gasha-waf'])

// ── Description card ────────────────────────────────────────────
function ProductDescCard({ product }: { product: Product }) {
  const platforms = PRODUCT_PLATFORMS[product.slug] ?? ['windows', 'linux']
  // AV (#1da09c) and WAF (#3ed8ec) are light — need dark text on their buttons
  const btnTextColor = DARK_TEXT_SLUGS.has(product.slug) ? '#0a0f1e' : '#ffffff'

  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto lg:mx-0 lg:items-start lg:text-left">
      {/* Logo — larger, no border */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mb-6"
      >
        <Image
          src={product.image}
          alt={product.name}
          width={96}
          height={96}
          className="object-contain"
          style={{ filter: `drop-shadow(0 4px 20px ${product.color}60)` }}
        />
      </motion.div>

      {/* Product name */}
      <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight sm:text-4xl">
        {product.name}
      </h2>

      {/* Platform icons */}
      <div className="flex items-center gap-3 mb-5 text-[var(--text-muted)]">
        {platforms.map((p) => (
          <span key={p} title={p} className="opacity-70 hover:opacity-100 transition-opacity">
            {PLATFORM_ICONS[p]}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8 max-w-xs">
        {product.longDescription}
      </p>

      {/* CTA */}
      <Link
        href={`/products/${product.slug}`}
        className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)`,
          color: btnTextColor,
          boxShadow: `0 4px 20px ${product.color}55`,
          border: `1.5px solid ${product.color}`,
        }}
      >
        View more features
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}

// ── Image frame with background blobs ───────────────────────────
function ProductImageFrame({ product }: { product: Product }) {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Blob 1 — large organic shape */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '80%', height: '80%',
          top: '0%', left: '5%',
          borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
          background: `${product.color}55`,
          filter: 'blur(1px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Blob 2 — smaller accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '60%', height: '60%',
          bottom: '0%', right: '0%',
          borderRadius: '40% 60% 45% 55% / 55% 45% 60% 40%',
          background: `${product.color}40`,
          filter: 'blur(2px)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Radial glow behind everything */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${product.color}88, transparent 65%)` }}
        aria-hidden="true"
      />

      {/* Floating image */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <Image
          src="/images/pcmoke.png"
          alt={`${product.name} preview`}
          width={600}
          height={420}
          className="w-full h-auto object-contain"
          style={{ filter: `drop-shadow(0 24px 48px ${product.color}30)` }}
          priority={false}
        />
      </motion.div>
    </div>
  )
}

// ── Single product section ───────────────────────────────────────
function ProductSection({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const flip = index % 2 === 1

  return (
    <section
      ref={ref}
      id={index === 0 ? 'gasha-av' : undefined}
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: index % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)' }}
      aria-labelledby={`product-heading-${product.slug}`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
          style={{ direction: flip ? 'rtl' : 'ltr' }}
        >
          <motion.div
            initial={{ opacity: 0, x: flip ? 50 : -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{ direction: 'ltr' }}
          >
            <ProductDescCard product={product} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: flip ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}
            style={{ direction: 'ltr' }}
          >
            <ProductImageFrame product={product} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function ProductSections() {
  return (
    <div>
      {PRODUCTS.map((product, index) => (
        <ProductSection key={product.slug} product={product} index={index} />
      ))}
    </div>
  )
}
