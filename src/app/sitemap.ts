import { MetadataRoute } from "next"
import { getAllProducts, getCollections, getCategories } from "@/lib/catalog"

export default function sitemap(): MetadataRoute.Sitemap {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = envUrl
    ? (envUrl.startsWith("http://") || envUrl.startsWith("https://") ? envUrl : `https://${envUrl}`).replace(/\/$/, "")
    : "https://kendji-luxury.dz";
  const currentDate = new Date().toISOString()

  // 1. Static high-level storefront pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // 2. Collection pages
  const collections = getCollections()
  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // 3. Category pages
  const categories = getCategories()
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // 4. Product pages (all 25 approved jewelry pieces)
  const products = getAllProducts()
  const productPages: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }))

  return [...staticPages, ...collectionPages, ...categoryPages, ...productPages]
}
