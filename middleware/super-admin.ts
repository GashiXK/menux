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
      console.log('❌ No session found in super-admin middleware, redirecting to login')
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
  
  console.log('✅ User available in super-admin middleware:', user.value.id)
  
  // Check if user has super_admin role
  // Use simple API endpoint that only needs user ID
  let profile = null
  
  try {
    profile = await $fetch(`/api/auth/profile-by-id?userId=${user.value.id}`, {
      method: 'GET'
    })
    
    if (profile) {
      console.log('✅ Profile loaded successfully:', profile.app_role)
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
  
  if (!profile || profile.app_role !== 'super_admin') {
    // Not super admin, redirect to dashboard
    if (to.path.startsWith('/dashboard')) {
      return // Already on dashboard route
    }
    if (typeof window !== 'undefined') {
      window.location.replace('/dashboard')
      return
    }
    return navigateTo('/dashboard', { replace: true })
  }
})

