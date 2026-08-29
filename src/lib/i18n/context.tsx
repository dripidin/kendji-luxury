'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Locale, Dictionary, getDictionary, getDirection } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
  dir: 'ltr' | 'rtl'
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'kendji_locale'

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale
    if (saved && (saved === 'fr' || saved === 'ar' || saved === 'en')) {
      return saved
    }
  }
  return 'fr'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
      document.documentElement.lang = newLocale
      document.documentElement.dir = getDirection(newLocale)
    }
  }

  useEffect(() => {
    // Initial sync on mount
    document.documentElement.lang = locale
    document.documentElement.dir = getDirection(locale)
  }, [locale])

  const t = getDictionary(locale)
  const dir = getDirection(locale)

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackT = getDictionary('fr')
    return {
      locale: 'fr' as Locale,
      setLocale: () => {},
      t: fallbackT,
      dir: 'ltr' as const
    }
  }
  return context
}
