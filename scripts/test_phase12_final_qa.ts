import { getAllProducts, getProductBySlug, getCollections, getCategories } from "../src/lib/catalog";
import { ALGERIA_WILAYAS, getDeliveryFee, getWilayaByCode, validateWilayaAndCommune } from "../src/lib/algeria-cities";
import { validateAndNormalizeAlgerianPhone } from "../src/lib/validation/algerian-phone";
import { isValidOrderStatusTransition, getAllowedNextTransitions } from "../src/lib/commerce/order-status";
import { getActiveCourierProvider, listCourierProviders } from "../src/lib/courier/factory";
import { getAllInventory } from "../src/lib/commerce/inventory";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";

function runPhase12FinalQA() {
  console.log("\n==================================================");
  console.log("PHASE 12: FINAL PRODUCTION QA & AUDIT SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      if (details) console.error(`    Details: ${details}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. CATALOG INTEGRITY AUDIT (25 Approved Products)
  // -------------------------------------------------------------
  console.log("[TEST GROUP 1] Catalog Integrity & Approved Media");
  const products = getAllProducts();
  assert(products.length === 25, `Catalog contains exactly 25 approved products (got ${products.length})`);

  const uniqueSlugs = new Set(products.map(p => p.slug));
  assert(uniqueSlugs.size === 25, `All 25 product slugs are unique`);

  const uniqueIds = new Set(products.map(p => p.id));
  assert(uniqueIds.size === 25, `All 25 product IDs are unique`);

  const allHaveValidPrices = products.every(p => typeof p.price === 'number' && p.price > 0 && p.currency === 'DZD');
  assert(allHaveValidPrices, `All 25 products have authoritative positive DZD prices`);

  const allHaveApprovedCover = products.every(p => p.coverImage && p.coverImage.startsWith('/products/'));
  assert(allHaveApprovedCover, `All products map to approved Web Storefront assets (/products/...)`);

  const rawLeakCheck = products.every(p => !p.coverImage.includes('Kendji Boutique') && !p.coverImage.includes('client_raw'));
  assert(rawLeakCheck, `No raw client/reference assets exposed in storefront catalog`);

  const collections = getCollections();
  assert(collections.length === 4, `All 4 curated collections are defined`);

  const categories = getCategories();
  assert(categories.length === 5, `All 5 jewelry categories are defined`);

  // -------------------------------------------------------------
  // 2. SEO & STRUCTURED DATA (Robots, Sitemap, Schema)
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 2] SEO, Robots, Sitemap & Structured Data");
  const robotsConfig = robots();
  assert(Boolean(robotsConfig.sitemap), `Robots configuration provides sitemap URL`);
  const blockedRules = (robotsConfig.rules as any[])?.[0]?.disallow || [];
  assert(blockedRules.includes("/admin/*") || blockedRules.includes("/admin"), `Robots blocks admin routes from search indexation`);
  assert(blockedRules.includes("/checkout") || blockedRules.includes("/checkout/*"), `Robots blocks checkout flow from indexing`);

  const sitemapEntries = sitemap();
  assert(sitemapEntries.length >= 35, `Sitemap generated ${sitemapEntries.length} canonical URLs for search engines`);

  const sampleProduct = getProductBySlug("quatrefoil-clover-4-piece-jewelry-set");
  assert(Boolean(sampleProduct), `Sample product resolves correctly`);
  assert(Boolean(sampleProduct?.description && sampleProduct.description.length > 20), `Product has comprehensive luxury description`);

  // -------------------------------------------------------------
  // 3. COMMERCE & ALGERIAN DELIVERY INTEGRITY
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 3] Algerian COD, Wilayas & Phone Normalization");
  assert(ALGERIA_WILAYAS.length === 58, `58 Algerian Wilayas dataset is complete`);
  
  const algerHomeFee = getDeliveryFee("16", "DOMICILE");
  const algerDeskFee = getDeliveryFee("16", "STOP_DESK");
  assert(algerHomeFee === 500, `Alger domicile delivery rate is 500 DA`);
  assert(algerDeskFee === 300, `Alger stop-desk delivery rate is 300 DA`);

  const wilaya16 = getWilayaByCode("16");
  assert(wilaya16?.name === "Alger", `Wilaya 16 resolved as Alger`);
  assert(validateWilayaAndCommune("16", "Hydra"), `Commune validation for Hydra (Alger) passed`);
  assert(!validateWilayaAndCommune("16", "Bir El Djir"), `Commune mismatch (Bir El Djir not in Alger) rejected`);

  const validPhoneRes = validateAndNormalizeAlgerianPhone("0550123456");
  assert(validPhoneRes.isValid && validPhoneRes.normalized === "0550123456", `Valid Mobilis phone recognized: 0550123456`);
  
  const formattedDjezzyRes = validateAndNormalizeAlgerianPhone("+213 770 12 34 56");
  assert(formattedDjezzyRes.isValid && formattedDjezzyRes.normalized === "0770123456", `International format normalized: 0770123456`);

  const invalidPhoneRes = validateAndNormalizeAlgerianPhone("0123456789");
  assert(!invalidPhoneRes.isValid, `Invalid prefix phone correctly rejected`);

  // -------------------------------------------------------------
  // 4. ORDER STATE MACHINE & COURIER ISOLATION
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 4] Order Operations & Courier Isolation");
  assert(isValidOrderStatusTransition("PENDING", "CONFIRMED"), `Order flow allows PENDING -> CONFIRMED`);
  assert(isValidOrderStatusTransition("CONFIRMED", "PREPARING"), `Order flow allows CONFIRMED -> PREPARING`);
  assert(isValidOrderStatusTransition("PREPARING", "READY_TO_SHIP"), `Order flow allows PREPARING -> READY_TO_SHIP`);
  assert(isValidOrderStatusTransition("READY_TO_SHIP", "SHIPPED"), `Order flow allows READY_TO_SHIP -> SHIPPED`);
  assert(isValidOrderStatusTransition("SHIPPED", "DELIVERED"), `Order flow allows SHIPPED -> DELIVERED`);
  assert(!isValidOrderStatusTransition("DELIVERED", "PENDING"), `Order flow forbids DELIVERED -> PENDING`);
  assert(!isValidOrderStatusTransition("CANCELLED", "SHIPPED"), `Order flow forbids CANCELLED -> SHIPPED`);

  const nextTransitions = getAllowedNextTransitions("PENDING");
  assert(nextTransitions.includes("CONFIRMED") && nextTransitions.includes("CANCELLED"), `PENDING allows next transitions CONFIRMED & CANCELLED`);
  
  const courier = getActiveCourierProvider();
  assert(courier.code === "MOCK_EXPRESS", `Sandbox uses safe MOCK_EXPRESS courier provider`);

  const providers = listCourierProviders();
  assert(providers.length === 3, `3 provider adapters registered (Mock, Yalidine, ZR Express)`);

  // -------------------------------------------------------------
  // 5. INVENTORY & AVAILABILITY STATE
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 5] Inventory & Stock State");
  const inventoryItems = getAllInventory();
  assert(inventoryItems.length >= 25, `Inventory covers all catalog references (${inventoryItems.length} tracked items)`);
  const inStockItems = inventoryItems.filter(i => i.stockStatus === "IN_STOCK");
  assert(inStockItems.length === inventoryItems.length, `All items currently in-stock with default batch sizes`);

  console.log("\n==================================================");
  console.log(`FINAL QA SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase12FinalQA();
