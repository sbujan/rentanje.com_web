-- 004_storage_bucket.sql
-- Create public storage bucket for product images

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users (admins) to upload/delete
CREATE POLICY "admin_upload_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "admin_update_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "admin_delete_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Allow anyone to read (public bucket)
CREATE POLICY "public_read_images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');
