/**
 * KenDji Luxury — Telegram Order Notification System
 * Sends rich notifications to private channel/group via Invite Link, Channel Username, or Chat ID
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
 * Normalizes user input (Invite link, Public @channel, or Numeric ID) into a valid Telegram target
 */
export async function normalizeTelegramTarget(
  target: string,
  botToken?: string
): Promise<{ targetId: string; inviteLink?: string }> {
  const trimmed = (target || '').trim()

  // 1. If it's a standard public URL (e.g. https://t.me/kendji_orders)
  const publicUrlMatch = trimmed.match(/^(?:https?:\/\/)?t\.me\/([a-zA-Z0-9_]{4,})$/i)
  if (publicUrlMatch && !publicUrlMatch[1].startsWith('+') && publicUrlMatch[1] !== 'joinchat') {
    return {
      targetId: `@${publicUrlMatch[1]}`,
      inviteLink: `https://t.me/${publicUrlMatch[1]}`
    }
  }

  // 2. If it's a public @username
  if (trimmed.startsWith('@')) {
    return {
      targetId: trimmed,
      inviteLink: `https://t.me/${trimmed.substring(1)}`
    }
  }

  // 3. If it's a numeric Chat ID (e.g. -1001234567890 or 123456789)
  if (/^-?\d+$/.test(trimmed)) {
    return {
      targetId: trimmed
    }
  }

  // 4. If it's a private invite link (https://t.me/+xxxx or https://t.me/joinchat/xxxx)
  if (trimmed.includes('t.me/+') || trimmed.includes('t.me/joinchat/')) {
    // If botToken is provided, attempt to auto-resolve from recent bot updates
    if (botToken) {
      const detected = await autoDetectBotChats(botToken)
      if (detected.success && detected.chats && detected.chats.length > 0) {
        // Pick the most recent channel/group
        const groupOrChannel = detected.chats.find(c => c.type === 'channel' || c.type === 'supergroup' || c.type === 'group')
        if (groupOrChannel) {
          return {
            targetId: String(groupOrChannel.id),
            inviteLink: trimmed
          }
        }
      }
    }

    return {
      targetId: trimmed,
      inviteLink: trimmed
    }
  }

  return {
    targetId: trimmed
  }
}

/**
 * Auto-detects all groups/channels where the bot was recently invited or posted
 */
export async function autoDetectBotChats(botToken: string): Promise<{
  success: boolean
  chats?: { id: string | number; title: string; type: string; username?: string }[]
  error?: string
}> {
  if (!botToken || botToken.trim() === '') {
    return { success: false, error: 'Bot Token manquant.' }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken.trim()}/getUpdates?limit=50&allowed_updates=["message","channel_post","my_chat_member"]`, {
      method: 'GET',
      cache: 'no-store'
    })

    const data = await res.json()
    if (!data.ok) {
      return { success: false, error: data.description || 'Erreur lors de la communication avec Telegram' }
    }

    const chatsMap = new Map<string | number, { id: string | number; title: string; type: string; username?: string }>()

    for (const update of data.result || []) {
      const chat =
        update.message?.chat ||
        update.channel_post?.chat ||
        update.my_chat_member?.chat ||
        update.chat_member?.chat

      if (chat && chat.id) {
        const title = chat.title || chat.username || `${chat.first_name || ''} ${chat.last_name || ''}`.trim() || `Chat #${chat.id}`
        chatsMap.set(chat.id, {
          id: chat.id,
          title,
          type: chat.type || 'group',
          username: chat.username
        })
      }
    }

    const chats = Array.from(chatsMap.values())
    return { success: true, chats }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, error: msg }
  }
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
    const rawTarget = tg.invite_link || tg.chat_id || process.env.TELEGRAM_CHAT_ID

    if (!tg.enabled && !process.env.TELEGRAM_BOT_TOKEN) {
      return { skipped: true, reason: 'TELEGRAM_DISABLED' }
    }

    if (!botToken || !rawTarget) {
      console.warn('[Telegram] Bot token or Target (Chat ID / Invite Link) is missing.')
      return { skipped: true, reason: 'MISSING_CREDENTIALS' }
    }

    // Resolve destination
    const { targetId } = await normalizeTelegramTarget(rawTarget, botToken)

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
        chat_id: targetId,
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
