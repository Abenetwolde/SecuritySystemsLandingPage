import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PortalShell } from '@/components/shared/PortalShell'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Security Systems — INSA',
  description:
    'Advanced cybersecurity solutions by INSA: Gasha Antivirus, WAF, VPN, Nisir, Enyuma IAM, ABIS Biometrics, and Code Protection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.GA_MEASUREMENT_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <PortalShell>{children}</PortalShell>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
