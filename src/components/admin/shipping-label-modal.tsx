'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Printer } from 'lucide-react'

interface ShippingLabelModalProps {
  orderNumber: string
  trackingNumber: string
  courierName: string
  recipientName: string
  recipientPhone: string
  wilaya: string
  commune: string
  address: string
  deliveryMethod: string
  codAmount: number
  items: { name: string; quantity: number }[]
}

export function ShippingLabelModal({
  orderNumber,
  trackingNumber,
  courierName,
  recipientName,
  recipientPhone,
  wilaya,
  commune,
  address,
  deliveryMethod,
  codAmount,
  items
}: ShippingLabelModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs h-8 bg-white border-gray-300 hover:bg-gray-50 text-gray-800"
      >
        <Printer className="h-3.5 w-3.5 mr-1.5 text-gray-600" />
        Imprimer Bordereau
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b bg-gray-50">
            <DialogTitle className="text-sm font-bold flex items-center justify-between">
              <span>Bordereau Officiel de Livraison (Algérie)</span>
              <span className="text-xs font-mono font-normal text-gray-500">{courierName}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Printable Label Box */}
          <div className="p-6">
            <div className="official-shipping-label border-2 border-black p-5 rounded-md font-sans text-xs space-y-4 bg-white text-black">
              {/* Top Header */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <h2 className="text-base font-black tracking-wider uppercase">KENDJI LUXURY</h2>
                  <p className="text-[10px] text-gray-600">Haute Joaillerie &bull; Alger, Algérie</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold border border-black px-2 py-0.5 rounded">
                    {deliveryMethod}
                  </span>
                  <p className="text-[10px] font-mono mt-1 text-gray-600">{courierName}</p>
                </div>
              </div>

              {/* Barcode & Tracking block */}
              <div className="text-center py-2 bg-gray-50 border border-gray-200 rounded">
                <div className="font-mono text-xl font-bold tracking-widest uppercase">{trackingNumber}</div>
                <div className="text-[10px] text-gray-500 font-mono">Commande: #{orderNumber}</div>
              </div>

              {/* Recipient details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Destinataire (Client)</span>
                  <p className="font-bold text-sm text-gray-900 mt-0.5">{recipientName}</p>
                  <p className="font-mono font-semibold text-gray-800 mt-1">{recipientPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Destination</span>
                  <p className="font-bold text-gray-900 mt-0.5">{commune}, {wilaya}</p>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{address}</p>
                </div>
              </div>

              {/* Articles & COD Amount */}
              <div className="flex items-center justify-between pt-1">
                <div className="max-w-[260px]">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Contenu du Colis</span>
                  <p className="text-[11px] text-gray-800 mt-0.5 truncate">
                    {items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>

                <div className="text-right bg-black text-white p-2.5 rounded">
                  <span className="text-[9px] uppercase font-bold text-gray-300 block">Montant COD à Encaisser</span>
                  <p className="font-mono text-base font-black">{Number(codAmount).toLocaleString('fr-FR')} DA</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
            <Button size="sm" onClick={handlePrint} className="bg-black text-white hover:bg-gray-800 gap-1.5">
              <Printer className="h-4 w-4" />
              Lancer l&apos;Impression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
