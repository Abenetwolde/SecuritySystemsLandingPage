'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CommandPalette } from './CommandPalette'
import { FAB } from './FAB'
import { RequestFormModal } from './RequestFormModal'

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onOpenCommandPalette={() => setCmdOpen(true)} />

      <main className="flex-1" id="main-content">
        {children}
      </main>

      <Footer />

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      {/* <FAB onClick={() => setRequestOpen(true)} /> */}
      <RequestFormModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  )
}
