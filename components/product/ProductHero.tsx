'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Download, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RequestFormModal } from '@/components/shared/RequestFormModal'
import { WafRequestModal } from '@/components/shared/WafRequestModal'
import { PasswordModal } from '@/components/shared/PasswordModal'
import type { Product } from '@/lib/products'
import { useAnalytics } from '@/lib/useAnalytics'

interface ProductHeroProps {
  product: Product
}

export function ProductHero({ product }: ProductHeroProps) {
  const [requestOpen, setRequestOpen] = useState(false)
  const [wafOpen, setWafOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const { track } = useAnalytics()

  const isWaf = product.slug === 'gasha-waf'

  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden" aria-labelledby="product-name">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${product.color}66 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex h-28 w-28 items-center justify-center rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${product.color}25, ${product.color}0a)`,
            boxShadow: `0 8px 40px ${product.color}40`,
          }}
          aria-hidden="true"
        >
          <Image src={product.image} alt={product.name} width={72} height={72} className="object-contain" />
        </motion.div>

        <motion.h1
          id="product-name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl mb-4"
        >
          {product.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-8"
        >
          {product.longDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            onClick={() => {
              track('send_request_click', { product: product.slug, product_name: product.name })
              isWaf ? setWafOpen(true) : setRequestOpen(true)
            }}
            size="lg"
            className="gap-2"
            style={{ background: product.color, color: '#fff', boxShadow: `0 4px 20px ${product.color}50` }}
            aria-label={`Send request for ${product.name}`}
          >
            <Send className="h-4 w-4" />
            Send Request
          </Button>

          {product.hasDownload && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                track('download_click', { product: product.slug, product_name: product.name })
                setPasswordOpen(true)
              }}
              className="gap-2"
              style={{ borderColor: `${product.color}50`, color: product.color }}
              aria-label={`Download ${product.name}`}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </motion.div>
      </div>

      {isWaf ? (
        <WafRequestModal open={wafOpen} onClose={() => setWafOpen(false)} />
      ) : (
        <RequestFormModal open={requestOpen} onClose={() => setRequestOpen(false)} defaultProduct={product.slug} />
      )}

      <PasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        fileName={product.slug === 'gasha-vpn' ? 'Gasha-VPN-Setup.exe' : 'Gasha-Antivirus-Setup.exe'}
        fileId={product.downloadFileId ?? 'av-exe'}
      />
    </section>
  )
}
