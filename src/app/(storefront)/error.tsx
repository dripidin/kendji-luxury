"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/storefront/layout/container"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log unexpected errors safely on client side without exposing details to UI
    if (process.env.NODE_ENV !== "production") {
      console.error("Storefront runtime error:", error)
    }
  }, [error])

  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 mb-6">
        <AlertCircle size={24} />
      </div>

      <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4 text-charcoal">
        Une interruption momentanée
      </h1>

      <p className="max-w-md mb-8 text-charcoal/70 text-sm leading-relaxed">
        Nous rencontrons une difficulté technique temporaire lors de l&apos;accès à cette page. Veuillez réessayer ou revenir à l&apos;accueil de la boutique.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          onClick={() => reset()}
          variant="outline"
          className="h-11 px-8 gap-2 uppercase tracking-widest text-xs border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors"
        >
          <RotateCcw size={14} />
          <span>Réessayer</span>
        </Button>

        <Link href="/">
          <Button
            className="h-11 px-8 uppercase tracking-widest text-xs bg-charcoal text-ivory hover:bg-black transition-colors"
          >
            Retour à la Boutique
          </Button>
        </Link>
      </div>
    </Section>
  )
}
