import { createAdminClient } from '@/lib/supabase/admin'
import { getDeliveryFee as getDefaultDeliveryFee } from '@/lib/algeria-cities'

export interface StoreIdentitySettings {
  brand_name: string
  brand_name_ar: string
  contact_email: string
  contact_phone: string
  whatsapp: string
  instagram: string
  facebook: string
  tiktok: string
}

export interface StoreContactSettings {
  customer_service_phone: string
  customer_service_email: string
  business_address: string
}

export interface CodDeliverySettings {
  cod_enabled: boolean
  default_delivery_method: 'DOMICILE' | 'STOP_DESK'
  custom_fees: Record<string, { domicile?: number; stopDesk?: number }>
}

export interface CourierSettings {
  active_provider: 'YALIDINE' | 'ZR_EXPRESS' | 'MAYSTRO' | 'NOEST'
  enabled: boolean
  api_key_configured?: boolean
}

export interface TelegramSettings {
  enabled: boolean
  chat_id: string
  bot_token?: string
  token_configured?: boolean
  events: ('new_order' | 'order_confirmed' | 'shipment_created' | 'delivered' | 'returned')[]
}

export interface MetaSettings {
  pixel_id: string
  capi_enabled: boolean
  capi_token?: string
  token_configured?: boolean
}

export interface LocalizationSettings {
  default_language: 'fr' | 'ar' | 'en'
  supported_languages: ('fr' | 'ar' | 'en')[]
}

export interface GlobalSettings {
  identity: StoreIdentitySettings
  contact: StoreContactSettings
  currency: { code: 'DZD'; symbol: 'DA' }
  delivery: CodDeliverySettings
  courier: CourierSettings
  telegram: TelegramSettings
  meta: MetaSettings
  localization: LocalizationSettings
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  identity: {
    brand_name: 'KenDji Luxury',
    brand_name_ar: 'كندجي للمجوهرات الفاخرة',
    contact_email: 'contact@kendji-luxury.dz',
    contact_phone: '+213 550 12 34 56',
    whatsapp: '+213550123456',
    instagram: 'https://instagram.com/kendji.luxury',
    facebook: 'https://facebook.com/kendji.luxury',
    tiktok: 'https://tiktok.com/@kendji.luxury'
  },
  contact: {
    customer_service_phone: '+213 550 12 34 56',
    customer_service_email: 'contact@kendji-luxury.dz',
    business_address: 'Alger Centre, 16000 Alger, Algérie'
  },
  currency: {
    code: 'DZD',
    symbol: 'DA'
  },
  delivery: {
    cod_enabled: true,
    default_delivery_method: 'DOMICILE',
    custom_fees: {}
  },
  courier: {
    active_provider: 'YALIDINE',
    enabled: true,
    api_key_configured: false
  },
  telegram: {
    enabled: false,
    chat_id: '',
    token_configured: false,
    events: ['new_order', 'shipment_created', 'delivered']
  },
  meta: {
    pixel_id: '',
    capi_enabled: false,
    token_configured: false
  },
  localization: {
    default_language: 'fr',
    supported_languages: ['fr', 'ar', 'en']
  }
}

/**
 * Loads global settings from Supabase with secrets masked for client/admin UI security.
 */
export async function getGlobalSettings(options?: { unmaskSecrets?: boolean }): Promise<GlobalSettings> {
  const { unmaskSecrets = false } = options || {}

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (!error && data) {
      const deliverySettings = data.delivery_settings || {}
      const integrations = data.integrations || {}
      const loc = data.localization || {}

      const telegramToken = integrations.telegram?.bot_token
      const metaToken = integrations.meta?.capi_token

      return {
        identity: {
          brand_name: data.brand_name || DEFAULT_GLOBAL_SETTINGS.identity.brand_name,
          brand_name_ar: data.brand_name_ar || DEFAULT_GLOBAL_SETTINGS.identity.brand_name_ar,
          contact_email: data.contact_email || DEFAULT_GLOBAL_SETTINGS.identity.contact_email,
          contact_phone: data.contact_phone || DEFAULT_GLOBAL_SETTINGS.identity.contact_phone,
          whatsapp: data.whatsapp || DEFAULT_GLOBAL_SETTINGS.identity.whatsapp,
          instagram: data.social_links?.instagram || DEFAULT_GLOBAL_SETTINGS.identity.instagram,
          facebook: data.social_links?.facebook || DEFAULT_GLOBAL_SETTINGS.identity.facebook,
          tiktok: data.social_links?.tiktok || DEFAULT_GLOBAL_SETTINGS.identity.tiktok
        },
        contact: {
          customer_service_phone: data.customer_service_phone || DEFAULT_GLOBAL_SETTINGS.contact.customer_service_phone,
          customer_service_email: data.customer_service_email || DEFAULT_GLOBAL_SETTINGS.contact.customer_service_email,
          business_address: data.business_address || DEFAULT_GLOBAL_SETTINGS.contact.business_address
        },
        currency: {
          code: 'DZD',
          symbol: 'DA'
        },
        delivery: {
          cod_enabled: deliverySettings.cod_enabled ?? true,
          default_delivery_method: deliverySettings.default_method || 'DOMICILE',
          custom_fees: deliverySettings.custom_fees || {}
        },
        courier: {
          active_provider: integrations.courier?.active_provider || 'YALIDINE',
          enabled: integrations.courier?.enabled ?? true,
          api_key_configured: Boolean(integrations.courier?.api_key || process.env.YALIDINE_API_KEY)
        },
        telegram: {
          enabled: integrations.telegram?.enabled ?? false,
          chat_id: integrations.telegram?.chat_id || '',
          bot_token: unmaskSecrets ? telegramToken : undefined,
          token_configured: Boolean(telegramToken || process.env.TELEGRAM_BOT_TOKEN),
          events: integrations.telegram?.events || DEFAULT_GLOBAL_SETTINGS.telegram.events
        },
        meta: {
          pixel_id: integrations.meta?.pixel_id || '',
          capi_enabled: integrations.meta?.capi_enabled ?? false,
          capi_token: unmaskSecrets ? metaToken : undefined,
          token_configured: Boolean(metaToken || process.env.META_CAPI_ACCESS_TOKEN)
        },
        localization: {
          default_language: loc.default_language || 'fr',
          supported_languages: loc.supported_languages || ['fr', 'ar', 'en']
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load global settings from DB, using defaults:', e)
  }

  return DEFAULT_GLOBAL_SETTINGS
}

/**
 * Resolves delivery fee for a specific Wilaya taking custom overrides into account.
 */
export function resolveWilayaFee(
  wilayaCode: string,
  method: 'DOMICILE' | 'STOP_DESK' = 'DOMICILE',
  customFees?: Record<string, { domicile?: number; stopDesk?: number }>
): number {
  const norm = wilayaCode.trim().padStart(2, '0')
  const custom = customFees?.[norm]

  if (custom) {
    if (method === 'DOMICILE' && typeof custom.domicile === 'number' && custom.domicile >= 0) {
      return custom.domicile
    }
    if (method === 'STOP_DESK' && typeof custom.stopDesk === 'number' && custom.stopDesk >= 0) {
      return custom.stopDesk
    }
  }

  return getDefaultDeliveryFee(wilayaCode, method)
}
