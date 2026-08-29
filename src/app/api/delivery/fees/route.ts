import { NextResponse } from 'next/server'
import { getGlobalSettings } from '@/lib/settings'
import { EcotrackCourierAdapter } from '@/lib/courier/adapters/ecotrack-adapter'
import { ALGERIA_WILAYAS, getDeliveryFee } from '@/lib/algeria-cities'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getGlobalSettings({ unmaskSecrets: true })
    const courier = settings.courier

    let liveFees: Record<string, { domicile: number; stopDesk: number }> | null = null
    let source = 'DEFAULT'

    // 1. If Ecotrack is active, query live API
    if (courier.active_provider === 'ECOTRACK') {
      const token = courier.api_token || courier.api_key || process.env.ECOTRACK_API_KEY || ''
      const baseUrl = courier.base_url || 'https://app.ecotrack.dz'
      const adapter = new EcotrackCourierAdapter({ token, baseUrl })
      liveFees = await adapter.fetchLiveFees()
      if (liveFees && Object.keys(liveFees).length > 0) {
        source = 'ECOTRACK_LIVE_API'
      }
    }

    // 2. Fallback to custom fees or default fees
    const finalFees: Record<string, { domicile: number; stopDesk: number }> = {}

    for (const w of ALGERIA_WILAYAS) {
      const code = w.code.padStart(2, '0')
      if (liveFees && liveFees[code]) {
        finalFees[code] = liveFees[code]
      } else if (settings.delivery?.custom_fees?.[code]) {
        finalFees[code] = {
          domicile: settings.delivery.custom_fees[code].domicile ?? getDeliveryFee(code, 'DOMICILE'),
          stopDesk: settings.delivery.custom_fees[code].stopDesk ?? getDeliveryFee(code, 'STOP_DESK')
        }
      } else {
        finalFees[code] = {
          domicile: getDeliveryFee(code, 'DOMICILE'),
          stopDesk: getDeliveryFee(code, 'STOP_DESK')
        }
      }
    }

    return NextResponse.json({
      success: true,
      source,
      provider: courier.active_provider,
      fees: finalFees
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
