import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProducts, getProductBySlug } from '@/lib/api'
import { ProductHero } from '@/components/product/ProductHero'
import { BentoGrid } from '@/components/product/BentoGrid'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()

  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  console.log("product detail===============",JSON.stringify(product, null, 4) )
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Security Systems`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ProductHero product={product} />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 space-y-16">

        {/* Overview + Why it matters */}
        {(product.overview || product.whyItMatters) && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {product.overview && (
              <div className="rounded-2xl border border-[var(--glass-border)] p-7" style={{ background: 'var(--card-bg)' }}>
                <h2 className="text-lg font-bold mb-3" style={{ color: product.color }}>Overview</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{product.overview}</p>
              </div>
            )}
            {product.whyItMatters && (
              <div className="rounded-2xl border border-[var(--glass-border)] p-7" style={{ background: 'var(--card-bg)' }}>
                <h2 className="text-lg font-bold mb-3" style={{ color: product.color }}>Why It Matters</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{product.whyItMatters}</p>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        {product.howItWorks && product.howItWorks.length > 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-6 text-center">
              How <span style={{ color: product.color }}>{product.name}</span> Works
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.howItWorks.map((step: string, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-[var(--glass-border)] p-5"
                  style={{ background: 'var(--card-bg)' }}
                >
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: product.color }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Features */}
        {product.features && product.features.length > 0 && (
          <section aria-labelledby="features-heading">
            <h2
              id="features-heading"
              className="text-2xl font-extrabold text-[var(--text-primary)] mb-8 text-center"
            >
              Key <span style={{ color: product.color }}>Features</span>
            </h2>
            <BentoGrid features={product.features} />
          </section>
        )}

        {/* Use Cases + Technical Specs */}
        {((product.useCases && product.useCases.length > 0) || (product.technicalSpecs && product.technicalSpecs.length > 0)) && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {product.useCases && product.useCases.length > 0 && (
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-5">Use Cases</h2>
                <div className="space-y-3">
                  {product.useCases.map((uc: { title: string; description: string }, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[var(--glass-border)] p-4"
                      style={{ background: 'var(--card-bg)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: product.color }} />
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{uc.title}</h3>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-4">{uc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {product.technicalSpecs && product.technicalSpecs.length > 0 && (
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-5">Technical Specifications</h2>
                <div
                  className="rounded-2xl border border-[var(--glass-border)] overflow-hidden"
                  style={{ background: 'var(--card-bg)' }}
                >
                  {product.technicalSpecs.map((spec: { label: string; value: string }, i: number) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 px-5 py-3 border-b border-[var(--glass-border)] last:border-0"
                    >
                      <span className="text-xs font-semibold text-[var(--text-muted)] flex-shrink-0 w-36">{spec.label}</span>
                      <span className="text-xs text-[var(--text-primary)] text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
