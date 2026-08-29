import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function testSiteSettingsUpdate() {
  const { data, error } = await adminSupabase
    .from('site_settings')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()

  console.log('Update site_settings result:', data, 'error:', error)
}

testSiteSettingsUpdate()
