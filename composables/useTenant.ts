import type { Tenant, TenantDomain } from '~/types/database'

export const useTenant = () => {
  const { client } = useSupabaseClientStrict()
  const route = useRoute()
  const user = useSupabaseUser()
  
  // Get tenant from server context (set by middleware)
  const tenant = useState<Tenant | null>('current-tenant', () => null)
  
  // Load tenant for logged-in user from tenant_users
  const loadTenantForUser = async () => {
    if (!user.value) return null
    
    try {
      // Check if user is super admin first
      // Use maybeSingle() to handle cases where profile might not exist
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('app_role')
        .eq('id', user.value.id)
        .maybeSingle()
      
      if (profileError) {
        console.error('Error loading profile:', profileError)
        return null
      }
      
      if (!profile) {
        console.warn('Profile not found for user:', user.value.id)
        return null
      }
      
      if (profile?.app_role === 'super_admin') {
        // Super admin doesn't need tenant
        return null
      }
      
      // Get any tenant membership (admin, editor, or viewer)
      // Use .select() instead of .select('tenant:tenants!inner(*)') to avoid RLS issues
      const { data: membershipList, error: membershipError } = await client
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', user.value.id)
        .limit(1)
      
      if (membershipError) {
        console.error('Error loading tenant membership:', membershipError)
        console.error('Error code:', membershipError.code)
        console.error('Error message:', membershipError.message)
        return null
      }
      
      if (!membershipList || membershipList.length === 0) {
        console.warn('No tenant membership found for user:', user.value.id)
        return null
      }
      
      const tenantId = membershipList[0].tenant_id
      
      // Now load the full tenant data
      const { data: tenantData, error: tenantError } = await client
        .from('tenants')
        .select('*, city:cities(*)')
        .eq('id', tenantId)
        .single()
      
      if (tenantError || !tenantData) {
        console.error('Error loading tenant data:', tenantError)
        return null
      }
      
      tenant.value = tenantData as Tenant
      return tenantData as Tenant
    } catch (e) {
      console.error('Failed to load tenant for user', e)
      return null
    }
  }
  
  const loadTenantBySlug = async (slug: string) => {
    const { data, error } = await client
      .from('tenants')
      .select('*, city:cities(*), domains:tenant_domains(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      
    if (error) throw error
    tenant.value = data as Tenant
    return data as Tenant
  }
  
  const loadTenantByDomain = async (domain: string) => {
    const { data: domainData, error: domainError } = await client
      .from('tenant_domains')
      .select('*, tenant:tenants!inner(*, city:cities(*))')
      .or(`domain.eq.${domain},subdomain.eq.${domain}`)
      .single()
      
    if (domainError) throw domainError
    
    // @ts-ignore - nested relation
    tenant.value = domainData.tenant
    // @ts-ignore
    return domainData.tenant as Tenant
  }
  
  const currentTenantId = computed(() => tenant.value?.id)
  const currentTenantSlug = computed(() => tenant.value?.slug)
  
  return {
    tenant,
    currentTenantId,
    currentTenantSlug,
    loadTenantForUser,
    loadTenantBySlug,
    loadTenantByDomain
  }
}

