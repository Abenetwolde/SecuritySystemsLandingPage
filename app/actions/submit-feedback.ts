'use server'

import type { FeedbackData, ActionResult } from '@/lib/validations'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:4000'

export async function submitFeedback(data: FeedbackData): Promise<ActionResult> {
  // Try the local backend first; fall back to the production endpoint
  const endpoints = [
    `${API_BASE}/api/products/feedback`,
    'https://securitysystems.insa.gov.et/api/api/products/feedback',
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        return { success: true, message: 'Thank you for your feedback!' }
      }
      // Non-2xx but reachable — don't try next endpoint, return the error
      const text = await res.text().catch(() => '')
      return { success: false, error: text || 'Failed to send feedback. Please try again.' }
    } catch {
      // Network error — try next endpoint
      continue
    }
  }

  return { success: false, error: 'Network error. Please check your connection and try again.' }
}
