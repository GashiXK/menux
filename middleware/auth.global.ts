export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for public routes
  const publicPaths = ['/', '/demo', '/main', '/auth/login', '/auth/callback', '/auth/reset-password']
  const isPublicPath = publicPaths.includes(to.path)
  
  // Check if it's a menu route (single segment that's not a protected path)
  const pathSegments = to.path.split('/').filter(Boolean)
  const isMenuRoute = pathSegments.length === 1 && !to.path.startsWith('/dashboard') && !to.path.startsWith('/super') && !to.path.startsWith('/admin')
  
  if (isPublicPath || isMenuRoute) {
    return // Allow public access
  }
  
  const user = useSupabaseUser()
  
  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/super', '/admin']
  const isProtected = protectedPaths.some(path => to.path.startsWith(path))
  
  if (isProtected && !user.value) {
    return navigateTo('/auth/login')
  }
})

