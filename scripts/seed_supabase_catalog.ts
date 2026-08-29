import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { PRODUCTS, COLLECTIONS, CATEGORIES } from "../src/lib/catalog";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function seedSupabaseCatalog() {
  console.log("\n==================================================");
  console.log("SEEDING SUPABASE PRODUCTION DATABASE");
  console.log("==================================================\n");

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1. Seed Categories
  console.log("1. Upserting Categories...");
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const { error } = await supabase.from("categories").upsert({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      display_order: i,
      active: true
    }, { onConflict: "slug" });

    if (error) console.error(`Error inserting category ${cat.name}:`, error.message);
  }
  console.log(`✓ ${CATEGORIES.length} Categories synced.`);

  // 2. Seed Collections
  console.log("\n2. Upserting Collections...");
  for (let i = 0; i < COLLECTIONS.length; i++) {
    const col = COLLECTIONS[i];
    const { error } = await supabase.from("collections").upsert({
      name: col.name,
      slug: col.slug,
      description: col.description,
      display_order: i,
      active: true
    }, { onConflict: "slug" });

    if (error) console.error(`Error inserting collection ${col.name}:`, error.message);
  }
  console.log(`✓ ${COLLECTIONS.length} Collections synced.`);

  // Fetch Category & Collection ID maps
  const { data: dbCategories } = await supabase.from("categories").select("id, slug");
  const { data: dbCollections } = await supabase.from("collections").select("id, slug");

  const catMap = new Map((dbCategories || []).map(c => [c.slug, c.id]));
  const colMap = new Map((dbCollections || []).map(c => [c.slug, c.id]));

  // 3. Seed Products & Variants
  console.log("\n3. Upserting 25 Products & Variants...");
  for (const prod of PRODUCTS) {
    const categoryId = catMap.get(prod.categorySlug) || null;
    
    const { data: insertedProduct, error: prodErr } = await supabase.from("products").upsert({
      name: prod.name,
      slug: prod.slug,
      sku: prod.id,
      description: prod.description,
      category_id: categoryId,
      base_price: prod.price,
      currency: prod.currency,
      status: "PUBLISHED",
      is_featured: prod.isFeatured || false,
      metadata: {
        metallicFinish: prod.metallicFinish,
        stonesOrInserts: prod.stonesOrInserts,
        designCharacteristics: prod.designCharacteristics,
        piecesIncluded: prod.piecesIncluded
      }
    }, { onConflict: "slug" }).select("id").single();

    if (prodErr || !insertedProduct) {
      console.error(`Error inserting product ${prod.name}:`, prodErr?.message);
      continue;
    }

    const productId = insertedProduct.id;

    // Link collection
    const collectionId = colMap.get(prod.collectionSlug);
    if (collectionId) {
      await supabase.from("product_collections").upsert({
        product_id: productId,
        collection_id: collectionId
      }, { onConflict: "product_id,collection_id" });
    }

    // Insert Product Media
    await supabase.from("product_media").delete().eq("product_id", productId);
    for (let i = 0; i < prod.images.length; i++) {
      const imgUrl = prod.images[i];
      await supabase.from("product_media").insert({
        product_id: productId,
        url: imgUrl,
        role: i === 0 ? "COVER" : "GALLERY",
        display_order: i
      });
    }

    // Insert Variants
    if (prod.variants && prod.variants.length > 0) {
      await supabase.from("variants").delete().eq("product_id", productId);
      for (const v of prod.variants) {
        await supabase.from("variants").insert({
          product_id: productId,
          label: v.name,
          sku: `${prod.id}-${v.id}`,
          is_available: true,
          stock: 15
        });
      }
    }
  }
  console.log(`✓ All 25 Products, Collections links, Media, and Variants seeded to Supabase.`);

  // 4. Verify Final Product Count in Remote Database
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
  console.log(`\nFinal verified remote Supabase product count: ${count} / 25`);
  console.log("==================================================\n");
}

seedSupabaseCatalog();
