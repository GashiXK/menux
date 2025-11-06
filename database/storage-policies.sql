-- Storage bucket policies for Supabase
-- Run these in Supabase SQL Editor after creating the buckets

-- Create buckets (via Supabase Dashboard → Storage)
-- 1. logos
-- 2. menu-images
-- 3. ads-media
-- 4. qr-codes

-- Policies for 'logos' bucket
-- Allow public read
create policy "Public read logos"
on storage.objects for select
using ( bucket_id = 'logos' );

-- Allow authenticated insert/update/delete (tenant admins)
create policy "Authenticated insert logos"
on storage.objects for insert
with check (
  bucket_id = 'logos'
  and auth.role() = 'authenticated'
);

create policy "Authenticated update logos"
on storage.objects for update
using (
  bucket_id = 'logos'
  and auth.role() = 'authenticated'
);

create policy "Authenticated delete logos"
on storage.objects for delete
using (
  bucket_id = 'logos'
  and auth.role() = 'authenticated'
);

-- Policies for 'menu-images' bucket
-- Allow public read
create policy "Public read menu images"
on storage.objects for select
using ( bucket_id = 'menu-images' );

-- Allow authenticated insert/update/delete
create policy "Authenticated insert menu images"
on storage.objects for insert
with check (
  bucket_id = 'menu-images'
  and auth.role() = 'authenticated'
);

create policy "Authenticated update menu images"
on storage.objects for update
using (
  bucket_id = 'menu-images'
  and auth.role() = 'authenticated'
);

create policy "Authenticated delete menu images"
on storage.objects for delete
using (
  bucket_id = 'menu-images'
  and auth.role() = 'authenticated'
);

-- Policies for 'ads-media' bucket
-- Allow public read
create policy "Public read ads media"
on storage.objects for select
using ( bucket_id = 'ads-media' );

-- Allow only super admins to insert/update/delete
create policy "Super admin insert ads media"
on storage.objects for insert
with check (
  bucket_id = 'ads-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and app_role = 'super_admin'
  )
);

create policy "Super admin update ads media"
on storage.objects for update
using (
  bucket_id = 'ads-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and app_role = 'super_admin'
  )
);

create policy "Super admin delete ads media"
on storage.objects for delete
using (
  bucket_id = 'ads-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and app_role = 'super_admin'
  )
);

-- Policies for 'qr-codes' bucket
-- Allow public read
create policy "Public read qr codes"
on storage.objects for select
using ( bucket_id = 'qr-codes' );

-- Allow authenticated insert/update/delete
create policy "Authenticated insert qr codes"
on storage.objects for insert
with check (
  bucket_id = 'qr-codes'
  and auth.role() = 'authenticated'
);

create policy "Authenticated update qr codes"
on storage.objects for update
using (
  bucket_id = 'qr-codes'
  and auth.role() = 'authenticated'
);

create policy "Authenticated delete qr codes"
on storage.objects for delete
using (
  bucket_id = 'qr-codes'
  and auth.role() = 'authenticated'
);

