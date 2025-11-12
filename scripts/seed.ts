// scripts/seed.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supa = createClient(url, serviceKey)

async function ensureUser(email: string, password: string, role: 'super_admin'|'tenant_user') {
  try {
    const { data: existing, error: listError } = await supa.auth.admin.listUsers({ page: 1, perPage: 1000 })
    
    if (listError) {
      console.error('Error listing users:', listError)
      throw listError
    }
    
    const found = existing?.users?.find(u => u.email === email)
    
    let userId: string
    if (found) {
      userId = found.id
      console.log(`User ${email} already exists (ID: ${userId}), updating profile...`)
    } else {
      console.log(`Creating new user: ${email}...`)
      const result = await supa.auth.admin.createUser({
        email, 
        email_confirm: true, 
        password
      })
      
      if (result.error) {
        console.error('Error creating user:', result.error)
        throw result.error
      }
      
      if (!result.data?.user) {
        throw new Error(`Failed to create user: ${email} - no user data returned`)
      }
      
      userId = result.data.user.id
      console.log(`✓ Created user: ${email} (ID: ${userId})`)
    }

    // upsert profile
    const profileRole = role === 'super_admin' ? 'super_admin' : 'tenant_user'
    const { error: profileErr } = await supa.from('profiles').upsert({
      id: userId, 
      full_name: email.split('@')[0], 
      app_role: profileRole
    }, { onConflict: 'id' })
    
    if (profileErr) {
      console.error(`Profile error for ${email}:`, profileErr)
      throw profileErr
    }
    
    console.log(`✓ Profile updated for ${email} with role: ${profileRole}`)
    return userId
  } catch (error) {
    console.error(`Error in ensureUser for ${email}:`, error)
    throw error
  }
}``

async function seedTemplates() {
  console.log('Seeding menu templates...')
  
  const templates = [
    {
      key: 'neon-night',
      name: 'Neon Night',
      preview_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#7c3aed', radius: '1rem', glass: true }
    },
    {
      key: 'minimal-elegance',
      name: 'Minimal Elegance',
      preview_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#111827', radius: '0.5rem' }
    },
    {
      key: 'dark-glass',
      name: 'Dark Glass',
      preview_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#22d3ee', glass: true, blur: 8 }
    },
    {
      key: 'retro-card',
      name: 'Retro Card',
      preview_image_url: 'https://images.unsplash.com/photo-1533777419517-3e4017e2e15d?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#ef4444', shadow: 'lg' }
    },
    {
      key: 'photo-hero',
      name: 'Photo Hero',
      preview_image_url: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=1200&q=80',
      base_config: { hero: 'photo', overlay: 0.4 }
    },
    {
      key: 'grid-menu',
      name: 'Grid Menu',
      preview_image_url: 'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80',
      base_config: { layout: 'grid', columns: 2 }
    },
    {
      key: 'split-panels',
      name: 'Split Panels',
      preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      base_config: { layout: 'split', accent: '#10b981' }
    },
    {
      key: 'elegant-modern',
      name: 'Elegant Modern',
      preview_image_url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#1e293b', elegant: true, typography: 'light' }
    },
    {
      key: 'aurora-luxe',
      name: 'Aurora Luxe',
      preview_image_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#38bdf8', gradient: 'aurora', mode: 'dark' }
    },
    {
      key: 'modern-bento',
      name: 'Modern Bento',
      preview_image_url: 'https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#0ea5e9', layout: 'bento', cards: true }
    },
    {
      key: 'pastel-dream',
      name: 'Pastel Dream',
      preview_image_url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#f472b6', pastel: true, serif: true }
    },
    {
      key: 'ember-noir',
      name: 'Ember Noir',
      preview_image_url: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#f97316', dark: true, ember: true }
    },
    {
      key: 'botanical-garden',
      name: 'Botanical Garden',
      preview_image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#047857', organic: true, fresh: true }
    },
    {
      key: 'nordic-slate',
      name: 'Nordic Slate',
      preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#38bdf8', mode: 'dark', layout: 'slate' }
    },
    {
      key: 'neo-brutalist',
      name: 'Neo Brutalist',
      preview_image_url: 'https://images.unsplash.com/photo-1529180979161-05b6dd0ebb62?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#ef4444', blocks: true, high_contrast: true }
    },
    {
      key: 'holographic-wave',
      name: 'Holographic Wave',
      preview_image_url: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#a855f7', glass: true, glow: true }
    },
    {
      key: 'velvet-dusk',
      name: 'Velvet Dusk',
      preview_image_url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#f973c5', palette: 'velvet', mood: 'twilight' }
    },
    {
      key: 'celestial-ink',
      name: 'Celestial Ink',
      preview_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#38bdf8', palette: 'midnight', mood: 'immersive' }
    },
    {
      key: 'gilded-art-deco',
      name: 'Gilded Art Deco',
      preview_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#d4af37', style: 'art_deco', luxury: true }
    },
    {
      key: 'savanna-sunset',
      name: 'Savanna Sunset',
      preview_image_url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#ff6b35', palette: 'sunset', warm: true }
    },
    {
      key: 'coastal-zen',
      name: 'Coastal Zen',
      preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      base_config: { accent: '#0284c7', palette: 'coastal', fresh: true }
    }
  ]

  for (const template of templates) {
    const { error } = await supa
      .from('menu_templates')
      .upsert({
        key: template.key,
        name: template.name,
        preview_image_url: template.preview_image_url,
        base_config: template.base_config
      }, { onConflict: 'key' })
    
    if (error) {
      console.error(`Error seeding template ${template.key}:`, error)
    } else {
      console.log(`✓ Seeded template: ${template.name}`)
    }
  }
  
  console.log(`✓ Seeded ${templates.length} menu templates\n`)
}

async function run() {
  // Seed templates first
  await seedTemplates()

  // Super Admin
  const superAdminId = await ensureUser('gashi449116@gmail.com', '12345678', 'super_admin')

  // Tenant admins
  const skylineAdminId = await ensureUser('skyline.admin@example.com', 'ChangeMe#1', 'tenant_user')
  const gardenAdminId  = await ensureUser('garden.admin@example.com',  'ChangeMe#1', 'tenant_user')

  // Map admins to tenants
  const { data: skyline } = await supa.from('tenants').select('id').eq('slug','skyline').single()
  const { data: garden  } = await supa.from('tenants').select('id').eq('slug','garden').single()

  if (!skyline || !garden) throw new Error('Tenants not seeded properly')

  await supa.from('tenant_users').upsert([
    { tenant_id: skyline.id, user_id: skylineAdminId, role: 'admin', is_owner: true },
    { tenant_id: garden.id,  user_id: gardenAdminId,  role: 'admin', is_owner: true },
  ])

  // Sample ads targeted by city and tenant
  const { data: pristina } = await supa.from('cities').select('id').eq('slug','pristina').single()
  if (!pristina) {
    throw new Error('City pristina must exist before seeding ad targets')
  }
  const { data: ad1, error: adErr } = await supa.from('ads').insert([{
    title: 'City Night Promo',
    body: '2x1 cocktails this weekend',
    priority: 10,
    active: true,
    start_time: new Date().toISOString(),
    end_time: null,
    created_by: superAdminId
  }]).select('*').single()
  if (adErr) throw adErr

  await supa.from('ad_targets').insert([
    { ad_id: ad1.id, city_id: pristina.id, scope: 'all_pages' }
  ])

  console.log('✓ Seed complete.')
}

run().catch((e) => { console.error(e); process.exit(1) })

