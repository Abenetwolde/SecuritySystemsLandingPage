'use server'

import type { FeedbackData, ActionResult } from '@/lib/validations'

export async function submitFeedback(data: FeedbackData): Promise<ActionResult> {
  try {
    const res = await fetch('https://securitysystems.insa.gov.et/api/api/products/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error')
      return { success: false, error: text || 'Failed to send feedback. Please try again.' }
    }

    return { success: true, message: 'Thank you for your feedback!' }
  } catch {
    return { success: false, error: 'Network error. Please check your connection and try again.' }
  }
}
