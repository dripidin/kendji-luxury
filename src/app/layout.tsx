import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

function getValidSiteUrl(): URL {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    try {
      const formatted = envUrl.startsWith("http://") || envUrl.startsWith("https://")
        ? envUrl
        : `https://${envUrl}`;
      return new URL(formatted);
    } catch {
      // Ignore parse failure and fallback below
    }
  }
  return new URL("https://kendji-luxury.dz");
}

const siteUrlObj = getValidSiteUrl();
const siteUrl = siteUrlObj.origin;

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: siteUrlObj,
  title: {
    default: "KenDji Luxury • Joaillerie & Parures d'Exception en Algérie",
    template: "%s • KenDji Luxury",
  },
  description:
    "Maison de joaillerie et parures raffinées. Découvrez notre sélection exclusive de colliers, parures, bracelets et bagues avec paiement à la livraison sécurisé partout en Algérie.",
  keywords: [
    "joaillerie Algérie",
    "parure de bijoux",
    "bijoux de luxe Alger",
    "KenDji Luxury",
    "collier femme",
    "bracelets et bagues",
    "paiement livraison Alger",
    "bijouterie en ligne Algérie"
  ],
  authors: [{ name: "KenDji Luxury" }],
  creator: "KenDji Luxury",
  publisher: "KenDji Luxury",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: siteUrl,
    siteName: "KenDji Luxury",
    title: "KenDji Luxury • Joaillerie & Parures d'Exception",
    description:
      "Sélection exclusive de bijoux et parures raffinées. Livraison sécurisée avec paiement à la réception.",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "KenDji Luxury — Parures d'Exception",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KenDji Luxury • Joaillerie d'Exception",
    description:
      "Bijoux et parures de créateurs. Paiement à la livraison partout en Algérie.",
    images: ["/images/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${bodoniModa.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">{children}</body>
    </html>
  );
}
