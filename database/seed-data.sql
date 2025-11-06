-- Template Seeds (20 modern templates)
insert into public.menu_templates (key, name, preview_image_url, base_config) values
('neon-night','Neon Night',null,'{"accent":"#7c3aed","radius":"1rem","glass":true}'),
('minimal-elegance','Minimal Elegance',null,'{"accent":"#111827","radius":"0.5rem"}'),
('dark-glass','Dark Glass',null,'{"accent":"#22d3ee","glass":true,"blur":8}'),
('retro-card','Retro Card',null,'{"accent":"#ef4444","shadow":"lg"}'),
('photo-hero','Photo Hero',null,'{"hero":"photo","overlay":0.4}'),
('grid-menu','Grid Menu',null,'{"layout":"grid","columns":2}'),
('split-panels','Split Panels',null,'{"layout":"split","accent":"#10b981"}'),
('chalk-board','Chalk Board',null,'{"texture":"chalk","contrast":"high"}'),
('magazine','Magazine',null,'{"layout":"magazine","serif":true}'),
('mono-zen','Mono Zen',null,'{"mono":true,"radius":"0.25rem"}'),
('elegant-modern','Elegant Modern',null,'{"accent":"#1e293b","elegant":true,"typography":"light"}'),
('cosmic-dark','Cosmic Dark',null,'{"accent":"#a855f7","dark":true,"gradient":true}'),
('glass-morphism','Glass Morphism',null,'{"accent":"#8b5cf6","glass":true,"blur":20,"modern":true}'),
('luxury-gold','Luxury Gold',null,'{"accent":"#f59e0b","gold":true,"elegant":true}'),
('tropical-vibes','Tropical Vibes',null,'{"accent":"#f97316","vibrant":true,"warm":true}'),
('ocean-breeze','Ocean Breeze',null,'{"accent":"#06b6d4","cool":true,"fresh":true}'),
('neon-gradient','Neon Gradient',null,'{"accent":"#a855f7","neon":true,"animated":true}'),
('minimalist-white','Minimalist White',null,'{"accent":"#000000","minimal":true,"bold":true}'),
('forest-nature','Forest Nature',null,'{"accent":"#10b981","natural":true,"fresh":true}'),
('sunset-warm','Sunset Warm',null,'{"accent":"#f97316","warm":true,"vibrant":true}')
on conflict (key) do nothing;

-- Cities
insert into public.cities (name, country_code, region, slug)
values ('Pristina','XK','Kosovo','pristina'),
       ('Tirana','AL','Albania','tirana'),
       ('Skopje','MK','North Macedonia','skopje')
on conflict (slug) do nothing;

-- Tenants
insert into public.tenants (name, slug, city_id, logo_url, is_active)
select 'Skyline Lounge','skyline',
       (select id from public.cities where slug='pristina'), null, true
where not exists (select 1 from public.tenants where slug='skyline');

insert into public.tenants (name, slug, city_id, logo_url, is_active)
select 'Garden Café','garden',
       (select id from public.cities where slug='tirana'), null, true
where not exists (select 1 from public.tenants where slug='garden');

-- Tenant Domains (example placeholders)
insert into public.tenant_domains (tenant_id, domain, subdomain, is_primary)
select id, null, 'skyline', true from public.tenants where slug='skyline'
on conflict do nothing;

insert into public.tenant_domains (tenant_id, domain, subdomain, is_primary)
select id, null, 'garden', true from public.tenants where slug='garden'
on conflict do nothing;

-- Menus
insert into public.menus (tenant_id, name, slug, template_key, is_published, is_default, design_config)
select id, 'Main Menu', 'main', 'neon-night', true, true, '{}'::jsonb
from public.tenants where slug='skyline'
on conflict do nothing;

insert into public.menus (tenant_id, name, slug, template_key, is_published, is_default, design_config)
select id, 'Main Menu', 'main', 'minimal-elegance', true, true, '{}'::jsonb
from public.tenants where slug='garden'
on conflict do nothing;

-- Categories & Items for Skyline
with skyline_menu as (
  select m.id mid, t.id tid from public.menus m
  join public.tenants t on t.id = m.tenant_id
  where t.slug='skyline' and m.slug='main'
)
insert into public.categories (menu_id, tenant_id, name, description, sort_order, is_special)
select mid, tid, 'Cocktails', 'Signature drinks', 1, false from skyline_menu
union all
select mid, tid, 'Bites', 'Small plates', 2, false from skyline_menu
on conflict do nothing;

with skyline as (
  select c.id cid, c.tenant_id tid
  from public.categories c
  join public.menus m on m.id = c.menu_id
  join public.tenants t on t.id = m.tenant_id
  where t.slug='skyline' and m.slug='main' and c.name='Cocktails'
)
insert into public.menu_items (category_id, tenant_id, name, description, price, tags)
select cid, tid, 'Violet Breeze','Lavender gin, tonic, citrus', 7.50, array['signature','alcohol']
from skyline
on conflict do nothing;

-- Categories & Items for Garden
with garden_menu as (
  select m.id mid, t.id tid from public.menus m
  join public.tenants t on t.id = m.tenant_id
  where t.slug='garden' and m.slug='main'
)
insert into public.categories (menu_id, tenant_id, name, description, sort_order, is_special)
select mid, tid, 'Coffee', 'Fresh roasts', 1, false from garden_menu
union all
select mid, tid, 'Desserts', 'Daily baked', 2, false from garden_menu
on conflict do nothing;

with garden as (
  select c.id cid, c.tenant_id tid
  from public.categories c
  join public.menus m on m.id = c.menu_id
  join public.tenants t on t.id = m.tenant_id
  where t.slug='garden' and m.slug='main' and c.name='Coffee'
)
insert into public.menu_items (category_id, tenant_id, name, description, price, tags)
select cid, tid, 'Flat White','Double shot espresso with velvety milk', 2.80, array['coffee']
from garden
on conflict do nothing;

