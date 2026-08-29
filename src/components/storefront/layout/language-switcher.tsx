'use client'

import { useState, useEffect } from 'react'
import { Locale, getDirection } from '@/lib/i18n/translations'
import { Globe } from 'lucide-react'

const LANGUAGES: { code: Locale; label: string; short: string }[] = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'عربي' },
  { code: 'en', label: 'English', short: 'EN' }
]

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kendji_locale') as Locale
    if (saved && ['fr', 'ar', 'en'].includes(saved)) {
      return saved
    }
  }
  return 'fr'
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const [currentLang, setCurrentLang] = useState<Locale>(getInitialLocale)
  const [isOpen, setIsOpen] = useState(false)

  // Sync DOM attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = currentLang
    document.documentElement.dir = getDirection(currentLang)
    document.cookie = `NEXT_LOCALE=${currentLang}; path=/; max-age=31536000`
    localStorage.setItem('kendji_locale', currentLang)
  }, [currentLang])

  const handleSelect = (code: Locale) => {
    setCurrentLang(code)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className || ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1A1A1A]/70 hover:text-[#1A1A1A] px-2 py-1 transition-colors"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-semibold">{LANGUAGES.find(l => l.code === currentLang)?.short}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-[#1A1A1A]/10 py-1 z-50">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-2 text-xs font-sans flex items-center justify-between hover:bg-[#FAF9F6] transition-colors ${
                  currentLang === lang.code ? 'font-bold text-[#1A1A1A] bg-[#F2F2EF]' : 'text-[#1A1A1A]/70'
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-[10px] text-[#1A1A1A]/40 uppercase">{lang.short}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
