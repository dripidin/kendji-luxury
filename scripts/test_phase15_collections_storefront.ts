import * as dotenv from 'dotenv';
import {
  fetchStorefrontCollections,
  fetchStorefrontCollectionBySlug,
  fetchStorefrontProducts
} from '../src/lib/storefront-catalog';

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

async function runPhase15Tests() {
  console.log('\n==================================================');
  console.log('PHASE 15: COLLECTIONS STOREFRONT EXPERIENCE TESTS');
  console.log('==================================================\n');

  console.log('[TEST GROUP 1] Collections Index & Data Resolution');
  const collections = await fetchStorefrontCollections();
  assert(collections.length === 4, `Found all 4 active collections (got ${collections.length})`);

  const allHaveImages = collections.every(c => c.coverImage && c.coverImage.length > 0);
  assert(allHaveImages, 'All collections have a valid cover image path');

  const allHaveTaglines = collections.every(c => c.tagline && c.tagline.length > 0);
  assert(allHaveTaglines, 'All collections have a valid luxury tagline');

  const totalProductsInCollections = collections.reduce((sum, c) => sum + c.productCount, 0);
  assert(totalProductsInCollections === 25, `Sum of products across collections equals total catalog size (25, got ${totalProductsInCollections})`);

  console.log('\n[TEST GROUP 2] Collection Detail Resolution & Product Filtering');
  const expectedCollections = [
    { slug: 'signature-motifs', name: 'Signature Motifs' },
    { slug: 'romantic-nature', name: 'Romantic Nature' },
    { slug: 'urban-iconic', name: 'Urban & Iconic' },
    { slug: 'personalized-cultural', name: 'Personalized & Cultural' }
  ];

  for (const exp of expectedCollections) {
    const col = await fetchStorefrontCollectionBySlug(exp.slug);
    assert(!!col && col.name === exp.name, `Resolved collection "${exp.slug}" -> ${col?.name}`);
    assert((col?.productCount || 0) > 0, `Collection "${exp.slug}" has ${col?.productCount} linked products`);

    const colProducts = await fetchStorefrontProducts({ collectionSlug: exp.slug });
    assert(colProducts.length === col?.productCount, `Fetched products count (${colProducts.length}) matches collection count (${col?.productCount})`);
    assert(
      colProducts.every(p => p.collectionSlug === exp.slug),
      `All products in "${exp.slug}" have collectionSlug "${exp.slug}"`
    );
  }

  console.log('\n[TEST GROUP 3] Boundary & Invalid Collection Handling');
  const invalidCol = await fetchStorefrontCollectionBySlug('non-existent-collection-xyz');
  assert(invalidCol === null, 'Invalid collection slug returns null (triggers 404 notFound)');

  const invalidColProducts = await fetchStorefrontProducts({ collectionSlug: 'non-existent-collection-xyz' });
  assert(invalidColProducts.length === 0, 'Invalid collection query returns 0 products');

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total: ${totalTests})`);
  console.log('==================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase15Tests();
