import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Votre Panier d'Achat • KenDji Luxury",
  description: "Consultez votre sélection de haute joaillerie KenDji Luxury.",
  robots: {
    index: false,
    follow: false
  }
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
