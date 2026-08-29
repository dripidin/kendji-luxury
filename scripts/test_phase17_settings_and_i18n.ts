import {
  getGlobalSettings,
  resolveWilayaFee,
  DEFAULT_GLOBAL_SETTINGS
} from '../src/lib/settings'
import {
  saveStoreIdentityAction,
  saveDeliverySettingsAction,
  saveCourierSettingsAction,
  saveTelegramSettingsAction,
  saveMetaSettingsAction,
  saveLocalizationSettingsAction
} from '../src/app/admin/actions/settings'
import { getDictionary, getDirection, Locale } from '../src/lib/i18n/translations'

async function runTests() {
  console.log('==================================================')
  console.log('PHASE 17: GLOBAL SETTINGS & LOCALIZATION TESTS')
  console.log('==================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`)
      passed++
    } else {
      console.error(`  ✗ FAIL: ${msg}`)
      failed++
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 1: Global Settings Retrieval
  // ----------------------------------------------------
  console.log('[TEST GROUP 1] Global Settings Retrieval')
  const settings = await getGlobalSettings()

  assert(Boolean(settings.identity.brand_name), 'Store brand name exists')
  assert(Boolean(settings.identity.brand_name_ar), 'Store Arabic brand name exists')
  assert(settings.currency.code === 'DZD', 'Currency is DZD')
  assert(settings.delivery.cod_enabled === true, 'COD is enabled by default')
  assert(['DOMICILE', 'STOP_DESK'].includes(settings.delivery.default_delivery_method), 'Valid default delivery method')
  assert(Boolean(settings.courier.active_provider), 'Active courier provider exists')
  assert(Array.isArray(settings.localization.supported_languages), 'Localization languages array is present')

  // ----------------------------------------------------
  // TEST GROUP 2: Secret Masking Security
  // ----------------------------------------------------
  console.log('\n[TEST GROUP 2] Secret Masking Security')
  assert(settings.telegram.bot_token === undefined, 'Telegram bot token is NOT exposed in standard getGlobalSettings()')
  assert(settings.meta.capi_token === undefined, 'Meta CAPI token is NOT exposed in standard getGlobalSettings()')

  // ----------------------------------------------------
  // TEST GROUP 3: Delivery Fee Resolution & Custom Overrides
  // ----------------------------------------------------
  console.log('\n[TEST GROUP 3] Delivery Fee Resolution & Overrides')
  const defaultAlgerDomicile = resolveWilayaFee('16', 'DOMICILE')
  const defaultAlgerStopDesk = resolveWilayaFee('16', 'STOP_DESK')
  assert(typeof defaultAlgerDomicile === 'number' && defaultAlgerDomicile > 0, `Default Alger Domicile fee: ${defaultAlgerDomicile} DA`)
  assert(typeof defaultAlgerStopDesk === 'number' && defaultAlgerStopDesk > 0, `Default Alger Stop Desk fee: ${defaultAlgerStopDesk} DA`)

  // Override test
  const customFees = {
    '16': { domicile: 450, stopDesk: 250 },
    '31': { domicile: 650, stopDesk: 400 }
  }
  const customAlgerDomicile = resolveWilayaFee('16', 'DOMICILE', customFees)
  const customAlgerStopDesk = resolveWilayaFee('16', 'STOP_DESK', customFees)
  assert(customAlgerDomicile === 450, 'Custom fee override applied for Alger Domicile (450 DA)')
  assert(customAlgerStopDesk === 250, 'Custom fee override applied for Alger Stop Desk (250 DA)')

  // Non-overridden wilaya fallback
  const oranDefault = resolveWilayaFee('30', 'DOMICILE', customFees)
  assert(typeof oranDefault === 'number' && oranDefault > 0, `Non-overridden Wilaya falls back cleanly (${oranDefault} DA)`)

  // ----------------------------------------------------
  // TEST GROUP 4: Server Actions & Mutations
  // ----------------------------------------------------
  console.log('\n[TEST GROUP 4] Server Actions & Mutations')

  // Identity save
  const identityRes = await saveStoreIdentityAction({
    brand_name: 'KenDji Luxury Paris-Alger',
    brand_name_ar: 'كندجي للمجوهرات الفاخرة',
    contact_email: 'contact@kendji-luxury.dz',
    contact_phone: '+213 550 12 34 56',
    whatsapp: '+213550123456',
    instagram: 'https://instagram.com/kendji.luxury',
    facebook: 'https://facebook.com/kendji.luxury',
    tiktok: 'https://tiktok.com/@kendji.luxury'
  })
  assert(identityRes.success === true, 'saveStoreIdentityAction succeeded')

  // Delivery settings save with custom overrides
  const deliveryRes = await saveDeliverySettingsAction({
    cod_enabled: true,
    default_delivery_method: 'DOMICILE',
    custom_fees: {
      '16': { domicile: 450, stopDesk: 250 }
    }
  })
  assert(deliveryRes.success === true, 'saveDeliverySettingsAction succeeded with 58-Wilayas overrides')

  // Courier save
  const courierRes = await saveCourierSettingsAction({
    active_provider: 'YALIDINE',
    enabled: true
  })
  assert(courierRes.success === true, 'saveCourierSettingsAction succeeded')

  // Telegram save
  const telegramRes = await saveTelegramSettingsAction({
    enabled: true,
    chat_id: '-1001234567890',
    bot_token: '123456:ABC-TEST-TOKEN',
    events: ['new_order', 'shipment_created', 'delivered']
  })
  assert(telegramRes.success === true, 'saveTelegramSettingsAction succeeded')

  // Meta save
  const metaRes = await saveMetaSettingsAction({
    pixel_id: '9988776655443322',
    capi_enabled: false,
    capi_token: 'EAABtestcapi12345'
  })
  assert(metaRes.success === true, 'saveMetaSettingsAction succeeded')

  // Localization save
  const locRes = await saveLocalizationSettingsAction({
    default_language: 'fr',
    supported_languages: ['fr', 'ar', 'en']
  })
  assert(locRes.success === true, 'saveLocalizationSettingsAction succeeded')

  // Verify updated state
  const updatedSettings = await getGlobalSettings()
  assert(updatedSettings.identity.brand_name === 'KenDji Luxury Paris-Alger', 'DB persisted updated brand name')
  assert(updatedSettings.delivery.custom_fees['16']?.domicile === 450, 'DB persisted custom fee for Wilaya 16')
  assert(updatedSettings.telegram.token_configured === true, 'DB indicates Telegram token is configured without exposing secret')

  // ----------------------------------------------------
  // TEST GROUP 5: Localization & i18n Translations
  // ----------------------------------------------------
  console.log('\n[TEST GROUP 5] Localization & i18n Translations')
  const locales: Locale[] = ['fr', 'ar', 'en']

  for (const loc of locales) {
    const dict = getDictionary(loc)
    const dir = getDirection(loc)

    assert(Boolean(dict.common.brandName), `[${loc}] Brand name translated: ${dict.common.brandName}`)
    assert(Boolean(dict.common.orderNow), `[${loc}] COD CTA translated: ${dict.common.orderNow}`)
    assert(Boolean(dict.checkout.placeOrder), `[${loc}] Checkout button translated`)
    assert(Boolean(dict.trust.paymentOnDelivery), `[${loc}] Trust badge translated`)
    
    if (loc === 'ar') {
      assert(dir === 'rtl', '[ar] Direction is correctly RTL')
    } else {
      assert(dir === 'ltr', `[${loc}] Direction is correctly LTR`)
    }
  }

  // Restore brand name default
  await saveStoreIdentityAction({
    ...DEFAULT_GLOBAL_SETTINGS.identity
  })

  console.log('\n==================================================')
  console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed (Total: ${passed + failed})`)
  console.log('==================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch(err => {
  console.error('Test execution fatal error:', err)
  process.exit(1)
})
