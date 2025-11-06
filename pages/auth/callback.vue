<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
    <div class="text-center">
      <Icon name="heroicons:arrow-path" class="w-12 h-12 animate-spin text-brand-600 mx-auto mb-4" />
      <p class="text-neutral-600 dark:text-neutral-400">Completing authentication...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// Supabase will handle the callback and redirect
onMounted(async () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  
  // Wait for user to be available
  await new Promise(resolve => {
    const checkUser = setInterval(() => {
      if (user.value) {
        clearInterval(checkUser)
        resolve(null)
      }
    }, 100)
    
    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkUser)
      resolve(null)
    }, 5000)
  })
  
  if (user.value) {
    // Check user role to redirect appropriately
    try {
      const { data: profile } = await client
        .from('profiles')
        .select('app_role')
        .eq('id', user.value.id)
        .single()
      
      if (profile?.app_role === 'super_admin') {
        await navigateTo('/super')
      } else {
        await navigateTo('/dashboard')
      }
    } catch (e) {
      // Fallback to dashboard if profile check fails
      await navigateTo('/dashboard')
    }
  } else {
    // No user, redirect to login
    await navigateTo('/auth/login')
  }
})
</script>

