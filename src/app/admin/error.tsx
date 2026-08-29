"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
        <AlertTriangle size={24} />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Erreur du panneau d&apos;administration
      </h2>

      <p className="max-w-md text-sm text-gray-600 mb-6">
        Une opération administrative a rencontré un problème. Les données critiques ne sont pas affectées.
      </p>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => reset()}
          variant="outline"
          className="gap-2 text-xs"
        >
          <RotateCcw size={14} />
          <span>Réessayer</span>
        </Button>
        <Link href="/admin">
          <Button variant="default" className="gap-2 text-xs bg-gray-900 hover:bg-black">
            <Home size={14} />
            <span>Tableau de bord</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
