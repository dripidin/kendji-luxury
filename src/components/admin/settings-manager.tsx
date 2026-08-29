'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  GlobalSettings,
  StoreIdentitySettings,
  StoreContactSettings,
  CodDeliverySettings,
  CourierSettings,
  TelegramSettings,
  MetaSettings,
  LocalizationSettings
} from '@/lib/settings'
import {
  saveStoreIdentityAction,
  saveStoreContactAction,
  saveDeliverySettingsAction,
  saveCourierSettingsAction,
  saveTelegramSettingsAction,
  saveMetaSettingsAction,
  saveLocalizationSettingsAction,
  saveAllSettingsAction,
  testCourierConnectionAction,
  testTelegramNotificationAction,
  testMetaPixelAction,
  detectTelegramChatsAction,
  syncEcotrackLiveFeesAction
} from '@/app/admin/actions/settings'
import { ALGERIA_WILAYAS } from '@/lib/algeria-cities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Check,
  Loader2,
  Search,
  RotateCcw,
  ShieldCheck,
  Send,
  BarChart3,
  Languages,
  Truck,
  Building,
  CreditCard,
  Zap,
  ExternalLink,
  Radio,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

interface SettingsManagerProps {
  initialSettings: GlobalSettings
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    'identity' | 'contact' | 'delivery' | 'courier' | 'telegram' | 'meta' | 'localization'
  >('identity')

  // Form states per section
  const [identity, setIdentity] = useState<StoreIdentitySettings>(initialSettings.identity)
  const [contact, setContact] = useState<StoreContactSettings>(initialSettings.contact)
  const [delivery, setDelivery] = useState<CodDeliverySettings>(initialSettings.delivery)
  const [courier, setCourier] = useState<CourierSettings>(initialSettings.courier)
  const [telegram, setTelegram] = useState<TelegramSettings>(initialSettings.telegram)
  const [meta, setMeta] = useState<MetaSettings>(initialSettings.meta)
  const [localization, setLocalization] = useState<LocalizationSettings>(initialSettings.localization)

  useEffect(() => {
    setIdentity(initialSettings.identity)
    setContact(initialSettings.contact)
    setDelivery(initialSettings.delivery)
    setCourier(initialSettings.courier)
    setTelegram(initialSettings.telegram)
    setMeta(initialSettings.meta)
    setLocalization(initialSettings.localization)
  }, [initialSettings])

  // Status & Test states
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [isTestingCourier, setIsTestingCourier] = useState(false)
  const [isTestingTelegram, setIsTestingTelegram] = useState(false)
  const [isDetectingTelegram, setIsDetectingTelegram] = useState(false)
  const [detectedChats, setDetectedChats] = useState<{ id: string | number; title: string; type: string; username?: string }[]>([])
  const [isTestingMeta, setIsTestingMeta] = useState(false)
  const [isSyncingEcotrackFees, setIsSyncingEcotrackFees] = useState(false)
  const [courierTestResult, setCourierTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showCourierToken, setShowCourierToken] = useState(false)
  const [showTelegramToken, setShowTelegramToken] = useState(false)
  const [showMetaToken, setShowMetaToken] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [wilayaSearch, setWilayaSearch] = useState('')

  const showFeedback = (success: boolean, msg?: string) => {
    if (success) {
      setSuccessMsg(msg || 'Modifications enregistrées avec succès.')
      setErrorMsg(null)
      router.refresh()
      setTimeout(() => setSuccessMsg(null), 3500)
    } else {
      setErrorMsg(msg || "Une erreur est survenue lors de l'enregistrement.")
      setSuccessMsg(null)
    }
  }

  // Save All Settings at once
  const handleSaveAll = async () => {
    setIsSavingAll(true)
    const res = await saveAllSettingsAction({
      identity,
      contact,
      delivery,
      courier,
      telegram,
      meta,
      localization
    })
    setIsSavingAll(false)
    showFeedback(res.success, res.success ? 'Tous les paramètres ont été enregistrés avec succès !' : res.error)
  }

  // Filtered Wilayas for Delivery tab
  const filteredWilayas = ALGERIA_WILAYAS.filter(w => {
    const q = wilayaSearch.toLowerCase().trim()
    return (
      w.code.includes(q) ||
      w.name.toLowerCase().includes(q) ||
      (w.nameAr && w.nameAr.includes(q))
    )
  })

  // Handlers for individual section saves
  const handleSaveIdentity = async () => {
    setIsSaving(true)
    const res = await saveStoreIdentityAction(identity)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleSaveContact = async () => {
    setIsSaving(true)
    const res = await saveStoreContactAction(contact)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleSaveDelivery = async () => {
    setIsSaving(true)
    const res = await saveDeliverySettingsAction(delivery)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleSyncEcotrackFees = async () => {
    setIsSyncingEcotrackFees(true)
    const res = await syncEcotrackLiveFeesAction()
    setIsSyncingEcotrackFees(false)
    if (res.success && res.fees) {
      setDelivery(prev => ({
        ...prev,
        custom_fees: res.fees
      }))
      showFeedback(true, res.message)
    } else {
      showFeedback(false, res.error)
    }
  }

  const handleSaveCourier = async () => {
    setIsSaving(true)
    const res = await saveCourierSettingsAction(courier)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleSaveTelegram = async () => {
    setIsSaving(true)
    const res = await saveTelegramSettingsAction(telegram)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleSaveMeta = async () => {
    setIsSaving(true)
    const res = await saveMetaSettingsAction(meta)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleSaveLocalization = async () => {
    setIsSaving(true)
    const res = await saveLocalizationSettingsAction(localization)
    setIsSaving(false)
    showFeedback(res.success, res.error)
  }

  const handleTestCourier = async () => {
    setIsTestingCourier(true)
    setCourierTestResult(null)
    const res = await testCourierConnectionAction(courier.active_provider, {
      apiId: courier.api_id,
      apiToken: courier.api_token,
      apiKey: courier.api_key,
      baseUrl: courier.base_url
    })
    setIsTestingCourier(false)
    setCourierTestResult({
      success: res.success,
      message: res.success ? res.message || 'Connectivité validée' : res.error || 'Échec de connexion'
    })
  }

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true)
    setTelegramTestResult(null)
    const target = telegram.invite_link || telegram.chat_id
    const res = await testTelegramNotificationAction(telegram.bot_token, target)
    setIsTestingTelegram(false)
    setTelegramTestResult({
      success: res.success,
      message: res.success ? res.message || 'Notification envoyée avec succès' : res.error || 'Erreur Telegram'
    })
  }

  const handleDetectTelegram = async () => {
    setIsDetectingTelegram(true)
    setDetectedChats([])
    const res = await detectTelegramChatsAction(telegram.bot_token)
    setIsDetectingTelegram(false)
    if (res.success && res.chats && res.chats.length > 0) {
      setDetectedChats(res.chats)
    } else {
      setTelegramTestResult({
        success: false,
        message: res.error || 'Aucun canal détecté. Assurez-vous que le bot est admin dans votre canal.'
      })
    }
  }

  const handleTestMeta = async () => {
    setIsTestingMeta(true)
    setMetaTestResult(null)
    const res = await testMetaPixelAction(meta.pixel_id, meta.capi_token)
    setIsTestingMeta(false)
    setMetaTestResult({
      success: res.success,
      message: res.success ? res.message || 'Meta CAPI validé' : res.error || 'Erreur Meta'
    })
  }

  const updateWilayaFee = (code: string, method: 'domicile' | 'stopDesk', value: number) => {
    const nextFees = { ...delivery.custom_fees }
    const current = nextFees[code] || {}
    nextFees[code] = {
      ...current,
      [method]: isNaN(value) ? undefined : Math.max(0, value)
    }
    setDelivery({ ...delivery, custom_fees: nextFees })
  }

  const resetWilayaFee = (code: string) => {
    const nextFees = { ...delivery.custom_fees }
    delete nextFees[code]
    setDelivery({ ...delivery, custom_fees: nextFees })
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium block">
            KenDji Luxury &bull; Système &amp; Configuration
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mt-1">
            Paramètres Généraux &amp; Intégrations
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Centralisez la gestion de l&apos;identité, des frais de livraison 58 Wilayas, transporteurs, alertes Telegram et Meta.
          </p>
        </div>

        {/* Global Action & Feedback notification */}
        <div className="flex flex-wrap items-center gap-3">
          {successMsg && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-md flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> {successMsg}
            </span>
          )}
          {errorMsg && (
            <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-md">
              {errorMsg}
            </span>
          )}
          <Button
            onClick={handleSaveAll}
            disabled={isSavingAll}
            className="bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-wider px-5 py-2 flex items-center gap-2 shadow-sm font-medium"
          >
            {isSavingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Enregistrer Tout</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-2 rounded-t-lg overflow-x-auto scrollbar-none">
        {[
          { id: 'identity', label: '1. Identité & Réseaux', icon: Building },
          { id: 'contact', label: '2. Contact & SAV', icon: ShieldCheck },
          { id: 'delivery', label: '3. Tarifs 58 Wilayas', icon: Truck },
          { id: 'courier', label: '4. Transporteurs & APIs', icon: CreditCard },
          { id: 'telegram', label: '5. Alertes Telegram', icon: Send },
          { id: 'meta', label: '6. Meta Pixel & CAPI', icon: BarChart3 },
          { id: 'localization', label: '7. Langues & RTL', icon: Languages }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-4 sm:px-6 text-xs uppercase tracking-wider font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Store Identity */}
      {activeTab === 'identity' && (
        <Card>
          <CardHeader>
            <CardTitle>Identité &amp; Réseaux Sociaux</CardTitle>
            <CardDescription>Nom de marque officiel et canaux de présence digitale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Nom de Marque (Français/Latin)</Label>
                <Input
                  id="brand-name"
                  value={identity.brand_name}
                  onChange={e => setIdentity({ ...identity, brand_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand-name-ar">Nom de Marque (Arabe)</Label>
                <Input
                  id="brand-name-ar"
                  dir="rtl"
                  value={identity.brand_name_ar}
                  onChange={e => setIdentity({ ...identity, brand_name_ar: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="ident-phone">Téléphone Général</Label>
                <Input
                  id="ident-phone"
                  value={identity.contact_phone}
                  onChange={e => setIdentity({ ...identity, contact_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ident-email">Email Contact</Label>
                <Input
                  id="ident-email"
                  value={identity.contact_email}
                  onChange={e => setIdentity({ ...identity, contact_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ident-wa">Numéro WhatsApp (Format: +213...)</Label>
                <Input
                  id="ident-wa"
                  placeholder="+213550000000"
                  value={identity.whatsapp}
                  onChange={e => setIdentity({ ...identity, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Liens Réseaux Sociaux
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ident-insta">Instagram (URL ou @handle)</Label>
                  <Input
                    id="ident-insta"
                    placeholder="https://instagram.com/kendji_luxury"
                    value={identity.instagram}
                    onChange={e => setIdentity({ ...identity, instagram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ident-fb">Facebook</Label>
                  <Input
                    id="ident-fb"
                    placeholder="https://facebook.com/kendji.luxury"
                    value={identity.facebook}
                    onChange={e => setIdentity({ ...identity, facebook: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ident-tiktok">TikTok</Label>
                  <Input
                    id="ident-tiktok"
                    placeholder="https://tiktok.com/@kendjiluxury"
                    value={identity.tiktok}
                    onChange={e => setIdentity({ ...identity, tiktok: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSaveIdentity}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Enregistrer la Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Contact & Service Client */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Coordonnées &amp; Service Client</CardTitle>
            <CardDescription>Informations affichées aux clients pour le suivi et l&apos;assistance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cs-phone">Ligne Directe SAV</Label>
                <Input
                  id="cs-phone"
                  value={contact.customer_service_phone}
                  onChange={e => setContact({ ...contact, customer_service_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-email">Email Assistance Clients</Label>
                <Input
                  id="cs-email"
                  value={contact.customer_service_email}
                  onChange={e => setContact({ ...contact, customer_service_email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="cs-address">Adresse du Siège / Atelier à Alger</Label>
              <Input
                id="cs-address"
                value={contact.business_address}
                onChange={e => setContact({ ...contact, business_address: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSaveContact}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Enregistrer le Contact'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Delivery Fees by Wilaya */}
      {activeTab === 'delivery' && (
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Frais de Livraison (58 Wilayas)</CardTitle>
            <CardDescription>
              Modifiez les tarifs à Domicile et en Point Relais (Stop Desk) par Wilaya en dinars algériens (DA).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Live API Info Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950">
              <div className="flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Tarification Directe API Ecotrack (GET /api/v1/get/fees)</p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    Le site et le checkout interrogent directement les tarifs officiels de votre compte transporteur en temps réel.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSyncEcotrackFees}
                disabled={isSyncingEcotrackFees}
                className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 flex-shrink-0 h-8 font-medium shadow-sm"
              >
                {isSyncingEcotrackFees ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                )}
                Actualiser depuis l&apos;API Ecotrack
              </Button>
            </div>

            {/* Global Delivery Settings toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delivery.cod_enabled}
                    onChange={e => setDelivery({ ...delivery, cod_enabled: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-xs font-semibold text-gray-900">Activer le Paiement à la Livraison (COD)</span>
                </label>

                <div className="flex items-center gap-2">
                  <Label htmlFor="def-method" className="text-xs text-gray-700">
                    Mode par défaut :
                  </Label>
                  <select
                    id="def-method"
                    value={delivery.default_delivery_method}
                    onChange={e =>
                      setDelivery({
                        ...delivery,
                        default_delivery_method: e.target.value as 'DOMICILE' | 'STOP_DESK'
                      })
                    }
                    className="h-8 px-2 rounded border bg-white text-xs"
                  >
                    <option value="DOMICILE">Domicile</option>
                    <option value="STOP_DESK">Point Relais (Stop Desk)</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleSaveDelivery}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Sauvegarder les Tarifs'}
              </Button>
            </div>

            {/* Wilaya Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une Wilaya par nom ou code (ex: Alger, 16, Oran, 31)..."
                value={wilayaSearch}
                onChange={e => setWilayaSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 58 Wilayas Table */}
            <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-gray-700">Code</th>
                    <th className="p-3 font-semibold text-gray-700">Wilaya</th>
                    <th className="p-3 font-semibold text-gray-700">Tarif Domicile (DA)</th>
                    <th className="p-3 font-semibold text-gray-700">Tarif Stop Desk (DA)</th>
                    <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredWilayas.map(w => {
                    const custom = delivery.custom_fees[w.code]
                    const isCustomized = Boolean(custom && (custom.domicile !== undefined || custom.stopDesk !== undefined))
                    const domicileVal = custom?.domicile !== undefined ? custom.domicile : w.deliveryFeeDomicile
                    const stopDeskVal = custom?.stopDesk !== undefined ? custom.stopDesk : w.deliveryFeeStopDesk

                    return (
                      <tr key={w.code} className="hover:bg-gray-50/80">
                        <td className="p-3 font-mono font-bold text-gray-900">{w.code}</td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-900">{w.name}</span>{' '}
                          {w.nameAr && <span className="text-gray-400 font-sans">({w.nameAr})</span>}
                          {isCustomized && (
                            <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                              Personnalisé
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              step="50"
                              value={domicileVal}
                              onChange={e => updateWilayaFee(w.code, 'domicile', parseInt(e.target.value))}
                              className="w-24 h-8 text-xs font-mono"
                            />
                            <span className="text-gray-400 font-mono">DA</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              step="50"
                              value={stopDeskVal}
                              onChange={e => updateWilayaFee(w.code, 'stopDesk', parseInt(e.target.value))}
                              className="w-24 h-8 text-xs font-mono"
                            />
                            <span className="text-gray-400 font-mono">DA</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          {isCustomized ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resetWilayaFee(w.code)}
                              className="h-7 px-2 text-[11px] text-gray-500 hover:text-red-600"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Défaut
                            </Button>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">Tarif de base</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Courier Integrations */}
      {activeTab === 'courier' && (
        <Card>
          <CardHeader>
            <CardTitle>Intégrations Transporteurs &amp; Logistique (Algérie)</CardTitle>
            <CardDescription>
              Connectez directement votre compte transporteur pour l&apos;édition automatique des bordereaux et le suivi COD.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courier-prov">Prestataire Logistique Actif</Label>
                <select
                  id="courier-prov"
                  value={courier.active_provider}
                  onChange={e =>
                    setCourier({
                      ...courier,
                      active_provider: e.target.value as 'YALIDINE' | 'ECOTRACK' | 'ZR_EXPRESS' | 'MAYSTRO' | 'NOEST'
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                  <option value="YALIDINE">Yalidine Express (Yalitec / Guepex)</option>
                  <option value="ECOTRACK">Ecotrack DZ (Redex / Conexlog / World Express)</option>
                  <option value="ZR_EXPRESS">ZR Express (Procolis)</option>
                  <option value="MAYSTRO">Maystro Delivery</option>
                  <option value="NOEST">Noest Express</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courier-wilaya">Wilaya d&apos;Expédition (Origine)</Label>
                <select
                  id="courier-wilaya"
                  value={courier.origin_wilaya || 16}
                  onChange={e => setCourier({ ...courier, origin_wilaya: parseInt(e.target.value) || 16 })}
                  className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                  {ALGERIA_WILAYAS.map(w => (
                    <option key={w.code} value={parseInt(w.code)}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* API Credentials inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              {courier.active_provider === 'ECOTRACK' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="courier-base-url">URL de votre Plateforme Ecotrack (Tenant URL)</Label>
                    <Input
                      id="courier-base-url"
                      placeholder="https://app.ecotrack.dz ou https://redex.ecotrack.dz"
                      value={courier.base_url || ''}
                      onChange={e => setCourier({ ...courier, base_url: e.target.value })}
                    />
                    <p className="text-[11px] text-gray-500">
                      L&apos;URL de votre espace client Ecotrack (ex: <code>https://app.ecotrack.dz</code>, <code>https://redex.ecotrack.dz</code>, <code>https://platform.dhd-dz.com</code>).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courier-token">
                      Token API Ecotrack (Bearer Token)
                      {courier.api_key_configured && <span className="text-emerald-600 text-xs ml-1.5">(Enregistré)</span>}
                    </Label>
                    <div className="relative">
                      <Input
                        id="courier-token"
                        type={showCourierToken ? 'text' : 'password'}
                        placeholder={courier.api_key_configured ? '••••••••••••••••••••••••••••' : 'Collez votre Token API Ecotrack...'}
                        value={courier.api_token || courier.api_key || ''}
                        onChange={e => setCourier({ ...courier, api_token: e.target.value, api_key: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCourierToken(!showCourierToken)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        title={showCourierToken ? "Masquer le token" : "Afficher le token"}
                      >
                        {showCourierToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Généré dans votre espace Ecotrack &gt; Paramètres &gt; API Public.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="courier-id">
                      {courier.active_provider === 'YALIDINE' ? 'API ID / X-User-Id' : 'Identifiant Compte / User'}
                    </Label>
                    <Input
                      id="courier-id"
                      placeholder="Ex: 12345678"
                      value={courier.api_id || ''}
                      onChange={e => setCourier({ ...courier, api_id: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courier-token">
                      {courier.active_provider === 'YALIDINE' ? 'API Token / X-User-Token' : 'Clé API / Token'}
                      {courier.api_key_configured && <span className="text-emerald-600 text-xs ml-1.5">(Enregistré)</span>}
                    </Label>
                    <div className="relative">
                      <Input
                        id="courier-token"
                        type={showCourierToken ? 'text' : 'password'}
                        placeholder={courier.api_key_configured ? '••••••••••••••••••••••••••••' : 'Saisir la clé / token API...'}
                        value={courier.api_token || courier.api_key || ''}
                        onChange={e => setCourier({ ...courier, api_token: e.target.value, api_key: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCourierToken(!showCourierToken)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        title={showCourierToken ? "Masquer la clé" : "Afficher la clé"}
                      >
                        {showCourierToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Laissez vide pour conserver les clés sécurisées actuellement enregistrées.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border text-xs text-gray-600 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Passerelle DZShip &amp; Sécurité Serveur :</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Connecté via la passerelle normalisée <code>freeship.dzbuild.com</code>. Prise en charge officielle des 58 Wilayas et bordereaux A6/A4.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={courier.enabled}
                    onChange={e => setCourier({ ...courier, enabled: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  <span className="font-semibold text-gray-900">Activer</span>
                </label>
              </div>

              {/* Test courier connection button */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestCourier}
                  disabled={isTestingCourier}
                  className="text-xs bg-white border-gray-300"
                >
                  {isTestingCourier ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-600" />}
                  Tester la connexion API ({courier.active_provider})
                </Button>
                {courierTestResult && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded font-medium ${
                      courierTestResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {courierTestResult.message}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSaveCourier}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Enregistrer le Transporteur'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Telegram Alerts */}
      {activeTab === 'telegram' && (
        <Card>
          <CardHeader>
            <CardTitle>Notifications de Commandes par Bot Telegram</CardTitle>
            <CardDescription>
              Recevez instantanément les alertes détaillées de chaque nouvelle commande COD passée sur votre boutique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegram.enabled}
                  onChange={e => setTelegram({ ...telegram, enabled: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                <span>Activer les Notifications Telegram</span>
              </label>

              {telegram.bot_link && (
                <a
                  href={telegram.bot_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Ouvrir le Bot Telegram <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="tele-token">
                  Token du Bot Telegram {telegram.token_configured && <span className="text-emerald-600 text-xs">(Configuré)</span>}
                </Label>
                <Input
                  id="tele-token"
                  type="password"
                  placeholder={telegram.token_configured ? '••••••••••••••••••••••••••••' : '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'}
                  value={telegram.bot_token || ''}
                  onChange={e => setTelegram({ ...telegram, bot_token: e.target.value })}
                />
                <p className="text-[11px] text-gray-500">
                  Créé via @BotFather sur Telegram.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tele-invite-link">
                  Lien d&apos;Invitation / Lien Canal / Chat ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tele-invite-link"
                    placeholder="https://t.me/+xxxx, https://t.me/canal, @canal ou -1001234..."
                    value={telegram.invite_link || telegram.chat_id || ''}
                    onChange={e => setTelegram({ ...telegram, invite_link: e.target.value, chat_id: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDetectTelegram}
                    disabled={isDetectingTelegram || !telegram.bot_token}
                    className="text-xs bg-white border-gray-300 flex-shrink-0 whitespace-nowrap"
                    title="Détecte automatiquement les canaux/groupes où le bot est admin"
                  >
                    {isDetectingTelegram
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Radio className="h-3.5 w-3.5 text-blue-500" />
                    }
                    <span className="ml-1.5 hidden sm:inline">Auto-détecter</span>
                  </Button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Accepte un lien d&apos;invitation privé <code>t.me/+…</code>, URL public <code>t.me/channel</code>, <code>@username</code> ou ID numérique. Cliquez <b>Auto-détecter</b> pour trouver automatiquement les canaux où le bot est présent.
                </p>

                {/* Detected chats picker */}
                {detectedChats.length > 0 && (
                  <div className="mt-2 border rounded-md overflow-hidden bg-white">
                    <p className="text-[11px] font-semibold text-gray-700 px-3 py-2 bg-gray-50 border-b">
                      Canaux / Groupes détectés — cliquez pour sélectionner :
                    </p>
                    <ul className="divide-y max-h-40 overflow-y-auto">
                      {detectedChats.map(chat => (
                        <li key={String(chat.id)}>
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between gap-2"
                            onClick={() => {
                              const val = String(chat.id)
                              setTelegram({ ...telegram, invite_link: val, chat_id: val })
                              setDetectedChats([])
                            }}
                          >
                            <span className="font-medium text-gray-900">{chat.title}</span>
                            <span className="text-gray-400 font-mono">{String(chat.id)}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{chat.type}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="tele-link">Lien Direct vers le Bot (Optionnel)</Label>
              <Input
                id="tele-link"
                placeholder="https://t.me/KendjiLuxuryBot"
                value={telegram.bot_link || ''}
                onChange={e => setTelegram({ ...telegram, bot_link: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label className="text-xs font-semibold uppercase text-gray-700">Événements Déclencheurs</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'new_order', label: 'Nouvelle Commande COD' },
                  { id: 'shipment_created', label: 'Bordereau Transporteur Généré' },
                  { id: 'delivered', label: 'Colis Livré & Encaissé' }
                ].map(evt => (
                  <label key={evt.id} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={telegram.events.includes(evt.id as 'new_order' | 'shipment_created' | 'delivered')}
                      onChange={e => {
                        const next = e.target.checked
                          ? [...telegram.events, evt.id as 'new_order' | 'shipment_created' | 'delivered']
                          : telegram.events.filter(x => x !== evt.id)
                        setTelegram({ ...telegram, events: next })
                      }}
                      className="h-4 w-4 rounded"
                    />
                    <span className="font-medium text-gray-900">{evt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dry-run telegram notification button */}
            <div className="p-4 bg-gray-50 rounded-lg border text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">Tester l&apos;envoi instantané :</p>
                <p className="text-gray-500 text-[11px] mt-0.5">Envoie une alerte test sur votre canal Telegram avec accusé de réception.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestTelegram}
                disabled={isTestingTelegram || (!telegram.invite_link && !telegram.chat_id && !telegram.token_configured)}
                className="text-xs bg-white border-gray-300 flex-shrink-0"
              >
                {isTestingTelegram ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Send className="h-3.5 w-3.5 mr-1.5 text-blue-600" />}
                Envoyer un message test
              </Button>
            </div>

            {telegramTestResult && (
              <div
                className={`p-3 rounded-md text-xs ${
                  telegramTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {telegramTestResult.message}
              </div>
            )}

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSaveTelegram}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Enregistrer Telegram'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 6: Meta Pixel & CAPI */}
      {activeTab === 'meta' && (
        <Card>
          <CardHeader>
            <CardTitle>Meta Pixel &amp; Conversions API (CAPI)</CardTitle>
            <CardDescription>
              Configurez le tracking publicitaire Meta pour mesurer les événements d&apos;achats et conversions avec déduplication côté serveur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="meta-pixel">Meta Pixel ID (Public)</Label>
                <Input
                  id="meta-pixel"
                  placeholder="Ex: 1617383883230571"
                  value={meta.pixel_id}
                  onChange={e => setMeta({ ...meta, pixel_id: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-test-code">Code de Test d&apos;Événement (Optionnel)</Label>
                <Input
                  id="meta-test-code"
                  placeholder="Ex: TEST12345 (depuis Events Manager)"
                  value={meta.test_event_code || ''}
                  onChange={e => setMeta({ ...meta, test_event_code: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={meta.capi_enabled}
                  onChange={e => setMeta({ ...meta, capi_enabled: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                <span>Activer l&apos;API de Conversions côté Serveur (Conversions API)</span>
              </label>

              <div className="space-y-2">
                <Label htmlFor="meta-capi-token">
                  Jeton d&apos;Accès CAPI (Server-Only Access Token){' '}
                  {meta.token_configured && <span className="text-emerald-600 text-xs">(Configuré)</span>}
                </Label>
                <Input
                  id="meta-capi-token"
                  type="password"
                  placeholder={meta.token_configured ? '••••••••••••••••••••••••••••' : 'EAAB...'}
                  value={meta.capi_token || ''}
                  onChange={e => setMeta({ ...meta, capi_token: e.target.value })}
                />
                <p className="text-[11px] text-gray-500">
                  Le jeton CAPI effectue le hachage sécurisé SHA-256 des données clients et garantit le tracking même avec les bloqueurs de publicité.
                </p>
              </div>

              {/* Test Meta CAPI button */}
              <div className="p-4 bg-gray-50 rounded-lg border text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">Tester la validation Meta Graph API :</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Vérifie l&apos;accès au Pixel et au jeton Conversions API.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestMeta}
                  disabled={isTestingMeta || !meta.pixel_id}
                  className="text-xs bg-white border-gray-300 flex-shrink-0"
                >
                  {isTestingMeta ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />}
                  Tester le Pixel &amp; CAPI
                </Button>
              </div>

              {metaTestResult && (
                <div
                  className={`p-3 rounded-md text-xs ${
                    metaTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {metaTestResult.message}
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSaveMeta}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Enregistrer Meta'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 7: Localization & Languages */}
      {activeTab === 'localization' && (
        <Card>
          <CardHeader>
            <CardTitle>Localisation, Langues &amp; Support RTL</CardTitle>
            <CardDescription>
              Gérez les langues de la boutique en ligne avec basculement automatique de direction (LTR / RTL).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loc-default">Langue Principale par Défaut</Label>
                <select
                  id="loc-default"
                  value={localization.default_language}
                  onChange={e =>
                    setLocalization({
                      ...localization,
                      default_language: e.target.value as 'fr' | 'ar' | 'en'
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border text-sm"
                >
                  <option value="fr">Français (FR - LTR)</option>
                  <option value="ar">العربية (AR - RTL)</option>
                  <option value="en">English (EN - LTR)</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="block text-xs font-semibold uppercase text-gray-700">Langues Activées</Label>
                <div className="space-y-2">
                  {[
                    { id: 'fr', label: 'Français (FR)', dir: 'LTR' },
                    { id: 'ar', label: 'العربية (AR)', dir: 'RTL' },
                    { id: 'en', label: 'English (EN)', dir: 'LTR' }
                  ].map(lang => (
                    <label key={lang.id} className="flex items-center justify-between p-3 border rounded bg-gray-50 text-xs cursor-pointer">
                      <span className="font-semibold text-gray-900">{lang.label}</span>
                      <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border uppercase">{lang.dir}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={handleSaveLocalization}
                disabled={isSaving}
                className="bg-gray-900 hover:bg-black text-white text-xs uppercase tracking-wider"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : 'Enregistrer la Localisation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
