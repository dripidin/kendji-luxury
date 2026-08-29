import * as dotenv from 'dotenv';
import {
  fetchStorefrontProducts,
  fetchStorefrontCategories,
  fetchStorefrontCategoryBySlug
} from '../src/lib/storefront-catalog';
import { getCategories } from '../src/lib/catalog';

dotenv.config({ path: '.env.local' });

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

async function runPhase14Tests() {
  console.log('\n==================================================');
  console.log('PHASE 14: STOREFRONT CATALOG & CATEGORY ROUTING TESTS');
  console.log('==================================================\n');

  console.log('[TEST GROUP 1] Shop All Catalog Query & Media Integrity');
  const allProducts = await fetchStorefrontProducts();
  assert(allProducts.length === 25, `Shop All returns all 25 published products (got ${allProducts.length})`);

  const allHaveImages = allProducts.every(p => p.coverImage && p.coverImage.length > 0);
  assert(allHaveImages, 'All 25 products have a valid cover image path');

  const allApprovedMedia = allProducts.every(p => 
    p.coverImage.startsWith('/products/') || p.coverImage.includes('supabase.co')
  );
  assert(allApprovedMedia, 'All product cover images use approved store/storage paths');

  const allHavePrices = allProducts.every(p => p.price > 0 && p.currency === 'DZD');
  assert(allHavePrices, 'All 25 products have valid positive DZD prices');

  console.log('\n[TEST GROUP 2] Catalog Sorting');
  const sortedAsc = await fetchStorefrontProducts({ sort: 'price_asc' });
  const isAsc = sortedAsc.every((p, i) => i === 0 || p.price >= sortedAsc[i - 1].price);
  assert(isAsc, `Price low-to-high sort verified (${sortedAsc[0].price} DA -> ${sortedAsc[sortedAsc.length - 1].price} DA)`);

  const sortedDesc = await fetchStorefrontProducts({ sort: 'price_desc' });
  const isDesc = sortedDesc.every((p, i) => i === 0 || p.price <= sortedDesc[i - 1].price);
  assert(isDesc, `Price high-to-low sort verified (${sortedDesc[0].price} DA -> ${sortedDesc[sortedDesc.length - 1].price} DA)`);

  console.log('\n[TEST GROUP 3] Category Resolution & Routing');
  const categories = await fetchStorefrontCategories();
  assert(categories.length >= 5, `Fetched ${categories.length} active categories`);

  const expectedCategories = ['sets', 'necklaces', 'bracelets', 'rings', 'watches'];
  for (const catSlug of expectedCategories) {
    const category = await fetchStorefrontCategoryBySlug(catSlug);
    assert(!!category && category.slug === catSlug, `Category slug "${catSlug}" resolved successfully (${category?.name})`);

    const catProducts = await fetchStorefrontProducts({ categorySlug: catSlug });
    assert(catProducts.length > 0, `Category "${catSlug}" has ${catProducts.length} published products`);
    assert(
      catProducts.every(p => p.categorySlug === catSlug),
      `All products in "${catSlug}" match categorySlug`
    );
  }

  console.log('\n[TEST GROUP 4] Invalid Category & Boundary Handling');
  const invalidCategory = await fetchStorefrontCategoryBySlug('non-existent-category-xyz');
  assert(invalidCategory === null, 'Invalid category slug returns null (triggers 404 notFound)');

  const invalidCatProducts = await fetchStorefrontProducts({ categorySlug: 'non-existent-category-xyz' });
  assert(invalidCatProducts.length === 0, 'Invalid category filter returns empty array');

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total: ${totalTests})`);
  console.log('==================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase14Tests();
