export default defineNuxtPlugin(() => {
  const router = useRouter()
  
  // Override Supabase redirect behavior for menu routes
  router.beforeEach((to) => {
    // If it's a menu route (single segment), skip any auth checks
    const pathSegments = to.path.split('/').filter(Boolean)
    const protectedPaths = ['/dashboard', '/super', '/admin', '/auth']
    const isProtected = protectedPaths.some(p => to.path.startsWith(p))
    
    // Menu routes are public (single segment that's not protected)
    if (pathSegments.length === 1 && !isProtected) {
      // Allow navigation without auth
      return true
    }
    
    // For other routes, let default behavior handle it
    return true
  })
})

