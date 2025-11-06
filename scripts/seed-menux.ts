// scripts/seed-menux.ts
// Comprehensive seed for MenuX project with 10 tenants, 10 templates, and 10 users
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !serviceKey || serviceKey === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file')
  console.error('   Please set SUPABASE_SERVICE_ROLE_KEY from Supabase Dashboard > Settings > API')
  process.exit(1)
}

const supa = createClient(url, serviceKey)

async function ensureUser(email: string, password: string, fullName: string, role: 'super_admin' | 'tenant_user') {
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
      console.log(`✓ User ${email} already exists (ID: ${userId}), updating profile...`)
    } else {
      console.log(`  Creating user: ${email}...`)
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
    const profileRole = role === 'super_admin' ? 'super_admin' : 'admin'
    const { error: profileErr } = await supa.from('profiles').upsert({
      id: userId, 
      full_name: fullName,
      app_role: role
    }, { onConflict: 'id' })
    
    if (profileErr) {
      console.error(`Profile error for ${email}:`, profileErr)
      throw profileErr
    }
    
    console.log(`✓ Profile updated for ${email} with role: ${role}`)
    return userId
  } catch (error) {
    console.error(`Error in ensureUser for ${email}:`, error)
    throw error
  }
}

async function run() {
  console.log('🌱 Starting MenuX seed...\n')

  // 1. Super Admin
  console.log('📋 Creating Super Admin...')
  const superAdminId = await ensureUser(
    'gashi449116@gmail.com', 
    '12345678', 
    'Super Admin',
    'super_admin'
  )
  console.log('')

  // 2. Cities
  console.log('🏙️  Creating cities...')
  const cities = [
    { name: 'Pristina', country_code: 'XK', region: 'Kosovo', slug: 'pristina' },
    { name: 'Tirana', country_code: 'AL', region: 'Albania', slug: 'tirana' },
    { name: 'Skopje', country_code: 'MK', region: 'North Macedonia', slug: 'skopje' },
    { name: 'Sarajevo', country_code: 'BA', region: 'Bosnia and Herzegovina', slug: 'sarajevo' },
    { name: 'Belgrade', country_code: 'RS', region: 'Serbia', slug: 'belgrade' },
    { name: 'Zagreb', country_code: 'HR', region: 'Croatia', slug: 'zagreb' },
    { name: 'Ljubljana', country_code: 'SI', region: 'Slovenia', slug: 'ljubljana' },
    { name: 'Podgorica', country_code: 'ME', region: 'Montenegro', slug: 'podgorica' },
    { name: 'Bucharest', country_code: 'RO', region: 'Romania', slug: 'bucharest' },
    { name: 'Sofia', country_code: 'BG', region: 'Bulgaria', slug: 'sofia' }
  ]

  const cityIds: Record<string, number> = {}
  for (const city of cities) {
    const { data, error } = await supa
      .from('cities')
      .upsert(city, { onConflict: 'slug' })
      .select('id')
      .single()
    
    if (error && !error.message.includes('duplicate')) {
      throw error
    }
    
    if (data) {
      cityIds[city.slug] = data.id
      console.log(`✓ City: ${city.name}`)
    }
  }
  console.log('')

  // 3. Modern Menu Templates (10 super elegant templates)
  console.log('🎨 Creating menu templates...')
  const templates = [
    {
      key: 'luxury-marble',
      name: 'Luxury Marble',
      preview_image_url: 'https://images.unsplash.com/photo-1556910099-9cf2a1b96d3d?w=800',
      base_config: {
        accent: '#1a1a1a',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        radius: '0.75rem',
        fontFamily: 'Playfair Display, serif',
        glass: false,
        shadow: 'xl',
        style: 'elegant'
      }
    },
    {
      key: 'neon-cyber',
      name: 'Neon Cyber',
      preview_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      base_config: {
        accent: '#7c3aed',
        background: '#0a0a0a',
        radius: '1rem',
        glass: true,
        blur: 12,
        neon: true,
        style: 'modern'
      }
    },
    {
      key: 'minimalist-white',
      name: 'Minimalist White',
      preview_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      base_config: {
        accent: '#111827',
        background: '#ffffff',
        radius: '0.5rem',
        fontFamily: 'Inter, sans-serif',
        minimal: true,
        style: 'clean'
      }
    },
    {
      key: 'dark-gold',
      name: 'Dark Gold',
      preview_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      base_config: {
        accent: '#d4af37',
        background: '#1a1a1a',
        radius: '0.5rem',
        gold: true,
        luxury: true,
        style: 'premium'
      }
    },
    {
      key: 'vintage-wood',
      name: 'Vintage Wood',
      preview_image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      base_config: {
        accent: '#8b4513',
        background: 'linear-gradient(180deg, #f4e4bc 0%, #d4a574 100%)',
        radius: '0.25rem',
        texture: 'wood',
        vintage: true,
        style: 'rustic'
      }
    },
    {
      key: 'ocean-breeze',
      name: 'Ocean Breeze',
      preview_image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
      base_config: {
        accent: '#06b6d4',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        radius: '1rem',
        glass: true,
        blur: 8,
        style: 'fresh'
      }
    },
    {
      key: 'sunset-warmth',
      name: 'Sunset Warmth',
      preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      base_config: {
        accent: '#f97316',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        radius: '0.75rem',
        warm: true,
        style: 'cozy'
      }
    },
    {
      key: 'monochrome-zen',
      name: 'Monochrome Zen',
      preview_image_url: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800',
      base_config: {
        accent: '#000000',
        background: '#f9fafb',
        radius: '0.25rem',
        mono: true,
        zen: true,
        style: 'minimal'
      }
    },
    {
      key: 'royal-purple',
      name: 'Royal Purple',
      preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      base_config: {
        accent: '#9333ea',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        radius: '1rem',
        royal: true,
        luxury: true,
        style: 'regal'
      }
    },
    {
      key: 'modern-glass',
      name: 'Modern Glass',
      preview_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      base_config: {
        accent: '#22d3ee',
        background: 'rgba(255, 255, 255, 0.1)',
        radius: '1.5rem',
        glass: true,
        blur: 16,
        style: 'futuristic'
      }
    }
  ]

  const templateKeys: string[] = []
  for (const template of templates) {
    const { data, error } = await supa
      .from('menu_templates')
      .upsert(template, { onConflict: 'key' })
      .select('key')
      .single()
    
    if (error && !error.message.includes('duplicate')) {
      throw error
    }
    
    if (data) {
      templateKeys.push(data.key)
      console.log(`✓ Template: ${template.name}`)
    }
  }
  console.log('')

  // 4. Tenants (10 tenants with logos)
  console.log('🏢 Creating tenants...')
  const tenants = [
    { name: 'Skyline Lounge', slug: 'skyline', city: 'pristina', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
    { name: 'Garden Café', slug: 'garden', city: 'tirana', logo: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop' },
    { name: 'Ocean View', slug: 'ocean-view', city: 'skopje', logo: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=200&fit=crop' },
    { name: 'Royal Palace', slug: 'royal-palace', city: 'sarajevo', logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop' },
    { name: 'Sunset Terrace', slug: 'sunset-terrace', city: 'belgrade', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
    { name: 'Zen Garden', slug: 'zen-garden', city: 'zagreb', logo: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=200&h=200&fit=crop' },
    { name: 'Marble Elegance', slug: 'marble-elegance', city: 'ljubljana', logo: 'https://images.unsplash.com/photo-1556910099-9cf2a1b96d3d?w=200&h=200&fit=crop' },
    { name: 'Neon Nights', slug: 'neon-nights', city: 'podgorica', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop' },
    { name: 'Vintage Corner', slug: 'vintage-corner', city: 'bucharest', logo: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop' },
    { name: 'Modern Bistro', slug: 'modern-bistro', city: 'sofia', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop' }
  ]

  const tenantIds: Record<string, string> = {}
  for (const tenant of tenants) {
    const { data, error } = await supa
      .from('tenants')
      .upsert({
        name: tenant.name,
        slug: tenant.slug,
        city_id: cityIds[tenant.city],
        logo_url: tenant.logo,
        is_active: true
      }, { onConflict: 'slug' })
      .select('id')
      .single()
    
    if (error && !error.message.includes('duplicate')) {
      throw error
    }
    
    if (data) {
      tenantIds[tenant.slug] = data.id
      console.log(`✓ Tenant: ${tenant.name}`)
      
      // Create tenant domain
      await supa
        .from('tenant_domains')
        .upsert({
          tenant_id: data.id,
          subdomain: tenant.slug,
          is_primary: true
        }, { onConflict: 'tenant_id' })
    }
  }
  console.log('')

  // 5. Users (one per tenant)
  console.log('👥 Creating tenant users...')
  const tenantUserEmails: Record<string, string> = {}
  for (const tenant of tenants) {
    const email = `${tenant.slug}.admin@menux.com`
    const fullName = `${tenant.name} Admin`
    const userId = await ensureUser(email, '12345678', fullName, 'tenant_user')
    tenantUserEmails[tenant.slug] = email
    
    // Link user to tenant
    await supa
      .from('tenant_users')
      .upsert({
        tenant_id: tenantIds[tenant.slug],
        user_id: userId,
        role: 'admin',
        is_owner: true
      }, { onConflict: 'tenant_id,user_id' })
    
    console.log(`✓ User: ${email} → ${tenant.name}`)
  }
  console.log('')

  // 6. Create menus for each tenant with their template
  console.log('📋 Creating menus for tenants...')
  for (let i = 0; i < tenants.length; i++) {
    const tenant = tenants[i]
    const templateKey = templateKeys[i]
    
    const { data: menu, error: menuError } = await supa
      .from('menus')
      .upsert({
        tenant_id: tenantIds[tenant.slug],
        name: 'Main Menu',
        slug: 'main',
        template_key: templateKey,
        is_published: true,
        is_default: true,
        design_config: {}
      }, { onConflict: 'tenant_id,slug' })
      .select('id')
      .single()
    
    if (menuError && !menuError.message.includes('duplicate')) {
      throw menuError
    }
    
    if (menu) {
      console.log(`✓ Menu for ${tenant.name} (Template: ${templateKey})`)
    }
  }
  console.log('')

  // Summary
  console.log('✅ Seed complete!\n')
  console.log('📊 Summary:')
  console.log(`   - Super Admin: gashi449116@gmail.com (password: 12345678)`)
  console.log(`   - Cities: ${cities.length}`)
  console.log(`   - Templates: ${templates.length}`)
  console.log(`   - Tenants: ${tenants.length}`)
  console.log(`   - Users: ${tenants.length} tenant admins`)
  console.log('\n📋 Tenant Users:')
  for (const tenant of tenants) {
    console.log(`   - ${tenant.name}: ${tenantUserEmails[tenant.slug]} (password: 12345678)`)
  }
  console.log('\n✨ All done! You can now login with any of the users above.')
}

run().catch((e) => { 
  console.error('❌ Seed failed:', e)
  process.exit(1) 
})

