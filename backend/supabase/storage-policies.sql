-- Storage policies for 'product-images' bucket
-- Run this in Supabase SQL Editor after creating the bucket

-- 1. Allow public read access to all files in product-images bucket
CREATE POLICY "Public read access for product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- 2. Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 3. Allow users to update their own uploaded files
CREATE POLICY "Users can update own product images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Allow users to delete their own uploaded files
CREATE POLICY "Users can delete own product images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Optional: Allow sellers and admins to manage product images
-- Uncomment if you want role-based permissions
/*
CREATE POLICY "Sellers can manage product images" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);
*/
