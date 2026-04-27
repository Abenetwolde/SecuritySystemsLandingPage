import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PRODUCTS, getProductBySlug } from '@/lib/products'
import { ProductHero } from '@/components/product/ProductHero'
import { BentoGrid } from '@/components/product/BentoGrid'

// ── Per-product detailed content ─────────────────────────────────
const PRODUCT_DETAILS: Record<string, {
  overview: string
  whyItMatters: string
  howItWorks: string[]
  useCases: { title: string; description: string }[]
  technicalSpecs: { label: string; value: string }[]
}> = {
  'gasha-av': {
    overview: 'Gasha Antivirus is INSA\'s indigenous endpoint protection platform, engineered specifically for Ethiopian government institutions and enterprises. It combines real-time behavioral analysis with a continuously updated threat intelligence database to stop viruses, ransomware, spyware, and zero-day threats before they cause damage.',
    whyItMatters: 'Ethiopian government systems and critical infrastructure face a growing volume of targeted cyberattacks. Foreign antivirus solutions may not account for locally relevant threat actors or comply with national data sovereignty requirements. Gasha AV is built, maintained, and updated by INSA — ensuring your security data never leaves Ethiopian jurisdiction.',
    howItWorks: [
      'Real-time file system monitoring intercepts every file read, write, and execute operation',
      'Behavioral engine analyzes process activity patterns to detect ransomware-like behavior before encryption begins',
      'Signature database is updated continuously from INSA\'s threat intelligence feeds',
      'Quarantine manager isolates suspicious files in an encrypted vault for safe review',
      'Lightweight agent runs as a background service with minimal CPU and RAM impact',
    ],
    useCases: [
      { title: 'Government Ministries', description: 'Protect workstations and servers handling sensitive citizen data and classified documents.' },
      { title: 'Financial Institutions', description: 'Defend banking systems against financial malware, keyloggers, and credential stealers.' },
      { title: 'Healthcare Facilities', description: 'Safeguard patient records and medical devices from ransomware attacks.' },
      { title: 'Educational Institutions', description: 'Secure student and faculty systems across university networks.' },
    ],
    technicalSpecs: [
      { label: 'Supported OS', value: 'Windows 7/8/10/11, Ubuntu, CentOS, RHEL' },
      { label: 'Architecture', value: '32-bit and 64-bit' },
      { label: 'Deployment', value: 'On-premise, centrally managed' },
      { label: 'Update Frequency', value: 'Continuous (cloud-assisted)' },
      { label: 'Management Console', value: 'Web-based centralized dashboard' },
      { label: 'Scan Types', value: 'Real-time, scheduled, on-demand' },
    ],
  },
  'gasha-waf': {
    overview: 'Gasha WAF is a Web Application Firewall developed by INSA to protect government and enterprise web portals from the full spectrum of web-based attacks. It sits transparently in front of your web application, inspecting every HTTP/HTTPS request in real time.',
    whyItMatters: 'Government web portals are prime targets for defacement, data theft, and service disruption. A single SQL injection or XSS vulnerability can expose millions of citizen records. Gasha WAF provides always-on protection without requiring changes to your existing application code.',
    howItWorks: [
      'Operates as a reverse proxy, intercepting all traffic before it reaches your web server',
      'Applies OWASP Top 10 rule sets to block SQL injection, XSS, CSRF, and path traversal attacks',
      'Custom rule engine allows security teams to define organization-specific policies',
      'Rate limiting and IP reputation filtering prevent DDoS and brute-force attacks',
      'Full request/response logging provides audit trails for compliance and forensic investigation',
    ],
    useCases: [
      { title: 'Government Web Portals', description: 'Protect citizen-facing services from defacement and data exfiltration.' },
      { title: 'E-Government Services', description: 'Secure online tax, licensing, and registration platforms.' },
      { title: 'API Gateways', description: 'Protect REST and SOAP APIs from injection and abuse attacks.' },
      { title: 'Banking Portals', description: 'Defend online banking interfaces from credential stuffing and session hijacking.' },
    ],
    technicalSpecs: [
      { label: 'Deployment Mode', value: 'Reverse proxy (transparent)' },
      { label: 'Supported Protocols', value: 'HTTP/1.1, HTTP/2, HTTPS/TLS' },
      { label: 'Rule Sets', value: 'OWASP Core Rule Set + custom rules' },
      { label: 'Web Servers', value: 'Apache, Nginx, IIS (any via proxy)' },
      { label: 'Logging', value: 'Full request/response audit log' },
      { label: 'Management', value: 'Web-based admin console' },
    ],
  },
  'gasha-vpn': {
    overview: 'Gasha VPN provides military-grade encrypted tunnels for secure remote access to government and enterprise networks. Built for the demanding security requirements of Ethiopian government institutions, it supports both site-to-site and client-to-site configurations.',
    whyItMatters: 'Remote work and inter-agency connectivity require secure, encrypted communication channels. Unencrypted or poorly secured connections expose sensitive government data to interception. Gasha VPN ensures all traffic between remote users and central systems is encrypted end-to-end.',
    howItWorks: [
      'Establishes AES-256 encrypted tunnels between clients and the VPN gateway',
      'Zero-trust access model verifies every connection attempt before granting network access',
      'Multi-factor authentication adds a second layer of identity verification',
      'Split tunneling routes only necessary traffic through the VPN, preserving bandwidth',
      'High availability configuration with automatic failover ensures uninterrupted connectivity',
    ],
    useCases: [
      { title: 'Remote Government Workers', description: 'Secure access to internal systems for staff working outside the office.' },
      { title: 'Inter-Agency Connectivity', description: 'Encrypted site-to-site links between government ministries and agencies.' },
      { title: 'Field Operations', description: 'Secure connectivity for field teams accessing central databases.' },
      { title: 'Mobile Workforce', description: 'VPN clients for Android and iOS devices used by mobile staff.' },
    ],
    technicalSpecs: [
      { label: 'Encryption', value: 'AES-256-GCM' },
      { label: 'Protocols', value: 'OpenVPN, IKEv2/IPSec' },
      { label: 'Authentication', value: 'Certificate + MFA (TOTP/SMS)' },
      { label: 'Platforms', value: 'Windows, Linux, Android, iOS' },
      { label: 'Topology', value: 'Site-to-site, client-to-site' },
      { label: 'High Availability', value: 'Active-passive failover' },
    ],
  },
  'nisir': {
    overview: 'Nisir is INSA\'s comprehensive Network Intrusion Detection and Security Incident Response platform. It provides full visibility into network traffic, correlates security events across multiple sources, and enables rapid incident response through automated playbooks.',
    whyItMatters: 'Advanced persistent threats (APTs) often operate undetected for months inside government networks. Nisir provides the continuous monitoring and threat correlation needed to detect these threats early and contain them before significant damage occurs.',
    howItWorks: [
      'Network sensors capture and analyze all traffic flows across the monitored infrastructure',
      'Signature-based and anomaly-based detection engines identify known and unknown threats',
      'Event correlation engine links related alerts across multiple sources to identify attack campaigns',
      'Automated incident response playbooks trigger containment actions when threats are confirmed',
      'SIEM integration consolidates security events into a unified dashboard for SOC analysts',
    ],
    useCases: [
      { title: 'National SOC', description: 'Central monitoring of government network infrastructure for the national Security Operations Center.' },
      { title: 'Critical Infrastructure', description: 'Protect power, water, and telecommunications networks from cyber intrusions.' },
      { title: 'Financial Networks', description: 'Monitor banking and payment networks for fraudulent activity and intrusions.' },
      { title: 'Enterprise Networks', description: 'Provide visibility and threat detection for large enterprise environments.' },
    ],
    technicalSpecs: [
      { label: 'Detection Methods', value: 'Signature-based + behavioral anomaly' },
      { label: 'Data Sources', value: 'Network flows, logs, endpoint events' },
      { label: 'SIEM Integration', value: 'Syslog, CEF, LEEF formats' },
      { label: 'Response', value: 'Automated playbooks + manual investigation' },
      { label: 'Deployment', value: 'On-premise, distributed sensors' },
      { label: 'Dashboard', value: 'Real-time SOC console' },
    ],
  },
  'enyuma-iam': {
    overview: 'Enyuma IAM is INSA\'s Identity and Access Management platform, providing centralized authentication, single sign-on, and fine-grained access control for government and enterprise systems. It implements zero-trust principles to ensure only verified users access authorized resources.',
    whyItMatters: 'Weak identity management is the leading cause of data breaches. Shared passwords, lack of MFA, and excessive permissions create exploitable vulnerabilities. Enyuma IAM enforces strong authentication and least-privilege access across all connected systems.',
    howItWorks: [
      'Centralized identity store manages user accounts, roles, and permissions across all connected applications',
      'Single Sign-On (SSO) allows users to authenticate once and access all authorized systems',
      'Multi-factor authentication enforces TOTP, SMS, or hardware token verification',
      'Role-based access control (RBAC) ensures users only access resources their role requires',
      'Continuous session monitoring detects anomalous access patterns and terminates suspicious sessions',
    ],
    useCases: [
      { title: 'Government Ministries', description: 'Unified identity management across multiple ministry systems and applications.' },
      { title: 'Enterprise IT', description: 'Centralized access control for corporate applications, VPNs, and cloud services.' },
      { title: 'Healthcare Systems', description: 'Role-based access to patient records ensuring only authorized staff can view sensitive data.' },
      { title: 'Educational Institutions', description: 'Single sign-on for students and faculty across learning management and administrative systems.' },
    ],
    technicalSpecs: [
      { label: 'Protocols', value: 'SAML 2.0, OAuth 2.0, OpenID Connect' },
      { label: 'Directory Integration', value: 'LDAP, Active Directory' },
      { label: 'MFA Methods', value: 'TOTP, SMS, Hardware tokens' },
      { label: 'Access Control', value: 'RBAC, ABAC' },
      { label: 'SSO', value: 'Web, desktop, and mobile applications' },
      { label: 'Audit', value: 'Complete access event logging' },
    ],
  },
  'abis': {
    overview: 'ABIS (Automated Biometric Identification System) is INSA\'s platform for large-scale biometric identification using fingerprint, facial recognition, and iris scanning. It enables accurate, fast identification of individuals across millions of records for national ID, border control, and law enforcement applications.',
    whyItMatters: 'Traditional ID systems based on documents and passwords are easily forged or stolen. Biometric identification provides a unique, unforgeable link between an individual and their identity. ABIS enables Ethiopia to build robust national identification infrastructure.',
    howItWorks: [
      'Biometric capture devices collect fingerprint, face, and iris data from individuals',
      'Feature extraction algorithms convert raw biometric data into compact, searchable templates',
      'Matching engine compares submitted biometrics against the enrolled database at high speed',
      'Multi-modal fusion combines multiple biometric types to achieve higher accuracy',
      'REST API enables integration with existing government and enterprise systems',
    ],
    useCases: [
      { title: 'National ID Program', description: 'Enroll and verify citizens for the national identification system.' },
      { title: 'Border Control', description: 'Verify traveler identities at ports of entry against watchlists.' },
      { title: 'Law Enforcement', description: 'Identify suspects by matching fingerprints or faces against criminal databases.' },
      { title: 'Civil Registration', description: 'Prevent duplicate registrations in voter rolls and benefit programs.' },
    ],
    technicalSpecs: [
      { label: 'Biometric Modalities', value: 'Fingerprint, Face, Iris' },
      { label: 'Database Scale', value: 'Millions of records' },
      { label: 'Matching Speed', value: 'Sub-second identification' },
      { label: 'Accuracy', value: 'FAR < 0.001%, FRR < 1%' },
      { label: 'Integration', value: 'REST API, SDK' },
      { label: 'Deployment', value: 'On-premise, air-gapped' },
    ],
  },
  'code-protection': {
    overview: 'Code Protection is INSA\'s software security platform that protects critical applications from reverse engineering, tampering, and unauthorized modification. It applies advanced obfuscation, anti-debugging, and integrity verification techniques to safeguard intellectual property and prevent exploitation.',
    whyItMatters: 'Critical government and enterprise software is a high-value target for reverse engineering and tampering. Attackers who can analyze or modify application code can bypass security controls, steal algorithms, or introduce backdoors. Code Protection makes this prohibitively difficult.',
    howItWorks: [
      'Code obfuscation transforms readable code into functionally equivalent but incomprehensible form',
      'Anti-debugging techniques detect and respond to debugger attachment attempts',
      'Anti-tampering mechanisms verify code integrity at runtime and respond to unauthorized modifications',
      'License enforcement controls software usage based on hardware fingerprinting and time limits',
      'Encrypted storage protects sensitive application data and configuration from extraction',
    ],
    useCases: [
      { title: 'Government Software', description: 'Protect classified algorithms and sensitive logic in government applications.' },
      { title: 'Financial Applications', description: 'Prevent reverse engineering of trading algorithms and fraud detection logic.' },
      { title: 'License Management', description: 'Enforce software licensing for commercial applications distributed to institutions.' },
      { title: 'Critical Infrastructure Software', description: 'Protect control system software from tampering and unauthorized modification.' },
    ],
    technicalSpecs: [
      { label: 'Supported Languages', value: 'C, C++, Java, .NET' },
      { label: 'Obfuscation', value: 'Control flow, string, symbol' },
      { label: 'Anti-Debug', value: 'Multi-layer detection' },
      { label: 'Integrity Check', value: 'Runtime hash verification' },
      { label: 'License Types', value: 'Hardware-bound, time-limited, network' },
      { label: 'Platforms', value: 'Windows, Linux' },
    ],
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Security Systems`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const details = PRODUCT_DETAILS[product.slug]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ProductHero product={product} />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 space-y-16">

        {/* Overview + Why it matters */}
        {details && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--glass-border)] p-7" style={{ background: 'var(--card-bg)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: product.color }}>Overview</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{details.overview}</p>
            </div>
            <div className="rounded-2xl border border-[var(--glass-border)] p-7" style={{ background: 'var(--card-bg)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: product.color }}>Why It Matters</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{details.whyItMatters}</p>
            </div>
          </div>
        )}

        {/* How it works */}
        {details && (
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-6 text-center">
              How <span style={{ color: product.color }}>{product.name}</span> Works
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {details.howItWorks.map((step, i) => (
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
        <section aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="text-2xl font-extrabold text-[var(--text-primary)] mb-8 text-center"
          >
            Key <span style={{ color: product.color }}>Features</span>
          </h2>
          <BentoGrid features={product.features} />
        </section>

        {/* Use Cases + Technical Specs */}
        {details && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Use Cases */}
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-5">Use Cases</h2>
              <div className="space-y-3">
                {details.useCases.map((uc, i) => (
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

            {/* Technical Specs */}
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-5">Technical Specifications</h2>
              <div
                className="rounded-2xl border border-[var(--glass-border)] overflow-hidden"
                style={{ background: 'var(--card-bg)' }}
              >
                {details.technicalSpecs.map((spec, i) => (
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
          </div>
        )}
      </div>
    </div>
  )
}
