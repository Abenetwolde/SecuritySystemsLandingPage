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

export interface UseCase {
  _id?: string
  title: string
  description: string
}

export interface TechSpec {
  _id?: string
  label: string
  value: string
}

export interface Product {
  slug: ProductSlug
  name: string
  shortDescription: string
  longDescription: string
  icon: string
  image: string
  screenshot: string
  mobileScreenshot?: string
  color: string
  hasDownload: boolean
  downloadFileId?: 'av-exe' | 'vpn-exe' | 'vpn-apk' | string // maps to backend download API
  features: BentoFeature[]
  requestEndpoints: string[]
  platforms?: string[]
  // Product detail page content (from DB)
  overview?: string
  whyItMatters?: string
  howItWorks?: string[]
  useCases?: UseCase[]
  technicalSpecs?: TechSpec[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'gasha-av',
    name: 'Gasha Antivirus',
    shortDescription: 'Advanced real-time protection against viruses, malware, and ransomware.',
    longDescription:
      'Gashaaa Antivirus gives you powerful protection against viruses, malware, ransomware, and online threats — all while staying light on your system. With a smart scanning engine and real-time monitoring, Gasha works quietly in the background so you can browse, work, and play without worry.',
    icon: '🛡️',
    image: '/av.png',
    screenshot: '/mokes/av.png',
    color: '#1da09c',
    hasDownload: true,
    downloadFileId: 'av-exe',
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
    overview: "Gasha Antivirus is INSA's indigenous endpoint protection platform, engineered specifically for Ethiopian government institutions and enterprises. It combines real-time behavioral analysis with a continuously updated threat intelligence database to stop viruses, ransomware, spyware, and zero-day threats before they cause damage.",
    whyItMatters: "Ethiopian government systems and critical infrastructure face a growing volume of targeted cyberattacks. Foreign antivirus solutions may not account for locally relevant threat actors or comply with national data sovereignty requirements. Gasha AV is built, maintained, and updated by INSA — ensuring your security data never leaves Ethiopian jurisdiction.",
    howItWorks: [
      'Real-time file system monitoring intercepts every file read, write, and execute operation',
      'Behavioral engine analyzes process activity patterns to detect ransomware-like behavior before encryption begins',
      "Signature database is updated continuously from INSA's threat intelligence feeds",
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
  {
    slug: 'gasha-waf',
    name: 'Gasha WAF',
    shortDescription: 'Web Application Firewall protecting your services from web-based attacks.',
    longDescription:
      'Gasha WAF provides enterprise-grade protection for web applications against SQL injection, XSS, CSRF, and other OWASP Top 10 threats. Deploy in front of any web service for instant protection.',
    icon: '🌐',
    image: '/waf.png',
    screenshot: '/mokes/waf.png',
    color: '#0d7e8dff',
    hasDownload: false,
    features: [
      { title: 'OWASP Top 10 Protection', description: 'Blocks all major web application vulnerabilities.', icon: '🛡️', size: 'lg' },
      { title: 'SQL Injection Prevention', description: 'Detects and blocks malicious SQL queries.', icon: '🗄️', size: 'md' },
      { title: 'XSS Filtering', description: 'Strips cross-site scripting payloads in real time.', icon: '✂️', size: 'sm' },
      { title: 'Rate Limiting', description: 'Prevents DDoS and brute-force attacks.', icon: '⏱️', size: 'sm' },
      { title: 'Custom Rules', description: 'Define your own security rules and policies.', icon: '⚙️', size: 'md' },
      { title: 'Audit Logging', description: 'Full request/response logging for compliance.', icon: '📋', size: 'sm' },
    ],
    requestEndpoints: ['https://securitysystems.insa.gov.et/api/api/products/av-request'],
    overview: "Gasha WAF is a Web Application Firewall developed by INSA to protect government and enterprise web portals from the full spectrum of web-based attacks. It sits transparently in front of your web application, inspecting every HTTP/HTTPS request in real time.",
    whyItMatters: "Government web portals are prime targets for defacement, data theft, and service disruption. A single SQL injection or XSS vulnerability can expose millions of citizen records. Gasha WAF provides always-on protection without requiring changes to your existing application code.",
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
  {
    slug: 'gasha-vpn',
    name: 'Gasha VPN',
    shortDescription: 'Secure, encrypted VPN for government and enterprise networks.',
    longDescription:
      'Gasha VPN provides military-grade encrypted tunnels for secure remote access to government and enterprise networks. Supports both site-to-site and client-to-site configurations.',
    icon: '🔐',
    image: '/vpn.png',
    screenshot: '/mokes/vpn.png',
    mobileScreenshot: '/mokes/vpnmobile.png',
    color: '#0891b2',
    hasDownload: true,
    downloadFileId: 'vpn-exe',
    features: [
      { title: 'AES-256 Encryption', description: 'Military-grade encryption for all traffic.', icon: '🔑', size: 'lg' },
      { title: 'Zero-Trust Access', description: 'Verify every user and device before granting access.', icon: '✅', size: 'md' },
      { title: 'Split Tunneling', description: 'Route only necessary traffic through the VPN.', icon: '🔀', size: 'sm' },
      { title: 'Multi-Factor Auth', description: 'Require MFA for all VPN connections.', icon: '📱', size: 'sm' },
      { title: 'High Availability', description: 'Automatic failover for uninterrupted connectivity.', icon: '🔄', size: 'md' },
      { title: 'Audit Trail', description: 'Complete logs of all VPN sessions and activity.', icon: '📊', size: 'sm' },
    ],
    requestEndpoints: ['https://securitysystems.insa.gov.et/api/api/products/av-request'],
    overview: "Gasha VPN provides military-grade encrypted tunnels for secure remote access to government and enterprise networks. Built for the demanding security requirements of Ethiopian government institutions, it supports both site-to-site and client-to-site configurations.",
    whyItMatters: "Remote work and inter-agency connectivity require secure, encrypted communication channels. Unencrypted or poorly secured connections expose sensitive government data to interception. Gasha VPN ensures all traffic between remote users and central systems is encrypted end-to-end.",
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
  {
    slug: 'nisir',
    name: 'Nisir',
    shortDescription: 'Network intrusion detection and security incident response platform.',
    longDescription:
      'Nisir is a comprehensive network security monitoring platform that detects intrusions, analyzes threats, and coordinates incident response across your entire infrastructure.',
    icon: '📡',
    image: '/images/Nisir.png',
    screenshot: '/mokes/seim.png',
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
    requestEndpoints: ['https://securitysystems.insa.gov.et/api/api/products/av-request'],
    overview: "Nisir is INSA's comprehensive Network Intrusion Detection and Security Incident Response platform. It provides full visibility into network traffic, correlates security events across multiple sources, and enables rapid incident response through automated playbooks.",
    whyItMatters: "Advanced persistent threats (APTs) often operate undetected for months inside government networks. Nisir provides the continuous monitoring and threat correlation needed to detect these threats early and contain them before significant damage occurs.",
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
  {
    slug: 'enyuma-iam',
    name: 'Enyuma IAM',
    shortDescription: 'Identity and Access Management for secure user authentication.',
    longDescription:
      'Enyuma IAM provides centralized identity management, single sign-on, and fine-grained access control for government and enterprise systems. Supports LDAP, SAML, and OAuth2.',
    icon: '👤',
    image: '/images/IAM.png',
    screenshot: '/mokes/iam.png',
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
    requestEndpoints: ['https://securitysystems.insa.gov.et/api/api/products/av-request'],
    overview: "Enyuma IAM is INSA's Identity and Access Management platform, providing centralized authentication, single sign-on, and fine-grained access control for government and enterprise systems. It implements zero-trust principles to ensure only verified users access authorized resources.",
    whyItMatters: "Weak identity management is the leading cause of data breaches. Shared passwords, lack of MFA, and excessive permissions create exploitable vulnerabilities. Enyuma IAM enforces strong authentication and least-privilege access across all connected systems.",
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
  {
    slug: 'abis',
    name: 'ABIS Biometrics',
    shortDescription: 'Automated Biometric Identification System for fingerprint, face, and iris.',
    longDescription:
      'ABIS (Automated Biometric Identification System) automates the identification of individuals based on their unique biological characteristics including Fingerprint, Face, and Iris recognition.',
    icon: '🫆',
    image: '/abis.png',
    screenshot: '/mokes/biometrics.png',
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
    overview: "ABIS (Automated Biometric Identification System) is INSA's platform for large-scale biometric identification using fingerprint, facial recognition, and iris scanning. It enables accurate, fast identification of individuals across millions of records for national ID, border control, and law enforcement applications.",
    whyItMatters: "Traditional ID systems based on documents and passwords are easily forged or stolen. Biometric identification provides a unique, unforgeable link between an individual and their identity. ABIS enables Ethiopia to build robust national identification infrastructure.",
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
  {
    slug: 'code-protection',
    name: 'Code Protection',
    shortDescription: 'Software protection and anti-tampering for critical applications.',
    longDescription:
      'Code Protection provides advanced obfuscation, anti-debugging, and anti-tampering mechanisms to protect your critical software from reverse engineering and unauthorized modification.',
    icon: '💻',
    image: '/images/codeprotection.png',
    screenshot: '/mokes/codepro.png',
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
    requestEndpoints: ['https://securitysystems.insa.gov.et/api/api/products/av-request'],
    overview: "Code Protection is INSA's software security platform that protects critical applications from reverse engineering, tampering, and unauthorized modification. It applies advanced obfuscation, anti-debugging, and integrity verification techniques to safeguard intellectual property and prevent exploitation.",
    whyItMatters: "Critical government and enterprise software is a high-value target for reverse engineering and tampering. Attackers who can analyze or modify application code can bypass security controls, steal algorithms, or introduce backdoors. Code Protection makes this prohibitively difficult.",
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
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
