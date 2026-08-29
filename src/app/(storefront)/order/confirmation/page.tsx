'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function OrderConfirmationRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNum = searchParams.get('num') || searchParams.get('id')

  useEffect(() => {
    if (orderNum) {
      router.replace(`/checkout/confirmation/${encodeURIComponent(orderNum)}`)
    } else {
      router.replace('/shop')
    }
  }, [orderNum, router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
      Redirection vers votre confirmation de commande...
    </div>
  )
}

export default function OrderConfirmationAliasPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Chargement...</div>}>
      <OrderConfirmationRedirect />
    </Suspense>
  )
}
