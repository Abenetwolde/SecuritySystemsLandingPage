import type { Product } from '@/lib/products'
import { PRODUCTS } from '@/lib/products'

// Server-side: use the env var directly (works in both dev and prod)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:4000'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TrustedLogo { src: string; alt: string }
export interface FooterLink { label: string; href: string; external: boolean }
export interface SiteSettings {
  heroHeadlineLine1: string[]
  heroHeadlineLine2: string[]
  heroSubtext: string
  heroCTAText: string
  trustedLogos: TrustedLogo[]
  blogSectionLabel: string
  blogSectionTitle: string
  blogSectionSubtext: string
  feedbackTitle: string
  feedbackSubtext: string
  footerTagline: string
  footerMarqueeText: string
  footerCopyright: string
  footerLinks: FooterLink[]
}
export interface BlogPost {
  _id: string
  slug: string
  category: string
  color: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  imageBg: string
  published: boolean
  order: number
}
export interface HomepageData {
  products: Product[]
  settings: SiteSettings
  blogPosts: BlogPost[]
}

// Static fallback settings (used when API is unavailable)
const FALLBACK_SETTINGS: SiteSettings = {
  heroHeadlineLine1: ["Securing", "Ethiopia's"],
  heroHeadlineLine2: ["Critical", "Digital", "Systems"],
  heroSubtext: "We provide AI-powered cybersecurity solutions to protect government systems, businesses, and critical infrastructure across Ethiopia — built and operated by INSA.",
  heroCTAText: "Explore Security Solutions",
  trustedLogos: [
    { src: '/niss.png', alt: 'National Intelligence and Security Service' },
    { src: '/pmo.png', alt: 'Office of the Prime Minister' },
    { src: '/enter.png', alt: 'Ethiopian Enterprise Development' },
    { src: '/trade.png', alt: 'Ministry of Trade and Regional Integration' },
  ],
  blogSectionLabel: "Security Insights",
  blogSectionTitle: "From the Security Systems Blog",
  blogSectionSubtext: "Expert analysis, threat intelligence, and best practices from Ethiopia's national cybersecurity authority.",
  feedbackTitle: "We would like to hear from You!",
  feedbackSubtext: "Please give us your feedback on our products and services",
  footerTagline: "Indigenous cybersecurity solutions developed by INSA to safeguard Ethiopia's national interests and critical infrastructure.",
  footerMarqueeText: "🔒 Cyber security is a shared responsibility!! &nbsp;&nbsp;&nbsp; 🛡️ Protect your systems today",
  footerCopyright: "INSA — Information Network Security Administration. All rights reserved.",
  footerLinks: [],
}

// ── Image URL resolution ──────────────────────────────────────────────────────
/**
 * Resolve a stored image path to a full URL for rendering.
 * - `/uploads/...`  → prepend API_BASE (backend-served upload)
 * - `http(s)://...` → already absolute, pass through
 * - anything else   → portal public folder path, pass through
 *
 * The backend always stores RELATIVE paths (/uploads/...).
 * The portal resolves them using its own NEXT_PUBLIC_API_BASE_URL env var.
 * This means the URL is always environment-correct regardless of where the portal runs.
 */
export function resolveImageUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Already absolute — but strip any baked-in backend base URL and re-resolve
    // This handles the case where old DB records have the full URL stored
    const knownBases = [API_BASE, 'http://172.20.136.19:4000', 'http://localhost:4000']
    for (const base of knownBases) {
      if (path.startsWith(base + '/uploads/')) {
        return `${API_BASE}${path.slice(base.length)}`
      }
    }
    return path
  }
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`
  return path // portal public folder path (e.g. /av.png)
}

function resolveProductImages(product: Product): Product {
  return {
    ...product,
    image:            resolveImageUrl(product.image),
    screenshot:       resolveImageUrl(product.screenshot),
    mobileScreenshot: product.mobileScreenshot ? resolveImageUrl(product.mobileScreenshot) : product.mobileScreenshot,
  }
}

function mergeWithFallback(apiProduct: Product, fallback: Product): Product {
  return {
    ...fallback,
    ...apiProduct,
    overview:       apiProduct.overview?.trim()         || fallback.overview,
    whyItMatters:   apiProduct.whyItMatters?.trim()     || fallback.whyItMatters,
    howItWorks:     (apiProduct.howItWorks?.length)     ? apiProduct.howItWorks     : fallback.howItWorks,
    useCases:       (apiProduct.useCases?.length)       ? apiProduct.useCases       : fallback.useCases,
    technicalSpecs: (apiProduct.technicalSpecs?.length) ? apiProduct.technicalSpecs : fallback.technicalSpecs,
    features:       (apiProduct.features?.length)       ? apiProduct.features       : fallback.features,
    image:            resolveImageUrl(apiProduct.image)      || fallback.image,
    screenshot:       resolveImageUrl(apiProduct.screenshot) || fallback.screenshot,
    mobileScreenshot: apiProduct.mobileScreenshot
      ? resolveImageUrl(apiProduct.mobileScreenshot)
      : fallback.mobileScreenshot,
    platforms: (apiProduct.platforms?.length) ? apiProduct.platforms : fallback.platforms,
  }
}

// ── Homepage data (single fetch for everything the homepage needs) ─────────────
export async function getHomepageData(): Promise<HomepageData> {
  try {
    const url = `${API_BASE}/api/security-site/homepage`
    console.log('[getHomepageData] Fetching from:', url)
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      console.error('[getHomepageData] API returned', res.status, '— using static fallback')
      return { products: PRODUCTS, settings: FALLBACK_SETTINGS, blogPosts: [] }
    }
    const data: HomepageData = await res.json()
    // Merge products with static fallbacks and resolve image URLs
    const mergedProducts = (data.products || []).map(apiProduct => {
      const fallback = PRODUCTS.find(p => p.slug === apiProduct.slug)
      return fallback ? mergeWithFallback(apiProduct, fallback) : resolveProductImages(apiProduct)
    })
    // Resolve trusted logo image URLs
    const resolvedSettings: SiteSettings = {
      ...FALLBACK_SETTINGS,
      ...data.settings,
      trustedLogos: (data.settings?.trustedLogos?.length
        ? data.settings.trustedLogos
        : FALLBACK_SETTINGS.trustedLogos
      ).map(logo => ({ ...logo, src: resolveImageUrl(logo.src) })),
    }
    return {
      products: mergedProducts.length > 0 ? mergedProducts : PRODUCTS,
      settings: resolvedSettings,
      blogPosts: data.blogPosts || [],
    }
  } catch (err) {
    console.error('[getHomepageData] Failed to fetch:', err, '— using static fallback')
    return { products: PRODUCTS, settings: FALLBACK_SETTINGS, blogPosts: [] }
  }
}

// ── Individual product (full data for product detail page) ────────────────────
export async function getProducts(): Promise<Product[]> {
  const data = await getHomepageData()
  return data.products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const staticFallback = PRODUCTS.find(p => p.slug === slug) ?? null
  try {
    const url = `${API_BASE}/api/security-products/${slug}`
    console.log('[getProductBySlug] Fetching from:', url)
    const res = await fetch(url, { cache: 'no-store' })
    if (res.status === 404) return staticFallback
    if (!res.ok) {
      console.error('[getProductBySlug] API returned', res.status, '— using static fallback')
      return staticFallback
    }
    const apiProduct: Product = await res.json()
    return staticFallback ? mergeWithFallback(apiProduct, staticFallback) : resolveProductImages(apiProduct)
  } catch (err) {
    console.error(`[getProductBySlug] Failed to fetch "${slug}":`, err, '— using static fallback')
    return staticFallback
  }
}
