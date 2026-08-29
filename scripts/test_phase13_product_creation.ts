import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { productSchema } from "../src/lib/validations/catalog";
import { createProduct } from "../src/app/admin/actions/catalog";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runPhase13Tests() {
  console.log("\n==================================================");
  console.log("PHASE 13: PRODUCT CREATION & CATALOG FORM TEST SUITE");
  console.log("==================================================\n");

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1. Fetch valid category and collection IDs for testing
  const { data: category } = await supabase.from("categories").select("id, name").limit(1).single();
  const { data: collection } = await supabase.from("collections").select("id, name").limit(1).single();

  assert(!!category, `Found existing test category: ${category?.name} (${category?.id})`);
  assert(!!collection, `Found existing test collection: ${collection?.name} (${collection?.id})`);

  console.log("\n[TEST GROUP 1] Client & Server Schema Validation");

  // Schema Test: Invalid Price
  const invalidPriceResult = productSchema.safeParse({
    name: "Test Bague Or",
    slug: "test-bague-or",
    base_price: -500,
    status: "DRAFT",
    category_id: category?.id
  });
  assert(!invalidPriceResult.success, "Rejects negative base price (-500 DA)");

  // Schema Test: Missing Category
  const missingCatResult = productSchema.safeParse({
    name: "Test Bague Or",
    slug: "test-bague-or",
    base_price: 1500,
    status: "DRAFT",
    category_id: "not-a-uuid"
  });
  assert(!missingCatResult.success, "Rejects invalid category UUID");

  // Schema Test: Invalid Slug Characters
  const invalidSlugResult = productSchema.safeParse({
    name: "Test Bague Or",
    slug: "Test Bague Or with Spaces!",
    base_price: 1500,
    status: "DRAFT",
    category_id: category?.id
  });
  assert(!invalidSlugResult.success, "Rejects uppercase and spaced slug characters");

  console.log("\n[TEST GROUP 2] Server-Side Business Logic & Uniqueness");

  // Server Action: Non-existent Category ID
  const fakeCatId = "00000000-0000-0000-0000-000000000000";
  const fakeCatRes = await createProduct({
    name: "Fake Cat Test",
    slug: "fake-cat-test-unique-1",
    base_price: 1000,
    status: "DRAFT",
    currency: "DZD",
    category_id: fakeCatId,
    collection_ids: [],
    media: [],
    variants: [],
    is_featured: false
  });
  assert(!!fakeCatRes.error && fakeCatRes.error.includes("category"), "Server rejects non-existent category UUID");

  console.log("\n[TEST GROUP 3] Full Product Creation Lifecycle");

  const testSlug = `phase13-test-parure-${Date.now()}`;
  const creationData = {
    name: "Parure Test Joaillerie Phase 13",
    slug: testSlug,
    sku: "KDL-TEST-P13",
    base_price: 2500,
    currency: "DZD",
    status: "DRAFT" as const,
    category_id: category!.id,
    collection_ids: [collection!.id],
    short_description: "Parure de test exclusive avec nacre et or rose",
    description: "Description complète de la pièce de joaillerie test",
    story: "Inspirée par la haute joaillerie contemporaine",
    is_featured: true,
    media: [
      { url: "/products/product-1/1.jpg", role: "COVER" as const, display_order: 0 },
      { url: "/products/product-1/2.jpg", role: "GALLERY" as const, display_order: 1 },
      { url: "/products/product-1/3.jpg", role: "DETAIL" as const, display_order: 2 }
    ],
    variants: [
      { label: "Or Rose", sku: "KDL-TEST-P13-ROSE", price_override: 2500, stock: 12, is_available: true },
      { label: "Or Blanc", sku: "KDL-TEST-P13-WHT", price_override: 2700, stock: 8, is_available: true }
    ],
    metadata: {
      metallicFinish: "Plaqué Or 18k",
      stonesOrInserts: "Oxydes de Zirconium",
      piecesIncluded: "Collier + Bracelet + Bague",
      care: "Nettoyer avec un chiffon doux"
    }
  };

  const createRes = await createProduct(creationData);
  assert(!!createRes.success, `Successfully created full product (ID: ${createRes.productId})`);

  // Verify Slug Duplicate Protection
  const duplicateRes = await createProduct(creationData);
  assert(!!duplicateRes.error && duplicateRes.error.includes("already in use"), "Server blocks duplicate slug creation");

  console.log("\n[TEST GROUP 4] Database Persistence & Relationship Verification");

  if (createRes.productId) {
    const { data: dbProduct } = await supabase
      .from("products")
      .select("*, product_media(*), variants(*), product_collections(*)")
      .eq("id", createRes.productId)
      .single();

    assert(!!dbProduct, "Product successfully retrieved from database");
    assert(dbProduct?.name === creationData.name, `Product name matches: ${dbProduct?.name}`);
    assert(Number(dbProduct?.base_price) === 2500, `Base price matches: ${dbProduct?.base_price} DZD`);
    assert(dbProduct?.is_featured === true, "Featured flag persisted correctly");
    assert(dbProduct?.metadata?.metallicFinish === "Plaqué Or 18k", "Metadata JSON persisted correctly");
    
    assert(dbProduct?.product_media?.length === 3, `All 3 media items persisted (found ${dbProduct?.product_media?.length})`);
    const coverMedia = dbProduct?.product_media?.find((m: any) => m.role === "COVER");
    assert(!!coverMedia && coverMedia.url === "/products/product-1/1.jpg", "Cover image role persisted correctly");

    assert(dbProduct?.variants?.length === 2, `All 2 variants persisted (found ${dbProduct?.variants?.length})`);
    assert(dbProduct?.product_collections?.length === 1, "Collection relationship persisted in product_collections");

    // Clean up test product
    await supabase.from("products").delete().eq("id", createRes.productId);
    console.log("  ✓ Cleaned up test product record.");
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total: ${totalTests})`);
  console.log("==================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase13Tests();
