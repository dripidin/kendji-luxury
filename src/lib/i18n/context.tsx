'use client'

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react'
import { Locale, Dictionary, getDictionary, getDirection } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
  dir: 'ltr' | 'rtl'
  isMounted: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'kendji_locale'
const emptySubscribe = () => () => {}

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale
    if (saved && (saved === 'fr' || saved === 'ar' || saved === 'en')) {
      return saved
    }
  }
  return 'ar'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = getDirection(locale)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
      document.documentElement.lang = newLocale
      document.documentElement.dir = getDirection(newLocale)
    }
  }

  const t = getDictionary(locale)
  const dir = getDirection(locale)

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir, isMounted }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    const fallbackT = getDictionary('ar')
    return {
      locale: 'ar' as Locale,
      setLocale: () => {},
      t: fallbackT,
      dir: 'rtl' as const,
      isMounted: false
    }
  }
  return context
}
