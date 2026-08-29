'use client'

import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/storefront/layout/container"
import { useI18n } from "@/lib/i18n/context"
import { GlobalSettings } from "@/lib/settings"
import { Phone, Mail, MapPin } from "lucide-react"

interface StorefrontFooterProps {
  settings?: GlobalSettings
}

function normalizeSocialUrl(platform: 'instagram' | 'tiktok' | 'facebook', value?: string): string | null {
  if (!value || typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed === '#' || trimmed === '/shop#' || trimmed === '/shop') return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  const cleanHandle = trimmed.replace(/^@+/, '')
  if (!cleanHandle) return null

  switch (platform) {
    case 'instagram':
      return `https://www.instagram.com/${cleanHandle}/`
    case 'tiktok':
      return `https://www.tiktok.com/@${cleanHandle}`
    case 'facebook':
      return `https://www.facebook.com/${cleanHandle}`
    default:
      return null
  }
}

function normalizeWhatsAppUrl(whatsapp?: string): string | null {
  if (!whatsapp || typeof whatsapp !== 'string') return null
  const trimmed = whatsapp.trim()
  if (!trimmed || trimmed === '#' || trimmed === '/shop#') return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const digits = trimmed.replace(/[^\d]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

function normalizePhoneTel(phone?: string): string | null {
  if (!phone || typeof phone !== 'string') return null
  const trimmed = phone.trim()
  if (!trimmed || trimmed === '#' || trimmed === '/shop#') return null
  const digits = trimmed.replace(/[^\d+]/g, '')
  if (!digits) return null
  return `tel:${digits}`
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.28 0 .54.04.79.1v-3.5a6.38 6.38 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.81a8.28 8.28 0 0 0 4.86 1.57V6.93a4.82 4.82 0 0 1-.95-.24z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.516 2 2.031 6.484 2.031 12c0 1.859.516 3.609 1.406 5.125L2 22l5.016-1.391C8.484 21.438 10.203 22 12.031 22c5.516 0 10-4.484 10-10s-4.484-10-10-10zm0 18.281c-1.609 0-3.141-.438-4.469-1.219l-.328-.188-3.328.922.906-3.234-.203-.344c-.875-1.375-1.344-2.984-1.344-4.688 0-4.75 3.875-8.625 8.766-8.625 4.75 0 8.625 3.875 8.625 8.625 0 4.766-3.875 8.75-8.625 8.75zm4.781-6.531c-.266-.141-1.563-.766-1.813-.859-.234-.094-.406-.141-.578.141-.172.266-.672.859-.828 1.031-.141.172-.3.188-.563.047-.266-.141-1.125-.422-2.156-1.328-.813-.719-1.359-1.594-1.516-1.875-.156-.266-.016-.406.125-.547.125-.125.266-.328.406-.484.141-.172.188-.281.281-.469.094-.188.047-.359-.031-.5-.078-.141-.578-1.406-.813-1.922-.219-.516-.438-.453-.609-.453h-.516c-.188 0-.484.063-.734.344-.25.266-.969.953-.969 2.328s.984 2.703 1.125 2.891c.141.188 1.953 2.984 4.734 4.188.656.281 1.172.453 1.578.578.672.219 1.281.188 1.766.109.547-.078 1.563-.641 1.781-1.266.219-.625.219-1.156.156-1.266-.063-.109-.234-.172-.5-.313z" />
    </svg>
  )
}

export function StorefrontFooter({ settings }: StorefrontFooterProps) {
  const { t } = useI18n()

  const identity = settings?.identity
  const contact = settings?.contact

  const brandName = identity?.brand_name || "KENDJI LUXURY"
  const brandNameAr = identity?.brand_name_ar

  // Social normalization
  const instagramUrl = normalizeSocialUrl('instagram', identity?.instagram)
  const tiktokUrl = normalizeSocialUrl('tiktok', identity?.tiktok)
  const facebookUrl = normalizeSocialUrl('facebook', identity?.facebook)
  const whatsappUrl = normalizeWhatsAppUrl(identity?.whatsapp)

  // Contact details normalization
  const csPhone = contact?.customer_service_phone?.trim()
  const altPhone = identity?.contact_phone?.trim()
  const displayPhone = csPhone || altPhone || null
  const phoneTel = displayPhone ? normalizePhoneTel(displayPhone) : null

  const csEmail = contact?.customer_service_email?.trim() || identity?.contact_email?.trim() || null
  const emailMailto = csEmail ? `mailto:${csEmail}` : null

  const address = contact?.business_address?.trim() || null
  const hasSocials = Boolean(instagramUrl || tiktokUrl || facebookUrl || whatsappUrl)
  const hasContact = Boolean(displayPhone || csEmail || address || whatsappUrl)

  return (
    <footer className="bg-[#141414] text-white pt-16 pb-10 border-t border-white/10">
      <Container>
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          
          {/* 1. Brand Identity & Heritage */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-white/80 transition-colors">
                {brandName}
              </span>
              {brandNameAr && (
                <span className="block text-sm text-white/50 font-serif mt-0.5" dir="rtl">
                  {brandNameAr}
                </span>
              )}
            </Link>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed font-light">
              {t.footer?.brandDescription || "Maison de haute joaillerie moderne en Algérie. Créations précieuses, parures d'exception et motifs emblématiques conçus avec une exigence artisanale absolue."}
            </p>

            {/* Social Icons row */}
            {hasSocials && (
              <div className="pt-2 flex items-center gap-3">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    <TikTokIcon className="h-4 w-4" />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 2. Navigation / Explore */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-white/80">
              {t.footer?.explore || "Explorer"}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t.nav?.shop || "Catalogue & Parures"}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  {t.nav?.collections || "Collections Signatures"}
                </Link>
              </li>
              <li>
                <Link href="/category" className="hover:text-white transition-colors">
                  {t.nav?.categories || "Catégories"}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Contact & Service Client (Persisted from Admin Settings) */}
          {hasContact && (
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-white/80">
                {t.footer?.customerCare || "Service Client & Conciergerie"}
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                {displayPhone && phoneTel && (
                  <li className="flex items-start gap-2.5">
                    <Phone className="h-4 w-4 text-white/50 mt-0.5 shrink-0" />
                    <a href={phoneTel} className="hover:text-white transition-colors">
                      {displayPhone}
                    </a>
                  </li>
                )}
                {whatsappUrl && identity?.whatsapp && (
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0 text-white/50">
                      <WhatsAppIcon className="h-4 w-4" />
                    </div>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      WhatsApp: {identity.whatsapp}
                    </a>
                  </li>
                )}
                {csEmail && emailMailto && (
                  <li className="flex items-start gap-2.5">
                    <Mail className="h-4 w-4 text-white/50 mt-0.5 shrink-0" />
                    <a href={emailMailto} className="hover:text-white transition-colors break-all">
                      {csEmail}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-2.5 text-white/60">
                    <MapPin className="h-4 w-4 text-white/50 mt-0.5 shrink-0" />
                    <span>{address}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

        </div>

        {/* Bottom Bar with Copyright and Creator Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-white/50">
          <p className="tracking-wider">
            &copy; {new Date().getFullYear()} {brandName}. {t.footer?.copyright || "Tous droits réservés."}
          </p>

          {/* Creator Attribution */}
          <div className="flex items-center gap-2.5 text-white/60">
            <span className="text-[11px] uppercase tracking-wider text-white/40">Crafted by</span>
            <a
              href="https://www.instagram.com/dripidin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all text-white/80 hover:text-white group"
            >
              <div className="relative h-4 w-4 shrink-0">
                <Image
                  src="/brand/metachagour-logo-white.png"
                  alt="MetaChagour / Dripidin Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-medium text-xs text-white tracking-wide">@dripidin</span>
              <span className="text-[10px] text-white/40 group-hover:text-white/60 hidden md:inline">
                &bull; CEO of MetaChagour
              </span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
