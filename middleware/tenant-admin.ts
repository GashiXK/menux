export default defineNuxtRouteMiddleware(async (to) => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Wait for user to be available (reactive ref)
  // This is more reliable than polling getSession()
  let attempts = 0
  const maxAttempts = 30 // 3 seconds total
  
  while (!user.value && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }
  
  // If user is still not available, try to get session directly
  if (!user.value) {
    console.log('⚠️ User reactive ref not available, checking session directly...')
    const { data: { session }, error } = await client.auth.getSession()
    
    if (error || !session) {
      console.log('❌ No session found in tenant-admin middleware, redirecting to login')
    return navigateTo('/auth/login')
  }
  
    // Session exists but user ref not updated - try to refresh
    console.log('⚠️ Session exists but user ref not updated, refreshing...')
    const { data: { user: refreshedUser }, error: refreshError } = await client.auth.getUser()
    
    if (refreshError || !refreshedUser) {
      console.log('❌ Failed to get user after session check, redirecting to login')
      return navigateTo('/auth/login')
  }
  
    // User should now be available via reactive ref
  if (!user.value) {
    console.log('❌ User still not available after refresh, redirecting to login')
    return navigateTo('/auth/login')
  }
  }
  
  console.log('✅ User available in tenant-admin middleware:', user.value.id)
  
  const { currentTenantId, loadTenantForUser } = useTenant()
  
  // Check if user is super admin FIRST - super admins don't need tenant
  // Use simple API endpoint that only needs user ID
  let profile = null
  
  try {
    profile = await $fetch(`/api/auth/profile-by-id?userId=${user.value.id}`, {
      method: 'GET'
    })
    
    if (profile) {
      console.log('✅ Profile loaded successfully:', (profile as { app_role: string }).app_role)
    }
  } catch (apiError: any) {
    const errorMsg = apiError.message || apiError.statusMessage || apiError.data?.message || 'Unknown error'
    console.error('Failed to load profile:', errorMsg, `(Status: ${apiError.status || apiError.statusCode || 'N/A'})`)
    // Don't throw error immediately, try to continue
  }
  
  if (!profile) {
    console.error('❌ Could not load profile')
    console.error('User ID:', user.value.id)
    console.error('User email:', user.value.email)
    // Instead of throwing, redirect to login
    return navigateTo('/auth/login')
  }
  
  if ((profile as { app_role: string }).app_role === 'super_admin') {
    // Super admin should not be on tenant dashboard, redirect to super admin
    if (to.path.startsWith('/super')) {
      return // Already on super admin route
    }
    if (typeof window !== 'undefined') {
      window.location.replace('/super')
      return
    }
    return navigateTo('/super', { replace: true, external: true })
  }
  
  // If tenant not loaded, try to load it from user's tenant_users
  if (!currentTenantId.value) {
    await loadTenantForUser()
  }
  
  // If still no tenant, check if user has any tenant membership
  if (!currentTenantId.value) {
    // First get tenant_id from tenant_users (avoid RLS issues with join)
    const { data: membershipData, error: membershipError } = await client
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.value.id)
      .limit(1)
      .maybeSingle()
    
    if (membershipError) {
      console.error('Error loading tenant membership:', membershipError)
      console.error('Error details:', JSON.stringify(membershipError, null, 2))
      // If it's a permission error, check if user is super admin
      if (membershipError.code === 'PGRST116' || membershipError.message?.includes('permission')) {
        const { data: userProfile } = await client
          .from('profiles')
          .select('app_role')
          .eq('id', user.value.id)
          .maybeSingle()
        
        if (userProfile && (userProfile as { app_role: string }).app_role === 'super_admin') {
          return navigateTo('/super')
        }
      }
      throw createError({
        statusCode: 500,
        message: `Failed to load tenant information: ${membershipError.message || 'Unknown error'}`
      })
    }
    
    if (!membershipData || !membershipData.tenant_id) {
      // Check if user is actually a tenant user (not super admin)
      const { data: userProfile } = await client
        .from('profiles')
        .select('app_role')
        .eq('id', user.value.id)
        .maybeSingle()
      
      if (!userProfile || (userProfile as { app_role: string }).app_role !== 'super_admin') {
        throw createError({
          statusCode: 403,
          message: 'You are not assigned to any tenant. Please contact an administrator.'
        })
      }
      // If super admin somehow got here, redirect to super admin
      return navigateTo('/super')
    }
    
    // Now load the full tenant data using the tenant_id
    const { data: tenantData, error: tenantError } = await client
      .from('tenants')
      .select('*, city:cities(*)')
      .eq('id', membershipData.tenant_id)
      .maybeSingle()
    
    if (tenantError) {
      console.error('Error loading tenant data:', tenantError)
      throw createError({
        statusCode: 500,
        message: `Failed to load tenant data: ${tenantError.message}`
      })
    }
    
    if (!tenantData) {
      throw createError({
        statusCode: 404,
        message: 'Tenant not found'
      })
    }
    
    // @ts-ignore - nested relation
    const tenantState = useState<Tenant | null>('current-tenant', () => null)
    tenantState.value = tenantData as Tenant
  }
  
  // Final check - verify user is a member of the current tenant
  const finalTenantId = currentTenantId.value
  if (finalTenantId) {
    const { data: membership, error: membershipCheckError } = await client
      .from('tenant_users')
      .select('role')
      .eq('tenant_id', finalTenantId)
      .eq('user_id', user.value.id)
      .maybeSingle()
    
    if (membershipCheckError) {
      console.error('Error checking tenant membership:', membershipCheckError)
      throw createError({
        statusCode: 500,
        message: `Failed to verify tenant membership: ${membershipCheckError.message}`
      })
    }
    
    if (!membership) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized for this tenant'
      })
    }
  }
})

