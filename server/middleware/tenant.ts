import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Skip tenant resolution for protected routes (they don't need it)
  const path = getRequestURL(event).pathname
  if (path.startsWith('/dashboard') || path.startsWith('/super') || path.startsWith('/admin') || path.startsWith('/auth')) {
    return
  }
  
  const host = getRequestHeader(event, 'host') || ''
  
  // Extract subdomain or domain
  const parts = host.split('.')
  let lookupValue = host
  
  // If localhost, check query param
  if (host.includes('localhost')) {
    const url = getRequestURL(event)
    const devTenant = url.searchParams.get('tenant')
    if (devTenant) {
      lookupValue = devTenant
    } else {
      return // No tenant resolution for localhost without query param
    }
  }
  
  // Use public Supabase client (no auth required)
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
    config.public.supabaseAnonKey || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  
  // Try to find tenant by domain or subdomain
  const { data: tenantDomain } = await supabase
    .from('tenant_domains')
    .select('*, tenant:tenants!inner(*, city:cities(*))')
    .or(`domain.eq.${lookupValue},subdomain.eq.${lookupValue}`)
    .single()
  
  if (tenantDomain && tenantDomain.tenant) {
    // @ts-ignore
    event.context.tenant = tenantDomain.tenant
  }
})

