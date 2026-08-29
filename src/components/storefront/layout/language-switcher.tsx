'use client'

import { useState } from 'react'
import { Locale } from '@/lib/i18n/translations'
import { useI18n } from '@/lib/i18n/context'
import { Globe } from 'lucide-react'

const LANGUAGES: { code: Locale; label: string; short: string }[] = [
  { code: 'ar', label: 'العربية', short: 'عربي' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' }
]

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (code: Locale) => {
    setLocale(code)
    setIsOpen(false)
  }

  const current = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0]

  return (
    <div className={`relative inline-block text-left ${className || ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1A1A1A]/80 hover:text-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#1A1A1A]/15 hover:border-[#1A1A1A]/30 transition-all bg-white/50 backdrop-blur-sm"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-semibold">{current.short}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-[#1A1A1A]/10 py-1.5 z-50 overflow-hidden">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-4 py-2.5 text-xs font-sans flex items-center justify-between hover:bg-[#FAF9F6] transition-colors ${
                  locale === lang.code ? 'font-bold text-[#1A1A1A] bg-[#F2F2EF]' : 'text-[#1A1A1A]/70'
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-[10px] text-[#1A1A1A]/40 uppercase font-mono">{lang.short}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
