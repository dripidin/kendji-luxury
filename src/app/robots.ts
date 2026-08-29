import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = envUrl
    ? (envUrl.startsWith("http://") || envUrl.startsWith("https://") ? envUrl : `https://${envUrl}`).replace(/\/$/, "")
    : "https://kendji-luxury.dz";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/shop",
          "/collections",
          "/collections/*",
          "/category/*",
          "/product/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/auth",
          "/auth/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
