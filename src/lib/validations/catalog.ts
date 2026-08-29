import * as z from "zod"

export const productMediaItemSchema = z.object({
  url: z.string().min(1, "Media URL is required"),
  role: z.enum(["COVER", "GALLERY", "DETAIL", "VARIANT", "LIFESTYLE"]),
  display_order: z.number().int().nonnegative(),
})

export type ProductMediaItem = z.infer<typeof productMediaItemSchema>

export const productVariantItemSchema = z.object({
  label: z.string().min(1, "Variant label is required"),
  sku: z.string().optional(),
  image: z.string().optional(),
  price_override: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  is_available: z.boolean(),
})

export type ProductVariantItem = z.infer<typeof productVariantItemSchema>

export const productMetadataSchema = z.object({
  metallicFinish: z.string().optional(),
  stonesOrInserts: z.string().optional(),
  color: z.string().optional(),
  piecesIncluded: z.string().optional(),
  dimensions: z.string().optional(),
  size: z.string().optional(),
  chainLength: z.string().optional(),
  care: z.string().optional(),
  benefits: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
}).passthrough().optional()

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens"),
  sku: z.string().optional(),
  base_price: z.number().min(0, "Price must be a positive number"),
  currency: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  category_id: z.string().uuid("Please select a valid category"),
  collection_ids: z.array(z.string().uuid()),
  short_description: z.string().optional(),
  description: z.string().optional(),
  story: z.string().optional(),
  is_featured: z.boolean(),
  media: z.array(productMediaItemSchema),
  variants: z.array(productVariantItemSchema),
  metadata: productMetadataSchema,
})

export type ProductFormValues = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  is_active: z.boolean(),
  display_order: z.number().int().nonnegative(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const collectionSchema = z.object({
  name: z.string().min(2, "Collection name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  is_active: z.boolean(),
  display_order: z.number().int().nonnegative(),
})

export type CollectionFormValues = z.infer<typeof collectionSchema>

export const variantSchema = z.object({
  label: z.string().min(1, "Variant label is required"),
  sku: z.string().optional(),
  price_override: z.number().optional(),
  stock: z.number().int().min(0),
  is_available: z.boolean(),
})

export type VariantFormValues = z.infer<typeof variantSchema>
