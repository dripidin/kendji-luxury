/**
 * KenDji Luxury — Meta Conversions API (CAPI) Client
 * Server-side Purchase Event Tracking with exact browser Pixel deduplication
 */

import crypto from 'crypto'
import { getGlobalSettings } from '@/lib/settings'

const GRAPH_API_VERSION = 'v19.0'

function sha256(val: string | null | undefined): string | null {
  if (!val) return null
  const clean = String(val).trim().toLowerCase()
  if (!clean) return null
  return crypto.createHash('sha256').update(clean).digest('hex')
}

/**
 * Normalize and hash Algerian phone number according to Meta guidelines.
 * Expected Meta format: Country code + Number without leading 0 or symbols (e.g. 213555123456).
 */
function hashPhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  let digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '213' + digits.substring(1)
  } else if (!digits.startsWith('213') && digits.length === 9) {
    digits = '213' + digits
  }
  return sha256(digits)
}

function hashNames(fullName: string | null | undefined): { fn: string | null; ln: string | null } {
  if (!fullName) return { fn: null, ln: null }
  const parts = String(fullName).trim().split(/\s+/)
  const fn = parts[0] ? sha256(parts[0]) : null
  const ln = parts.length > 1 ? sha256(parts.slice(1).join(' ')) : null
  return { fn, ln }
}

export interface MetaPurchaseEventParams {
  eventId: string
  orderNumber: string
  value: number
  currency?: string
  fullName: string
  phone: string
  wilaya?: string
  commune?: string
  clientIp?: string
  userAgent?: string
  eventSourceUrl?: string
  fbp?: string
  fbc?: string
  items?: { name: string; quantity: number; unitPrice: number }[]
}

/**
 * Send Purchase event to Meta Conversions API
 */
export async function sendMetaPurchaseEvent(params: MetaPurchaseEventParams) {
  try {
    const settings = await getGlobalSettings({ unmaskSecrets: true })
    const meta = settings.meta

    const pixelId = meta.pixel_id || process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID
    const accessToken = meta.capi_token || process.env.META_ACCESS_TOKEN

    if (!meta.capi_enabled && !process.env.META_ACCESS_TOKEN) {
      return { skipped: true, reason: 'CAPI_DISABLED' }
    }

    if (!pixelId || !accessToken) {
      console.warn('[Meta CAPI] Missing Pixel ID or Access Token.')
      return { skipped: true, reason: 'MISSING_CREDENTIALS' }
    }

    const { fn, ln } = hashNames(params.fullName)
    const hashedPhone = hashPhone(params.phone)
    const hashedWilaya = params.wilaya ? sha256(params.wilaya) : null
    const hashedCommune = params.commune ? sha256(params.commune) : null

    const userData: Record<string, unknown> = {
      client_ip_address: params.clientIp || undefined,
      client_user_agent: params.userAgent || undefined,
      country: [sha256('dz')]
    }

    if (hashedPhone) userData.ph = [hashedPhone]
    if (fn) userData.fn = [fn]
    if (ln) userData.ln = [ln]
    if (hashedWilaya) userData.st = [hashedWilaya]
    if (hashedCommune) userData.ct = [hashedCommune]
    if (params.fbp) userData.fbp = params.fbp
    if (params.fbc) userData.fbc = params.fbc

    const customData = {
      currency: params.currency || 'DZD',
      value: Number(params.value),
      order_id: params.orderNumber,
      content_type: 'product',
      contents: params.items?.map(i => ({
        id: i.name,
        quantity: i.quantity,
        item_price: i.unitPrice
      })) || []
    }

    const eventPayload = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: params.eventId,
      event_source_url: params.eventSourceUrl || 'https://kendji-luxury.vercel.app/checkout',
      action_source: 'website',
      user_data: userData,
      custom_data: customData
    }

    const apiUrl = `https://graph.facebook.net/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [eventPayload] })
    })

    const result = await response.json()
    if (result.error) {
      console.error('[Meta CAPI] Error:', result.error.message)
      return { success: false, error: result.error.message }
    }

    return { success: true, fbtrace_id: result.fbtrace_id, events_received: result.events_received }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Meta CAPI] Dispatch exception:', msg)
    return { success: false, error: msg }
  }
}
