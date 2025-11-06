-- === Extensions ===
create extension if not exists pgcrypto;

-- === Enums ===
do $$ begin
  create type app_role as enum ('super_admin','tenant_user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tenant_role as enum ('admin','editor','viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ad_scope as enum ('all_pages','menu','category','item');
exception when duplicate_object then null; end $$;

-- === Helper Functions (RLS) ===
create or replace function public.is_super_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid() and p.app_role = 'super_admin'
  );
$$;

create or replace function public.is_tenant_member(t uuid)
returns boolean
language sql stable
as $$
  select exists(
    select 1 from public.tenant_users tu
    where tu.user_id = auth.uid() and tu.tenant_id = t
  );
$$;

create or replace function public.is_tenant_admin(t uuid)
returns boolean
language sql stable
as $$
  select exists(
    select 1 from public.tenant_users tu
    where tu.user_id = auth.uid()
      and tu.tenant_id = t
      and tu.role in ('admin','editor')
  );
$$;

-- === Core Tables ===

create table if not exists public.cities (
  id bigserial primary key,
  name text not null,
  country_code text,
  region text,
  slug text unique,
  created_at timestamptz default now()
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city_id bigint references public.cities(id) on delete set null,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.tenant_domains (
  id bigserial primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  domain text,           -- full domain like example.com or tenant.example.com
  subdomain text,        -- e.g., skyline
  is_primary boolean default false,
  unique(domain),
  created_at timestamptz default now()
);

-- Profiles linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  app_role app_role not null default 'tenant_user',
  created_at timestamptz default now()
);

create table if not exists public.tenant_users (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role tenant_role not null default 'admin',
  is_owner boolean not null default false,
  created_at timestamptz default now(),
  primary key (tenant_id, user_id)
);

-- Menu templates + menus
create table if not exists public.menu_templates (
  id serial primary key,
  key text unique not null,
  name text not null,
  preview_image_url text,
  base_config jsonb not null default '{}'
);

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  template_key text references public.menu_templates(key),
  design_config jsonb not null default '{}',
  is_published boolean not null default false,
  is_default boolean not null default false,
  created_at timestamptz default now(),
  unique (tenant_id, slug)
);

-- Categories + items
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  sort_order int default 0,
  is_special boolean not null default false,
  visible boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  currency text not null default 'EUR',
  tags text[],
  image_url text,
  is_active boolean not null default true,
  sort_order int default 0,
  attributes jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.item_variants (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.menu_items(id) on delete cascade,
  name text not null,
  price_delta numeric(10,2) not null default 0,
  attributes jsonb not null default '{}'
);

-- Customizable tenant texts (headings, paragraphs, labels)
create table if not exists public.custom_texts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  key text not null,
  value text not null,
  locale text not null default 'en',
  unique (tenant_id, key, locale)
);

-- QR codes
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  menu_id uuid not null references public.menus(id) on delete cascade,
  url text not null,
  image_url text,
  created_at timestamptz default now()
);

-- Advertisements + targets
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  media_url text,
  link_url text,
  created_by uuid references public.profiles(id) on delete set null,
  start_time timestamptz,
  end_time timestamptz,
  priority int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.ad_targets (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  city_id bigint references public.cities(id) on delete cascade,
  scope ad_scope not null default 'all_pages',
  page_path text -- optional for finer granularity if scope = category/item
);

-- === Indexes ===
create index if not exists idx_tenants_slug on public.tenants(slug);
create index if not exists idx_tenant_domains_tenant on public.tenant_domains(tenant_id);
create index if not exists idx_menus_tenant on public.menus(tenant_id);
create index if not exists idx_categories_menu on public.categories(menu_id);
create index if not exists idx_items_category on public.menu_items(category_id);
create index if not exists idx_ads_active_time on public.ads(active, start_time, end_time);
create index if not exists idx_ad_targets on public.ad_targets(tenant_id, city_id, scope);

-- === RLS ===
alter table public.cities enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_domains enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_users enable row level security;
alter table public.menu_templates enable row level security;
alter table public.menus enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.item_variants enable row level security;
alter table public.custom_texts enable row level security;
alter table public.qr_codes enable row level security;
alter table public.ads enable row level security;
alter table public.ad_targets enable row level security;

-- Public read policies (for menus and ads):
create policy if not exists "public_read_cities" on public.cities
  for select using (true);

create policy if not exists "public_read_published_menus" on public.menus
  for select using (is_published = true);

create policy if not exists "public_read_published_categories" on public.categories
  for select using (
    exists(select 1 from public.menus m where m.id = menu_id and m.is_published = true)
  );

create policy if not exists "public_read_active_items" on public.menu_items
  for select using (
    is_active = true
    and exists(select 1 from public.categories c join public.menus m on m.id = c.menu_id
               where c.id = category_id and m.is_published = true)
  );

create policy if not exists "public_read_ads" on public.ads
  for select using (active = true);

create policy if not exists "public_read_ad_targets" on public.ad_targets
  for select using (true);

-- Authenticated self-access + role-based access:
create policy if not exists "profiles_self_and_super" on public.profiles
  for select using (id = auth.uid() or is_super_admin());
create policy if not exists "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

-- Tenants: super admin full; tenant admins see their own
create policy if not exists "tenants_super_admin_all" on public.tenants
  for all using (is_super_admin());
create policy if not exists "tenants_admin_read" on public.tenants
  for select using (is_tenant_member(id));
create policy if not exists "tenants_admin_update" on public.tenants
  for update using (is_tenant_admin(id));

-- tenant_domains: super admin full; tenant admins can read theirs
create policy if not exists "tenant_domains_super_admin_all" on public.tenant_domains
  for all using (is_super_admin());
create policy if not exists "tenant_domains_admin_read" on public.tenant_domains
  for select using (is_tenant_member(tenant_id));

-- tenant_users: only super admin can manage; tenant admins can read their membership
create policy if not exists "tenant_users_super_admin_all" on public.tenant_users
  for all using (is_super_admin());
create policy if not exists "tenant_users_admin_read" on public.tenant_users
  for select using (is_tenant_member(tenant_id));

-- menus/categories/items/variants/texts/qr: tenant admins manage their own
create policy if not exists "menus_admin_all" on public.menus
  for all using (is_super_admin() or is_tenant_admin(tenant_id));

create policy if not exists "categories_admin_all" on public.categories
  for all using (is_super_admin() or is_tenant_admin(tenant_id));

create policy if not exists "items_admin_all" on public.menu_items
  for all using (is_super_admin() or is_tenant_admin(tenant_id));

create policy if not exists "variants_admin_all" on public.item_variants
  for all using (
    is_super_admin() or exists (
      select 1 from public.menu_items i where i.id = item_id and is_tenant_admin(i.tenant_id)
    )
  );

create policy if not exists "texts_admin_all" on public.custom_texts
  for all using (is_super_admin() or is_tenant_admin(tenant_id));

create policy if not exists "qr_admin_all" on public.qr_codes
  for all using (is_super_admin() or is_tenant_admin(tenant_id));

-- ads/ad_targets: super admin manages; public reads (already set)
create policy if not exists "ads_super_admin_all" on public.ads
  for all using (is_super_admin());

create policy if not exists "ad_targets_super_admin_all" on public.ad_targets
  for all using (is_super_admin());

-- Templates: readable by all; managed by super admin
create policy if not exists "templates_read_all" on public.menu_templates
  for select using (true);
create policy if not exists "templates_super_admin_write" on public.menu_templates
  for all using (is_super_admin());

