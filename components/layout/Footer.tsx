import Link from 'next/link'
import Image from 'next/image'
import { PRODUCTS } from '@/lib/products'

const BLOG_LINKS = [
  { label: 'Ransomware Defense 2024', href: '/blog/ransomware-defense-2024' },
  { label: 'Web Application Security', href: '/blog/web-application-security' },
  { label: 'Zero Trust with Enyuma IAM', href: '/blog/zero-trust-iam' },
]

const CONTACT_LINKS = [
  { label: 'securitysystems.insa.gov.et', href: 'https://securitysystems.insa.gov.et', external: true },
  { label: 'insa.gov.et', href: 'https://insa.gov.et', external: true },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)]" style={{ background: 'var(--bg-secondary)' }} role="contentinfo">
      {/* Marquee */}
      <div className="overflow-hidden border-b border-[var(--glass-border)] py-2">
        <p
          className="animate-marquee inline-block text-sm font-semibold text-[var(--accent-cyan)]"
          style={{ textShadow: '0 0 12px rgba(0,102,102,0.6)' }}
          aria-label="Cyber security is a shared responsibility"
        >
          🔒 Cyber security is a shared responsibility!! &nbsp;&nbsp;&nbsp; 🛡️ Protect your systems today &nbsp;&nbsp;&nbsp; 🔒 Cyber security is a shared responsibility!! &nbsp;&nbsp;&nbsp; 🛡️ Protect your systems today &nbsp;&nbsp;&nbsp;
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                src="/ss.png"
                alt="Security Systems"
                width={36}
                height={36}
                className="object-contain group-hover:drop-shadow-[0_0_6px_rgba(0,102,102,0.5)] transition-all"
              />
              <span className="font-bold text-[var(--text-primary)]">
                Security <span className="text-[var(--accent-cyan)]">Systems</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Indigenous cybersecurity solutions developed by INSA to safeguard Ethiopia's national interests and critical infrastructure.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Products</h3>
            <ul className="space-y-2">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    <Image src={p.image} alt={p.name} width={16} height={16} className="object-contain opacity-70" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Security Blog</h3>
            <ul className="space-y-2">
              {BLOG_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors leading-relaxed block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / INSA */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">INSA</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Established under Proclamation No. 808/2013 to ensure the security of Ethiopia's national information infrastructure.
            </p>
            <ul className="space-y-2">
              {CONTACT_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--accent-cyan)] hover:underline transition-colors"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--glass-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} INSA — Information Network Security Administration. All rights reserved.</p>
          <p className="font-semibold text-[var(--accent-cyan)]">
            Cyber security is a shared responsibility!!
          </p>
        </div>
      </div>
    </footer>
  )
}
