import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Montserrat, Tajawal } from "next/font/google";
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

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
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
    default: "كندجي للمجوهرات الفاخرة • فخامة وأطقم استثنائية في الجزائر",
    template: "%s • كندجي للمجوهرات الفاخرة",
  },
  description:
    "دار مجوهرات وأطقم راقية. اكتشف تشكيلتنا الحصرية من القلادات والأطقم والأساور مع ميزة الدفع عند الاستلام المضمون عبر 58 ولاية جزائرية.",
  keywords: [
    "مجوهرات الجزائر",
    "مجوهرات فاخرة",
    "أطقم مجوهرات",
    "سلاسل ذهبية",
    "الدفع عند الاستلام الجزائر",
    "KenDji Luxury",
    "Haute Joaillerie Algérie"
  ],
  alternates: {
    canonical: siteUrl,
  },
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
    locale: "ar_DZ",
    url: siteUrl,
    siteName: "كندجي للمجوهرات الفاخرة",
    title: "كندجي للمجوهرات الفاخرة • إبداعات استثنائية",
    description:
      "تألقي بأرقى التصاميم الجوهرية مع التوصيل والدفع عند الاستلام عبر 58 ولاية.",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "كندجي للمجوهرات الفاخرة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "كندجي للمجوهرات الفاخرة",
    description:
      "مجوهرات وأطقم راقية. الدفع عند الاستلام عبر جميع الولايات.",
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
      lang="ar"
      dir="rtl"
      className={`${bodoniModa.variable} ${montserrat.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">{children}</body>
    </html>
  );
}
