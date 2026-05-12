/**
 * useAnalytics — safe wrapper around window.umami.track()
 *
 * Returns a `track` function that is a no-op when Umami hasn't loaded yet
 * (e.g. during SSR, ad-blocked, or before the script fires).
 *
 * Usage:
 *   const { track } = useAnalytics()
 *   track('explore_products_click')
 *   track('product_view_more_click', { product: 'gasha-av', product_name: 'Gasha AV' })
 */

'use client'

import { useCallback } from 'react'

type EventProperties = Record<string, string | number | boolean | undefined>

interface UmamiWindow {
  umami?: {
    track: (eventName: string, properties?: EventProperties) => void
  }
}

export function useAnalytics() {
  const track = useCallback((eventName: string, properties?: EventProperties) => {
    try {
      const w = window as UmamiWindow
      if (typeof w !== 'undefined' && w.umami?.track) {
        w.umami.track(eventName, properties)
      }
    } catch {
      // Silently ignore — analytics must never break the UI
    }
  }, [])

  return { track }
}
