import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface BlogPost {
  slug: string
  category: string
  color: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  imageBg: string
  content: string
  published?: boolean
}

// ── Static fallback posts (always available even if API is down) ───────────────
const STATIC_POSTS: BlogPost[] = [
  {
    slug: 'ransomware-defense-2024',
    category: 'Threat Intelligence',
    color: '#006666',
    title: 'Ransomware in 2024: How Ethiopian Institutions Can Stay Protected',
    excerpt: 'Ransomware attacks on government and healthcare institutions have surged globally.',
    date: 'April 10, 2025',
    readTime: '5 min read',
    image: '/av.png',
    imageBg: 'linear-gradient(135deg, #006666 0%, #004444 100%)',
    content: `Ransomware has evolved from a nuisance into one of the most devastating cyber threats facing governments and institutions worldwide.

## How Modern Ransomware Works

Today's ransomware operators use a multi-stage approach:

1. **Initial Access** — Phishing emails, exposed RDP ports, or unpatched vulnerabilities
2. **Lateral Movement** — Spreading across the network to maximize impact
3. **Data Exfiltration** — Stealing sensitive data before encryption (double extortion)
4. **Encryption** — Locking files and demanding payment

## How Gasha Antivirus Stops Ransomware

Gasha Antivirus uses a behavioral detection engine that monitors process activity in real time. Key capabilities include:
- **Real-time behavioral monitoring** of all running processes
- **Ransomware shield** that protects critical folders from unauthorized encryption
- **Threat intelligence** updated continuously from INSA's security research team

## Best Practices for Ethiopian Institutions

- Keep all systems patched and updated
- Implement network segmentation to limit lateral movement
- Maintain offline backups tested regularly
- Deploy endpoint protection on all workstations and servers`,
  },
  {
    slug: 'web-application-security',
    category: 'Web Security',
    color: '#008080',
    title: 'Why Every Government Web Portal Needs a WAF',
    excerpt: 'SQL injection and cross-site scripting remain the top attack vectors against public-facing web applications.',
    date: 'March 28, 2025',
    readTime: '4 min read',
    image: '/waf.png',
    imageBg: 'linear-gradient(135deg, #008080 0%, #005555 100%)',
    content: `Government web portals are high-value targets. They handle citizen data, process transactions, and serve as the digital face of public institutions.

## The Top Threats to Government Web Applications

### SQL Injection
Attackers inject malicious SQL code into form fields or URL parameters to extract, modify, or delete database records.

### Cross-Site Scripting (XSS)
Malicious scripts injected into web pages can steal session cookies, redirect users to phishing sites, or deface government portals.

## How Gasha WAF Protects Your Portal

Gasha WAF sits in front of your web application and inspects every HTTP/HTTPS request before it reaches your server:
- **OWASP Top 10 rule set** — blocks the most common web vulnerabilities out of the box
- **Custom rule engine** — define organization-specific security policies
- **Rate limiting** — prevents DDoS and brute-force attacks`,
  },
  {
    slug: 'zero-trust-iam',
    category: 'Identity & Access',
    color: '#005555',
    title: 'Zero Trust Architecture with Enyuma IAM',
    excerpt: 'The perimeter-based security model is obsolete.',
    date: 'March 14, 2025',
    readTime: '6 min read',
    image: '/images/IAM.png',
    imageBg: 'linear-gradient(135deg, #005555 0%, #003333 100%)',
    content: `The traditional "castle and moat" security model has been rendered obsolete by cloud adoption, remote work, and increasingly sophisticated insider threats.

## What Zero Trust Means in Practice

Zero Trust is built on three pillars:

1. **Verify explicitly** — Authenticate and authorize every user, device, and application on every request
2. **Use least privilege access** — Grant only the minimum permissions required for each task
3. **Assume breach** — Design systems as if attackers are already inside the network

## Enyuma IAM: Zero Trust for Ethiopian Government Systems

### Single Sign-On (SSO)
One secure login grants access to all authorized applications.

### Multi-Factor Authentication (MFA)
Support for TOTP authenticator apps, SMS codes, and hardware security keys.

### Role-Based Access Control (RBAC)
Fine-grained permissions ensure each user can only access the resources their role requires.`,
  },
]

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:4000'

async function getPost(slug: string): Promise<BlogPost | null> {
  // 1. Try DB API
  try {
    const res = await fetch(`${API_BASE}/api/security-site/blog/${slug}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data && data.slug) return data as BlogPost
    }
  } catch { /* fall through */ }

  // 2. Fall back to static posts
  return STATIC_POSTS.find(p => p.slug === slug) ?? null
}

async function getAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/api/security-site/blog`, { cache: 'no-store' })
    if (res.ok) {
      const posts: BlogPost[] = await res.json()
      if (Array.isArray(posts) && posts.length > 0) {
        return posts.map(p => p.slug)
      }
    }
  } catch { /* fall through */ }
  return STATIC_POSTS.map(p => p.slug)
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — INSA Security Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const sections = (post.content || '').trim().split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero banner */}
      <div className="relative h-64 sm:h-80 flex items-end" style={{ background: post.imageBg }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <Image src={post.image} alt="" width={200} height={200} className="object-contain" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">{post.category}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl leading-snug">{post.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <article className="prose prose-sm max-w-none" style={{ color: 'var(--text-primary)' }}>
          {sections.map((section, i) => {
            if (section.startsWith('## ')) {
              return (
                <h2 key={i} className="text-xl font-bold mt-8 mb-3" style={{ color: 'var(--text-primary)' }}>
                  {section.replace('## ', '')}
                </h2>
              )
            }
            if (section.startsWith('### ')) {
              return (
                <h3 key={i} className="text-base font-bold mt-6 mb-2" style={{ color: post.color }}>
                  {section.replace('### ', '')}
                </h3>
              )
            }
            if (section.startsWith('- ') || section.includes('\n- ')) {
              const items = section.split('\n').filter(l => l.startsWith('- '))
              return (
                <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-[var(--text-muted)] text-sm">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^- \*\*(.+?)\*\* — /, (_, b) => b + ' — ').replace(/^- /, '')}</li>
                  ))}
                </ul>
              )
            }
            if (/^\d+\./.test(section)) {
              const items = section.split('\n').filter(l => /^\d+\./.test(l))
              return (
                <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-[var(--text-muted)] text-sm">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^\d+\. \*\*(.+?)\*\* — /, (_, b) => b + ' — ').replace(/^\d+\. /, '')}</li>
                  ))}
                </ol>
              )
            }
            return (
              <p key={i} className="text-sm leading-relaxed my-4" style={{ color: 'var(--text-muted)' }}>
                {section.replace(/\*\*(.+?)\*\*/g, '$1')}
              </p>
            )
          })}
        </article>

        <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
          <Link href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${post.color}, ${post.color}cc)` }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Security Systems
          </Link>
        </div>
      </div>
    </div>
  )
}
