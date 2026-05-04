'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/app/actions/submit-feedback'
import type { SiteSettings } from '@/lib/api'

export function FeedbackSection({ settings }: { settings: SiteSettings }) {
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = settings.feedbackTitle || 'We would like to hear from You!'
  const subtext = settings.feedbackSubtext || 'Please give us your feedback on our products and services'

  const handleSubmit = async () => {
    if (feedback.trim().length < 10) {
      toast.error('Please write at least 10 characters')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await submitFeedback({ feedback })
      if (result.success) {
        toast.success(result.message)
        setFeedback('')
      } else {
        toast.error(result.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6" aria-labelledby="feedback-heading" id="feedback">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_40px_rgba(0,102,102,0.1)]"
        >
          <h2 id="feedback-heading" className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl mb-2">
            {title.includes('You') ? (
              <>We would like to hear from{' '}
                <span className="text-[var(--accent-cyan)]" style={{ textShadow: '0 0 12px rgba(0,102,102,0.4)' }}>
                  You!
                </span>
              </>
            ) : title}
          </h2>
          <p className="text-[var(--text-muted)] mb-8">{subtext}</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or experience..."
              className="flex-1 min-h-[80px] resize-none"
              aria-label="Feedback message"
              disabled={isSubmitting}
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || feedback.trim().length < 10}
              className="sm:self-end gap-2 shrink-0"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-obsidian border-t-transparent"
                />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
