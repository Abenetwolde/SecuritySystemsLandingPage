import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, Globe, Lock, Calendar, Clock } from 'lucide-react'

const POSTS = [
  {
    slug: 'ransomware-defense-2024',
    category: 'Threat Intelligence',
    icon: Shield,
    color: '#006666',
    title: 'Ransomware in 2024: How Ethiopian Institutions Can Stay Protected',
    excerpt: 'Ransomware attacks on government and healthcare institutions have surged globally.',
    date: 'April 10, 2025',
    readTime: '5 min read',
    image: '/av.png',
    imageBg: 'linear-gradient(135deg, #006666 0%, #004444 100%)',
    content: `
Ransomware has evolved from a nuisance into one of the most devastating cyber threats facing governments and institutions worldwide. In 2024 alone, attacks on public sector organizations increased by over 40%, with healthcare and government agencies being the primary targets.

## How Modern Ransomware Works

Today's ransomware operators use a multi-stage approach:

1. **Initial Access** — Phishing emails, exposed RDP ports, or unpatched vulnerabilities
2. **Lateral Movement** — Spreading across the network to maximize impact
3. **Data Exfiltration** — Stealing sensitive data before encryption (double extortion)
4. **Encryption** — Locking files and demanding payment

## How Gasha Antivirus Stops Ransomware

Gasha Antivirus uses a behavioral detection engine that monitors process activity in real time. Rather than relying solely on signature databases, it identifies ransomware-like behavior — such as rapid file encryption or shadow copy deletion — and terminates the process before damage spreads.

Key capabilities include:
- **Real-time behavioral monitoring** of all running processes
- **Ransomware shield** that protects critical folders from unauthorized encryption
- **Automatic rollback** of encrypted files using shadow snapshots
- **Threat intelligence** updated continuously from INSA's security research team

## Best Practices for Ethiopian Institutions

- Keep all systems patched and updated
- Implement network segmentation to limit lateral movement
- Maintain offline backups tested regularly
- Deploy endpoint protection on all workstations and servers
- Train staff to recognize phishing attempts

Gasha Antivirus is available for Windows and Linux environments and is designed to operate efficiently even on older hardware common in government institutions.
    `,
  },
  {
    slug: 'web-application-security',
    category: 'Web Security',
    icon: Globe,
    color: '#008080',
    title: 'Why Every Government Web Portal Needs a WAF',
    excerpt: 'SQL injection and cross-site scripting remain the top attack vectors against public-facing web applications.',
    date: 'March 28, 2025',
    readTime: '4 min read',
    image: '/waf.png',
    imageBg: 'linear-gradient(135deg, #008080 0%, #005555 100%)',
    content: `
Government web portals are high-value targets. They handle citizen data, process transactions, and serve as the digital face of public institutions. Yet many remain vulnerable to well-known attack vectors that a Web Application Firewall (WAF) can block in real time.

## The Top Threats to Government Web Applications

### SQL Injection
Attackers inject malicious SQL code into form fields or URL parameters to extract, modify, or delete database records. A single successful injection can expose millions of citizen records.

### Cross-Site Scripting (XSS)
Malicious scripts injected into web pages can steal session cookies, redirect users to phishing sites, or deface government portals — damaging public trust.

### CSRF and Session Hijacking
Cross-site request forgery tricks authenticated users into performing unintended actions, while session hijacking allows attackers to impersonate legitimate users.

## How Gasha WAF Protects Your Portal

Gasha WAF sits in front of your web application and inspects every HTTP/HTTPS request before it reaches your server:

- **OWASP Top 10 rule set** — blocks the most common web vulnerabilities out of the box
- **Custom rule engine** — define organization-specific security policies
- **Rate limiting** — prevents DDoS and brute-force attacks
- **Real-time logging** — full audit trail for compliance and forensics
- **Zero-downtime deployment** — transparent proxy mode requires no application changes

## Deployment Options

Gasha WAF supports both reverse proxy and inline deployment modes, making it compatible with existing infrastructure. It runs on standard Linux servers and integrates with common web servers including Apache and Nginx.
    `,
  },
  {
    slug: 'zero-trust-iam',
    category: 'Identity & Access',
    icon: Lock,
    color: '#005555',
    title: 'Zero Trust Architecture with Enyuma IAM',
    excerpt: 'The perimeter-based security model is obsolete.',
    date: 'March 14, 2025',
    readTime: '6 min read',
    image: '/images/IAM.png',
    imageBg: 'linear-gradient(135deg, #005555 0%, #003333 100%)',
    content: `
The traditional "castle and moat" security model — where everything inside the network perimeter is trusted — has been rendered obsolete by cloud adoption, remote work, and increasingly sophisticated insider threats. Zero Trust replaces this with a simple principle: **never trust, always verify**.

## What Zero Trust Means in Practice

Zero Trust is not a single product but an architectural approach built on three pillars:

1. **Verify explicitly** — Authenticate and authorize every user, device, and application on every request
2. **Use least privilege access** — Grant only the minimum permissions required for each task
3. **Assume breach** — Design systems as if attackers are already inside the network

## Enyuma IAM: Zero Trust for Ethiopian Government Systems

Enyuma IAM implements Zero Trust through a comprehensive identity and access management platform:

### Single Sign-On (SSO)
One secure login grants access to all authorized applications. Users authenticate once with strong credentials, and Enyuma IAM handles session management across all connected systems.

### Multi-Factor Authentication (MFA)
Support for TOTP authenticator apps, SMS codes, and hardware security keys ensures that stolen passwords alone cannot grant access.

### Role-Based Access Control (RBAC)
Fine-grained permissions ensure each user can only access the resources their role requires. Changes to roles are applied instantly across all connected applications.

### Continuous Session Monitoring
Enyuma IAM monitors active sessions for anomalous behavior — unusual login locations, off-hours access, or rapid permission escalation — and can automatically terminate suspicious sessions.

## Integration with Existing Systems

Enyuma IAM supports LDAP, Active Directory, SAML 2.0, and OAuth 2.0, making it compatible with both legacy government systems and modern cloud applications.
    `,
  },
]

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — INSA Security Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const Icon = post.icon

  // Convert markdown-like content to paragraphs
  const sections = post.content.trim().split('\n\n').filter(Boolean)

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
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20">
              <Icon className="h-3.5 w-3.5 text-white" />
            </div>
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
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors mb-8"
        >
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
              const items = section.split('\n').filter((l) => l.startsWith('- '))
              return (
                <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-[var(--text-muted)] text-sm">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^- \*\*(.+?)\*\* — /, (_, bold) => bold + ' — ').replace(/^- /, '')}</li>
                  ))}
                </ul>
              )
            }
            if (/^\d+\./.test(section)) {
              const items = section.split('\n').filter((l) => /^\d+\./.test(l))
              return (
                <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-[var(--text-muted)] text-sm">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^\d+\. \*\*(.+?)\*\* — /, (_, bold) => bold + ' — ').replace(/^\d+\. /, '')}</li>
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

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${post.color}, ${post.color}cc)` }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Security Systems
          </Link>
        </div>
      </div>
    </div>
  )
}
