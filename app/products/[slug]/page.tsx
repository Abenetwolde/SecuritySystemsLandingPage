import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PRODUCTS, getProductBySlug } from '@/lib/products'
import { ProductHero } from '@/components/product/ProductHero'
import { BentoGrid } from '@/components/product/BentoGrid'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Security Systems`,
    description: product.shortDescription,
  }
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  return (
    <div className="min-h-screen">
      <ProductHero product={product} />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6" aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center"
        >
          Key <span className="text-cyan">Features</span>
        </h2>
        <BentoGrid features={product.features} />
      </section>
    </div>
  )
}
