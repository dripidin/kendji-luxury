-- Create "kendji-media" storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kendji-media', 'kendji-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the bucket
-- Allow public read access
CREATE POLICY "Public media is viewable by everyone." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'kendji-media');

-- Allow authenticated users to upload, update, and delete
CREATE POLICY "Authenticated admins can insert media." 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'kendji-media');

CREATE POLICY "Authenticated admins can update media." 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'kendji-media');

CREATE POLICY "Authenticated admins can delete media." 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'kendji-media');
