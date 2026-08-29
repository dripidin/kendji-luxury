import * as dotenv from 'dotenv';
import { getHomepageContent, DEFAULT_HOMEPAGE_CONTENT } from '../src/lib/cms';
import {
  saveHomepageContentAction,
  updateMediaItemAction,
  deleteMediaItemAction,
  registerMediaItemAction
} from '../src/app/admin/actions/cms';
import { createAdminClient } from '../src/lib/supabase/admin';
import { BACKGROUND_ASSETS } from '../src/lib/catalog';

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

async function runPhase16Tests() {
  console.log('\n==================================================');
  console.log('PHASE 16: CMS CONTENT & MEDIA LIBRARY TESTS');
  console.log('==================================================\n');

  console.log('[TEST GROUP 1] Homepage Content Retrieval & Default Fallback');
  const initialContent = await getHomepageContent();
  assert(!!initialContent.hero, 'Hero section exists in homepage content');
  assert(!!initialContent.hero.headline, 'Hero headline is populated');
  assert(!!initialContent.hero.primary_cta_label, 'Hero CTA label is populated');
  assert(!!initialContent.brand_story, 'Brand story section exists');
  assert(initialContent.trust_section.items.length === 3, 'Trust section has 3 reassurance items');

  console.log('\n[TEST GROUP 2] Homepage Content Mutation & Persistence');
  const updatedHeadline = `Test Haute Joaillerie ${Date.now()}`;
  const testPayload = {
    ...initialContent,
    hero: {
      ...initialContent.hero,
      headline: updatedHeadline
    }
  };

  const saveRes = await saveHomepageContentAction(testPayload);
  assert(saveRes.success, 'saveHomepageContentAction succeeded');

  const reloadedContent = await getHomepageContent();
  assert(reloadedContent.hero.headline === updatedHeadline, `Persisted headline matches: "${updatedHeadline}"`);

  // Restore default
  await saveHomepageContentAction(DEFAULT_HOMEPAGE_CONTENT);
  console.log('  ✓ Restored default homepage content');

  console.log('\n[TEST GROUP 3] Media Library CRUD & Roles');
  const registerRes = await registerMediaItemAction({
    url: '/test/media-test-phase16.jpg',
    role: 'GALLERY',
    alt_text: 'Test Media Initial'
  });
  assert(registerRes.success && !!registerRes.id, `Successfully registered test media item (ID: ${registerRes.id})`);
  const testMediaId = registerRes.id!;

  const updateRes = await updateMediaItemAction(testMediaId, {
    role: 'EDITORIAL',
    alt_text: 'Test Media Updated Description'
  });
  assert(updateRes.success, 'Successfully updated media role to EDITORIAL and alt text');

  const supabase = createAdminClient();
  const { data: dbItem } = await supabase
    .from('product_media')
    .select('*')
    .eq('id', testMediaId)
    .single();

  assert(dbItem?.role === 'EDITORIAL', 'DB persisted updated role: EDITORIAL');
  assert(dbItem?.alt_text === 'Test Media Updated Description', 'DB persisted updated alt text');

  const deleteRes = await deleteMediaItemAction(testMediaId);
  assert(deleteRes.success, 'Successfully deleted test media item');

  const { data: deletedItem } = await supabase
    .from('product_media')
    .select('id')
    .eq('id', testMediaId)
    .maybeSingle();
  assert(deletedItem === null, 'Test media item confirmed removed from database');

  console.log('\n[TEST GROUP 4] Background Assets Registration');
  const bgCodes = Object.keys(BACKGROUND_ASSETS);
  assert(bgCodes.length === 6, 'Found all 6 background asset definitions (KJ-BG-01 to KJ-BG-06)');

  const { data: bgMedia } = await supabase
    .from('product_media')
    .select('url, role')
    .eq('role', 'BACKGROUND');

  assert((bgMedia?.length || 0) >= 6, `At least 6 background assets registered in product_media (found ${bgMedia?.length})`);

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total: ${totalTests})`);
  console.log('==================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase16Tests();
