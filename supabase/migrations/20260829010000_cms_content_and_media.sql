-- Phase 16: CMS Content Management & Media Library

-- 1. Expand product_media table to support brand/background/editorial media and alt text
ALTER TABLE product_media DROP CONSTRAINT IF EXISTS product_media_role_check;
ALTER TABLE product_media ADD CONSTRAINT product_media_role_check CHECK (role IN ('COVER', 'GALLERY', 'DETAIL', 'VARIANT', 'LIFESTYLE', 'BACKGROUND', 'EDITORIAL'));

ALTER TABLE product_media ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE product_media ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE product_media ALTER COLUMN product_id DROP NOT NULL;

-- 2. Site settings & Homepage content JSONB
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS homepage_content JSONB DEFAULT '{}'::jsonb;

-- 3. Upsert default site settings singleton
INSERT INTO site_settings (id, brand_name, default_currency, homepage_content)
VALUES (1, 'KenDji Luxury', 'DZD', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. Ensure RLS policies for site_settings & product_media
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings" ON site_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
CREATE POLICY "Admins can update site settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
