'use server'

import type { ProductSlug } from '@/lib/products'
import type { ActionResult } from '@/lib/validations'

type RequestPayload = Record<string, unknown> & { slug: ProductSlug }

const DEFAULTS = {
  website: 'https://example.com',
  officeNo: '000000',
  jobTitle: 'N/A',
  department: 'IT',
}

async function post(url: string, body: unknown) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function submitRequest(data: RequestPayload): Promise<ActionResult> {
  const { slug, ...payload } = data
  const enriched = { ...DEFAULTS, ...payload }

  try {
    if (slug === 'gasha-av') {
      await Promise.allSettled([
        post('https://securitysystems.insa.gov.et/api/api/products/av-request', enriched),
        post('https://gashavpn.insa.gov.et/gashaav.php', enriched),
      ])
    } else if (slug === 'gasha-waf') {
      await Promise.allSettled([
        post('https://securitysystems.insa.gov.et/api/api/products/waf-request', enriched),
        post('https://gashavpn.insa.gov.et/gashawaf.php', enriched),
      ])
    } else if (slug === 'gasha-vpn') {
      await Promise.allSettled([
        post('https://securitysystems.insa.gov.et/api/api/products/vpn-request', enriched),
        post('https://gashavpn.insa.gov.et/gashavpn.php', enriched),
      ])
    } else if (slug === 'abis') {
      await Promise.allSettled([
        post('https://securitysystems.insa.gov.et/api/api/products/abis-request', enriched),
        post('https://gashavpn.insa.gov.et/biom.php', enriched),
      ])
    } else {
      // nisir, enyuma-iam, code-protection
      await post('https://securitysystems.insa.gov.et/api/api/products/av-request', {
        ...enriched,
        product: slug,
      })
    }

    return { success: true, message: 'Request submitted successfully! We will contact you shortly.' }
  } catch {
    return { success: false, error: 'Network error. Please check your connection and try again.' }
  }
}
