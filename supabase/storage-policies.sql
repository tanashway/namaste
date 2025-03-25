-- Enable storage by creating the storage schema if it doesn't exist
create schema if not exists storage;

-- Create storage.objects table if it doesn't exist
create table if not exists storage.objects (
    id uuid primary key,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_accessed_at timestamptz default now(),
    metadata jsonb default '{}'::jsonb
);

-- Drop existing policies if any
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Anyone can upload memes" on storage.objects;
drop policy if exists "Anyone can update their own memes" on storage.objects;
drop policy if exists "Anyone can delete memes" on storage.objects;

-- Create a simple public bucket
insert into storage.buckets (id, name, public)
values ('memes', 'memes', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Create a simple public policy
create policy "Public CRUD Access"
on storage.objects for all
using ( bucket_id = 'memes' )
with check ( bucket_id = 'memes' );

-- Grant permissions
grant usage on schema storage to anon;
grant all on storage.objects to anon;
grant all on storage.buckets to anon; 