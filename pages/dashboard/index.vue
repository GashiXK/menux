<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p class="text-ink-600 dark:text-ink-300 text-lg">
          Manage your menu and track your restaurant's performance
        </p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid md:grid-cols-3 gap-6">
        <NuxtLink to="/dashboard/categories" class="group">
          <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
            <div class="text-center">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-white" />
              </div>
              <div v-if="loading" class="h-8 w-20 bg-ink-200 dark:bg-ink-700 rounded mx-auto mb-2 animate-pulse"></div>
              <h3 v-else class="text-3xl font-bold text-ink-900 dark:text-white mb-2">{{ stats.categories }}</h3>
              <p class="text-ink-500 dark:text-ink-400 font-medium">Categories</p>
            </div>
          </div>
        </NuxtLink>
        
        <NuxtLink to="/dashboard/items" class="group">
          <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
            <div class="text-center">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UIcon name="i-heroicons-shopping-bag" class="w-8 h-8 text-white" />
              </div>
              <div v-if="loading" class="h-8 w-20 bg-ink-200 dark:bg-ink-700 rounded mx-auto mb-2 animate-pulse"></div>
              <h3 v-else class="text-3xl font-bold text-ink-900 dark:text-white mb-2">{{ stats.items }}</h3>
              <p class="text-ink-500 dark:text-ink-400 font-medium">Menu Items</p>
            </div>
          </div>
        </NuxtLink>
        
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300 h-full">
          <div class="text-center">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 mx-auto mb-4">
              <UIcon name="i-heroicons-eye" class="w-8 h-8 text-white" />
            </div>
            <div v-if="loading" class="h-8 w-20 bg-ink-200 dark:bg-ink-700 rounded mx-auto mb-2 animate-pulse"></div>
            <div v-else>
              <button
                @click="togglePublishStatus"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-80 mb-2',
                  menu?.is_published
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-400'
                ]"
              >
                {{ menu?.is_published ? 'Live' : 'Draft' }}
              </button>
            </div>
            <p class="text-ink-500 dark:text-ink-400 font-medium">Menu Status</p>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800">
        <h2 class="text-2xl font-bold text-ink-900 dark:text-white mb-6">Quick Actions</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <NuxtLink to="/dashboard/categories" class="group">
            <div class="bg-ink-50 dark:bg-ink-800 rounded-xl p-6 border border-ink-200 dark:border-ink-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-500/50 transition-all duration-200 cursor-pointer h-full">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
                  <UIcon name="i-heroicons-folder" class="w-6 h-6 text-brand-500" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-ink-900 dark:text-white mb-1">Manage Categories</h3>
                  <p class="text-sm text-ink-600 dark:text-ink-400">Add, edit, or organize menu categories</p>
                </div>
              </div>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/items" class="group">
            <div class="bg-ink-50 dark:bg-ink-800 rounded-xl p-6 border border-ink-200 dark:border-ink-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-500/50 transition-all duration-200 cursor-pointer h-full">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
                  <UIcon name="i-heroicons-squares-plus" class="w-6 h-6 text-brand-500" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-ink-900 dark:text-white mb-1">Manage Items</h3>
                  <p class="text-sm text-ink-600 dark:text-ink-400">Update menu items and prices</p>
                </div>
              </div>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/design" class="group">
            <div class="bg-ink-50 dark:bg-ink-800 rounded-xl p-6 border border-ink-200 dark:border-ink-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-500/50 transition-all duration-200 cursor-pointer h-full">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
                  <UIcon name="i-heroicons-paint-brush" class="w-6 h-6 text-brand-500" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-ink-900 dark:text-white mb-1">Customize Design</h3>
                  <p class="text-sm text-ink-600 dark:text-ink-400">Choose templates and colors</p>
                </div>
              </div>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/qr" class="group">
            <div class="bg-ink-50 dark:bg-ink-800 rounded-xl p-6 border border-ink-200 dark:border-ink-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-500/50 transition-all duration-200 cursor-pointer h-full">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
                  <UIcon name="i-heroicons-qr-code" class="w-6 h-6 text-brand-500" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-ink-900 dark:text-white mb-1">QR Code</h3>
                  <p class="text-sm text-ink-600 dark:text-ink-400">Generate and download QR codes</p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const { currentTenantId } = useTenant()
const { listMenusByTenant } = useMenu()
const { client } = useSupabaseClientStrict()
const toast = useToast()

const menu = ref()
const loading = ref(true)
const stats = reactive({
  categories: 0,
  items: 0
})

onMounted(async () => {
  if (!currentTenantId.value) {
    loading.value = false
    toast.add({
      title: 'Warning',
      description: 'No tenant information available. Please contact support.',
      color: 'yellow',
      icon: 'i-heroicons-exclamation-triangle',
      timeout: 5000
    })
    return
  }
  
  try {
    const menus = await listMenusByTenant(currentTenantId.value)
    menu.value = menus.find(m => m.is_default) || menus[0]
    
    if (menu.value) {
      await loadStats()
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load dashboard data. Please refresh the page.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
})

const togglePublishStatus = async () => {
  if (!menu.value || !currentTenantId.value) return
  
  const newStatus = !menu.value.is_published
  const loadingToast = toast.add({
    title: 'Updating...',
    description: `Setting menu to ${newStatus ? 'published' : 'draft'}`,
    color: 'primary',
    icon: 'i-heroicons-arrow-path',
    timeout: 0
  })
  
  try {
    const { error } = await client
      .from('menus')
      .update({ is_published: newStatus })
      .eq('id', menu.value.id)
    
    if (error) throw error
    
    menu.value.is_published = newStatus
    toast.remove(loadingToast)
    toast.add({
      title: 'Success',
      description: `Menu is now ${newStatus ? 'published' : 'draft'}`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.remove(loadingToast)
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update menu status',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const loadStats = async () => {
  if (!currentTenantId.value || !menu.value) return
  
  try {
    const [catResult, itemResult] = await Promise.all([
      client
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('menu_id', menu.value.id),
      client
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', currentTenantId.value)
    ])
    
    if (catResult.error) {
      console.error('Error loading category count:', catResult.error)
    } else {
      stats.categories = catResult.count || 0
    }
    
    if (itemResult.error) {
      console.error('Error loading item count:', itemResult.error)
    } else {
      stats.items = itemResult.count || 0
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Error loading stats:', err)
  }
}
</script>
