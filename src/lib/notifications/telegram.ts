/**
 * KenDji Luxury — Telegram Order Notification System
 * Sends rich notifications to private channel/group when orders or shipments are created
 */

import { getGlobalSettings } from '@/lib/settings'

export interface TelegramOrderPayload {
  orderNumber: string
  customerName: string
  customerPhone: string
  wilaya: string
  commune: string
  address: string
  deliveryMethod: string
  items: { name: string; quantity: number; unitPrice: number }[]
  subtotal: number
  deliveryFee: number
  total: number
}

/**
 * Format and send a Telegram notification for a new Cash on Delivery order
 */
export async function sendTelegramOrderNotification(order: TelegramOrderPayload) {
  try {
    // 1. Get settings with unmasked secrets
    const settings = await getGlobalSettings({ unmaskSecrets: true })
    const tg = settings.telegram

    const botToken = tg.bot_token || process.env.TELEGRAM_BOT_TOKEN
    const chatId = tg.chat_id || process.env.TELEGRAM_CHAT_ID

    if (!tg.enabled && !process.env.TELEGRAM_BOT_TOKEN) {
      return { skipped: true, reason: 'TELEGRAM_DISABLED' }
    }

    if (!botToken || !chatId) {
      console.warn('[Telegram] Bot token or Chat ID is missing.')
      return { skipped: true, reason: 'MISSING_CREDENTIALS' }
    }

    // 2. Format Items list
    const itemsList = order.items
      .map(i => `  • <b>${i.quantity}x</b> ${i.name} — <code>${Number(i.unitPrice * i.quantity).toLocaleString('fr-FR')} DA</code>`)
      .join('\n')

    // 3. Build rich HTML message
    const message = [
      `✨ <b>NOUVELLE COMMANDE — KenDji Luxury</b> ✨`,
      ``,
      `📦 <b>N° Commande :</b> <code>#${order.orderNumber}</code>`,
      `📅 <b>Date :</b> ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Algiers' })}`,
      ``,
      `👤 <b>Client :</b> ${order.customerName}`,
      `📞 <b>Téléphone :</b> <code>${order.customerPhone}</code>`,
      `📍 <b>Destination :</b> ${order.commune}, ${order.wilaya}`,
      `🏠 <b>Adresse :</b> ${order.address}`,
      `🚚 <b>Livraison :</b> ${order.deliveryMethod}`,
      ``,
      `💍 <b>Articles :</b>`,
      itemsList,
      ``,
      `💵 <b>Sous-total :</b> ${Number(order.subtotal).toLocaleString('fr-FR')} DA`,
      `🛵 <b>Frais Livraison :</b> ${Number(order.deliveryFee).toLocaleString('fr-FR')} DA`,
      `💰 <b>TOTAL COD À ENCAISSER :</b> <b>${Number(order.total).toLocaleString('fr-FR')} DA</b>`,
      ``,
      `🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://kendji-luxury.vercel.app'}/admin/orders">Accéder au Panneau d'Administration</a>`
    ].join('\n')

    // 4. Send to Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    })

    const result = await response.json()
    if (!result.ok) {
      console.error('[Telegram] API Error:', result.description)
      return { success: false, error: result.description }
    }

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Telegram] Dispatch exception:', msg)
    return { success: false, error: msg }
  }
}
