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
    { key: 'neon-night', name: 'Neon Night', base_config: { accent: '#7c3aed', radius: '1rem', glass: true } },
    { key: 'minimal-elegance', name: 'Minimal Elegance', base_config: { accent: '#111827', radius: '0.5rem' } },
    { key: 'dark-glass', name: 'Dark Glass', base_config: { accent: '#22d3ee', glass: true, blur: 8 } },
    { key: 'retro-card', name: 'Retro Card', base_config: { accent: '#ef4444', shadow: 'lg' } },
    { key: 'photo-hero', name: 'Photo Hero', base_config: { hero: 'photo', overlay: 0.4 } },
    { key: 'grid-menu', name: 'Grid Menu', base_config: { layout: 'grid', columns: 2 } },
    { key: 'split-panels', name: 'Split Panels', base_config: { layout: 'split', accent: '#10b981' } },
    { key: 'chalk-board', name: 'Chalk Board', base_config: { texture: 'chalk', contrast: 'high' } },
    { key: 'magazine', name: 'Magazine', base_config: { layout: 'magazine', serif: true } },
    { key: 'mono-zen', name: 'Mono Zen', base_config: { mono: true, radius: '0.25rem' } },
    { key: 'elegant-modern', name: 'Elegant Modern', base_config: { accent: '#1e293b', elegant: true, typography: 'light' } },
    { key: 'cosmic-dark', name: 'Cosmic Dark', base_config: { accent: '#a855f7', dark: true, gradient: true } },
    { key: 'glass-morphism', name: 'Glass Morphism', base_config: { accent: '#8b5cf6', glass: true, blur: 20, modern: true } },
    { key: 'luxury-gold', name: 'Luxury Gold', base_config: { accent: '#f59e0b', gold: true, elegant: true } },
    { key: 'tropical-vibes', name: 'Tropical Vibes', base_config: { accent: '#f97316', vibrant: true, warm: true } },
    { key: 'ocean-breeze', name: 'Ocean Breeze', base_config: { accent: '#06b6d4', cool: true, fresh: true } },
    { key: 'neon-gradient', name: 'Neon Gradient', base_config: { accent: '#a855f7', neon: true, animated: true } },
    { key: 'minimalist-white', name: 'Minimalist White', base_config: { accent: '#000000', minimal: true, bold: true } },
    { key: 'forest-nature', name: 'Forest Nature', base_config: { accent: '#10b981', natural: true, fresh: true } },
    { key: 'sunset-warm', name: 'Sunset Warm', base_config: { accent: '#f97316', warm: true, vibrant: true } }
  ]

  for (const template of templates) {
    const { error } = await supa
      .from('menu_templates')
      .upsert({
        key: template.key,
        name: template.name,
        preview_image_url: null,
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

