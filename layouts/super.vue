<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <header class="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-6">
            <NuxtLink to="/super" class="flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-xl group-hover:shadow-brand-500/40 transition-all">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white" />
              </div>
              <span class="text-2xl font-bold text-ink-900 dark:text-white group-hover:text-brand-500 transition-colors">
                MenuX Super Admin
              </span>
            </NuxtLink>
          </div>
          
          <nav class="flex items-center gap-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.path)
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-brand-500 dark:hover:text-brand-400'
              ]"
            >
              {{ item.label }}
            </NuxtLink>
            
            <button
              @click="handleLogout"
              class="ml-4 px-4 py-2 rounded-xl text-sm font-medium text-ink-600 dark:text-ink-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 flex items-center gap-2"
            >
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()
const toast = useToast()

const navItems = [
  { label: 'Dashboard', path: '/super' },
  { label: 'Tenants', path: '/super/tenants' },
  { label: 'Users', path: '/super/users' },
  { label: 'Cities', path: '/super/cities' },
  { label: 'Ads', path: '/super/ads' },
  { label: 'Templates', path: '/super/templates' }
]

const isActive = (path: string) => {
  if (path === '/super') {
    return route.path === '/super'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  try {
    await client.auth.signOut()
    toast.add({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
    await router.push('/auth/login')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: 'Failed to logout. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}
</script>
