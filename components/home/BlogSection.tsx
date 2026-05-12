'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { SiteSettings, BlogPost } from '@/lib/api'
import { resolveImageUrl } from '@/lib/api'
import { useAnalytics } from '@/lib/useAnalytics'

const FALLBACK_POSTS: BlogPost[] = [
  {
    _id: '1', slug: 'ransomware-defense-2024', category: 'Threat Intelligence', color: '#006666',
    title: 'Ransomware in 2024: How Ethiopian Institutions Can Stay Protected',
    excerpt: "Ransomware attacks on government and healthcare institutions have surged globally. We break down the tactics used and how Gasha Antivirus's behavioral engine stops them before encryption begins.",
    date: 'April 10, 2025', readTime: '5 min read', image: '/av.png',
    imageBg: 'linear-gradient(135deg, #006666 0%, #004444 100%)', published: true, order: 0,
  },
  {
    _id: '2', slug: 'web-application-security', category: 'Web Security', color: '#008080',
    title: 'Why Every Government Web Portal Needs a WAF',
    excerpt: "SQL injection and cross-site scripting remain the top attack vectors against public-facing web applications. Learn how Gasha WAF's rule engine provides real-time protection without impacting performance.",
    date: 'March 28, 2025', readTime: '4 min read', image: '/waf.png',
    imageBg: 'linear-gradient(135deg, #008080 0%, #005555 100%)', published: true, order: 1,
  },
  {
    _id: '3', slug: 'zero-trust-iam', category: 'Identity & Access', color: '#005555',
    title: 'Zero Trust Architecture with Enyuma IAM',
    excerpt: "The perimeter-based security model is obsolete. Discover how Enyuma IAM's zero-trust approach reduces insider threats and lateral movement.",
    date: 'March 14, 2025', readTime: '6 min read', image: '/images/IAM.png',
    imageBg: 'linear-gradient(135deg, #005555 0%, #003333 100%)', published: true, order: 2,
  },
]

export function BlogSection({ posts, settings }: { posts: BlogPost[]; settings: SiteSettings }) {
  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS
  const label = settings.blogSectionLabel || 'Security Insights'
  const title = settings.blogSectionTitle || 'From the INSA Security Blog'
  const subtext = settings.blogSectionSubtext || "Expert analysis, threat intelligence, and best practices from Ethiopia's national cybersecurity authority."
  const { track } = useAnalytics()

  return (
    <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }} aria-labelledby="blog-heading">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55 }} className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-cyan)]">{label}</p>
          <h2 id="blog-heading" className="text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
            {title.includes('INSA')
              ? <>From the <span className="text-[var(--accent-cyan)]">INSA</span> Security Blog</>
              : title}
          </h2>
          <p className="mt-3 text-[var(--text-muted)] max-w-xl mx-auto text-sm">{subtext}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post, i) => (
            <motion.article key={post.slug}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col rounded-2xl border border-[var(--glass-border)] overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1.5"
              style={{ background: 'var(--card-bg)', backdropFilter: 'blur(12px)' }}>
              <Link href={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden" tabIndex={-1}>
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: post.imageBg }}>
                  <div className="absolute top-4 right-4 h-20 w-20 rounded-full opacity-10 bg-white" />
                  <div className="absolute bottom-2 left-6 h-12 w-12 rounded-full opacity-10 bg-white" />
                  <Image src={resolveImageUrl(post.image) || post.image} alt={post.title} width={80} height={80}
                    className="object-contain relative z-10 drop-shadow-lg"
                    style={{ filter: 'brightness(1.2) drop-shadow(0 4px 16px rgba(255,255,255,0.3))' }} />
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
                  style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
                  {post.category}
                </div>
              </Link>
              <div className="flex flex-col flex-1 p-5">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2.5 leading-snug group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{post.date} · {post.readTime}</span>
                  <Link href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 font-semibold transition-colors hover:text-[var(--accent-cyan)]"
                    style={{ color: post.color }}
                    onClick={() => track('blog_read_more_click', { slug: post.slug, title: post.title })}>
                    Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
