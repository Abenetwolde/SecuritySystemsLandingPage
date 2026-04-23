'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/GlassCard'
import type { BentoFeature } from '@/lib/products'

interface BentoGridProps {
  features: BentoFeature[]
}

export function BentoGrid({ features }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Product features">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          role="listitem"
          className={feature.size === 'lg' ? 'sm:col-span-2' : ''}
        >
          <GlassCard hover className="h-full flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 text-xl"
                aria-hidden="true"
              >
                {feature.icon}
              </span>
              <h3 className="font-semibold text-[var(--text-primary)]">{feature.title}</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{feature.description}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
