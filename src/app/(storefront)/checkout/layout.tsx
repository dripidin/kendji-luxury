import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paiement à la Livraison (COD) • KenDji Luxury",
  description: "Finalisez votre commande en toute sérénité. Paiement en espèces lors de la livraison en Algérie.",
  robots: {
    index: false,
    follow: false
  }
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
