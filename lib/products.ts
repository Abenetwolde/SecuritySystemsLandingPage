export type ProductSlug =
  | 'gasha-av'
  | 'gasha-waf'
  | 'gasha-vpn'
  | 'nisir'
  | 'enyuma-iam'
  | 'abis'
  | 'code-protection'

export interface BentoFeature {
  title: string
  description: string
  icon: string
  size: 'sm' | 'md' | 'lg'
}

export interface Product {
  slug: ProductSlug
  name: string
  shortDescription: string
  longDescription: string
  icon: string        // emoji fallback
  image: string       // path to logo image
  color: string       // accent color for card glow
  hasDownload: boolean
  features: BentoFeature[]
  requestEndpoints: string[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'gasha-av',
    name: 'Gasha Antivirus',
    shortDescription: 'Advanced real-time protection against viruses, malware, and ransomware.',
    longDescription:
      'Gasha Antivirus gives you powerful protection against viruses, malware, ransomware, and online threats — all while staying light on your system. With a smart scanning engine and real-time monitoring, Gasha works quietly in the background so you can browse, work, and play without worry.',
    icon: '🛡️',
    image: '/av.png',
    color: '#1da09c',
    hasDownload: true,
    features: [
      { title: 'Real-Time Scanning', description: 'Continuously monitors files and processes for threats.', icon: '🔍', size: 'lg' },
      { title: 'Ransomware Shield', description: 'Blocks ransomware before it can encrypt your files.', icon: '🔒', size: 'md' },
      { title: 'Lightweight Engine', description: 'Minimal CPU and memory footprint during scans.', icon: '⚡', size: 'sm' },
      { title: 'Malware Removal', description: 'Detects and removes existing infections automatically.', icon: '🧹', size: 'sm' },
      { title: 'Threat Intelligence', description: 'Updated threat database from INSA security research.', icon: '🧠', size: 'md' },
      { title: 'Quarantine Manager', description: 'Safely isolates suspicious files for review.', icon: '📦', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/av-request',
      'https://gashavpn.insa.gov.et/gashaav.php',
    ],
  },
  {
    slug: 'gasha-waf',
    name: 'Gasha WAF',
    shortDescription: 'Web Application Firewall protecting your services from web-based attacks.',
    longDescription:
      'Gasha WAF provides enterprise-grade protection for web applications against SQL injection, XSS, CSRF, and other OWASP Top 10 threats. Deploy in front of any web service for instant protection.',
    icon: '🌐',
    image: '/waf.png',
    color: '#3ed8ec',
    hasDownload: false,
    features: [
      { title: 'OWASP Top 10 Protection', description: 'Blocks all major web application vulnerabilities.', icon: '🛡️', size: 'lg' },
      { title: 'SQL Injection Prevention', description: 'Detects and blocks malicious SQL queries.', icon: '🗄️', size: 'md' },
      { title: 'XSS Filtering', description: 'Strips cross-site scripting payloads in real time.', icon: '✂️', size: 'sm' },
      { title: 'Rate Limiting', description: 'Prevents DDoS and brute-force attacks.', icon: '⏱️', size: 'sm' },
      { title: 'Custom Rules', description: 'Define your own security rules and policies.', icon: '⚙️', size: 'md' },
      { title: 'Audit Logging', description: 'Full request/response logging for compliance.', icon: '📋', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/av-request',
    ],
  },
  {
    slug: 'gasha-vpn',
    name: 'Gasha VPN',
    shortDescription: 'Secure, encrypted VPN for government and enterprise networks.',
    longDescription:
      'Gasha VPN provides military-grade encrypted tunnels for secure remote access to government and enterprise networks. Supports both site-to-site and client-to-site configurations.',
    icon: '🔐',
    image: '/vpn.png',
    color: '#0891b2',
    hasDownload: false,
    features: [
      { title: 'AES-256 Encryption', description: 'Military-grade encryption for all traffic.', icon: '🔑', size: 'lg' },
      { title: 'Zero-Trust Access', description: 'Verify every user and device before granting access.', icon: '✅', size: 'md' },
      { title: 'Split Tunneling', description: 'Route only necessary traffic through the VPN.', icon: '🔀', size: 'sm' },
      { title: 'Multi-Factor Auth', description: 'Require MFA for all VPN connections.', icon: '📱', size: 'sm' },
      { title: 'High Availability', description: 'Automatic failover for uninterrupted connectivity.', icon: '🔄', size: 'md' },
      { title: 'Audit Trail', description: 'Complete logs of all VPN sessions and activity.', icon: '📊', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/av-request',
    ],
  },
  {
    slug: 'nisir',
    name: 'Nisir',
    shortDescription: 'Network intrusion detection and security incident response platform.',
    longDescription:
      'Nisir is a comprehensive network security monitoring platform that detects intrusions, analyzes threats, and coordinates incident response across your entire infrastructure.',
    icon: '📡',
    image: '/images/Nisir.png',
    color: '#059669',
    hasDownload: false,
    features: [
      { title: 'Intrusion Detection', description: 'Real-time detection of network intrusions and anomalies.', icon: '🚨', size: 'lg' },
      { title: 'Threat Correlation', description: 'Correlates events across multiple sources for context.', icon: '🔗', size: 'md' },
      { title: 'Incident Response', description: 'Automated playbooks for rapid incident containment.', icon: '⚡', size: 'sm' },
      { title: 'Network Visibility', description: 'Full visibility into all network traffic and flows.', icon: '👁️', size: 'sm' },
      { title: 'SIEM Integration', description: 'Integrates with existing SIEM and SOC tools.', icon: '🔌', size: 'md' },
      { title: 'Compliance Reports', description: 'Automated compliance reporting for audits.', icon: '📄', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/av-request',
    ],
  },
  {
    slug: 'enyuma-iam',
    name: 'Enyuma IAM',
    shortDescription: 'Identity and Access Management for secure user authentication.',
    longDescription:
      'Enyuma IAM provides centralized identity management, single sign-on, and fine-grained access control for government and enterprise systems. Supports LDAP, SAML, and OAuth2.',
    icon: '👤',
    image: '/images/IAM.png',
    color: '#d97706',
    hasDownload: false,
    features: [
      { title: 'Single Sign-On', description: 'One login for all your applications and services.', icon: '🔑', size: 'lg' },
      { title: 'Role-Based Access', description: 'Granular permissions based on user roles.', icon: '🎭', size: 'md' },
      { title: 'MFA Support', description: 'TOTP, SMS, and hardware token authentication.', icon: '📱', size: 'sm' },
      { title: 'Directory Sync', description: 'Sync with Active Directory and LDAP.', icon: '🔄', size: 'sm' },
      { title: 'Audit Logs', description: 'Complete audit trail of all access events.', icon: '📋', size: 'md' },
      { title: 'API Security', description: 'OAuth2 and JWT-based API access control.', icon: '🔒', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/av-request',
    ],
  },
  {
    slug: 'abis',
    name: 'ABIS Biometrics',
    shortDescription: 'Automated Biometric Identification System for fingerprint, face, and iris.',
    longDescription:
      'ABIS (Automated Biometric Identification System) automates the identification of individuals based on their unique biological characteristics including Fingerprint, Face, and Iris recognition.',
    icon: '🫆',
    image: '/abis.png',
    color: '#db2777',
    hasDownload: false,
    features: [
      { title: 'Fingerprint Recognition', description: 'High-accuracy fingerprint matching at scale.', icon: '🖐️', size: 'lg' },
      { title: 'Facial Recognition', description: 'Real-time face detection and identification.', icon: '😊', size: 'md' },
      { title: 'Iris Scanning', description: 'Contactless iris recognition for high security.', icon: '👁️', size: 'sm' },
      { title: 'Multi-Modal Fusion', description: 'Combine multiple biometrics for higher accuracy.', icon: '🔀', size: 'sm' },
      { title: 'Large-Scale Matching', description: 'Identify individuals across millions of records.', icon: '📊', size: 'md' },
      { title: 'API Integration', description: 'REST API for integration with existing systems.', icon: '🔌', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/abis-request',
      'https://gashavpn.insa.gov.et/biom.php',
    ],
  },
  {
    slug: 'code-protection',
    name: 'Code Protection',
    shortDescription: 'Software protection and anti-tampering for critical applications.',
    longDescription:
      'Code Protection provides advanced obfuscation, anti-debugging, and anti-tampering mechanisms to protect your critical software from reverse engineering and unauthorized modification.',
    icon: '💻',
    image: '/images/codeprotection.png',
    color: '#ea580c',
    hasDownload: false,
    features: [
      { title: 'Code Obfuscation', description: 'Makes reverse engineering extremely difficult.', icon: '🌀', size: 'lg' },
      { title: 'Anti-Debugging', description: 'Detects and prevents debugger attachment.', icon: '🚫', size: 'md' },
      { title: 'Anti-Tampering', description: 'Detects and responds to code modification.', icon: '🔏', size: 'sm' },
      { title: 'License Enforcement', description: 'Enforce software licensing and usage limits.', icon: '📜', size: 'sm' },
      { title: 'Integrity Checks', description: 'Runtime verification of code integrity.', icon: '✅', size: 'md' },
      { title: 'Secure Storage', description: 'Encrypted storage for sensitive application data.', icon: '🗄️', size: 'sm' },
    ],
    requestEndpoints: [
      'https://securitysystems.insa.gov.et/api/api/products/av-request',
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
