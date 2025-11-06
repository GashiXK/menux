<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
  <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
          Super Admin Dashboard
        </h1>
        <p class="text-muted">Manage your entire platform from one place</p>
      </div>
    </div>
    
    <!-- Stats Cards with Beautiful Design -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink to="/super/tenants" class="block">
        <UCard 
          class="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-300 cursor-pointer"
          :class="loadingStats ? 'opacity-50' : ''"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform">
                <UIcon 
                  v-if="loadingStats" 
                  name="i-heroicons-arrow-path" 
                  class="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" 
                />
                <UIcon 
                  v-else 
                  name="i-heroicons-building-storefront" 
                  class="w-8 h-8 text-primary-600 dark:text-primary-400" 
                />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted">Total Tenants</p>
              <h3 class="text-3xl font-bold text-highlighted">
                {{ loadingStats ? '...' : stats.tenants }}
              </h3>
            </div>
          </div>
        </UCard>
      </NuxtLink>
      
      <NuxtLink to="/super/cities" class="block">
        <UCard 
          class="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-success-300 cursor-pointer"
          :class="loadingStats ? 'opacity-50' : ''"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-success-100 dark:bg-success-900/20 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-xl bg-success-100 dark:bg-success-900/30 group-hover:scale-110 transition-transform">
                <UIcon 
                  v-if="loadingStats" 
                  name="i-heroicons-arrow-path" 
                  class="w-8 h-8 animate-spin text-success-600 dark:text-success-400" 
                />
                <UIcon 
                  v-else 
                  name="i-heroicons-map-pin" 
                  class="w-8 h-8 text-success-600 dark:text-success-400" 
                />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted">Cities</p>
              <h3 class="text-3xl font-bold text-highlighted">
                {{ loadingStats ? '...' : stats.cities }}
              </h3>
            </div>
          </div>
        </UCard>
      </NuxtLink>
      
      <NuxtLink to="/super/ads" class="block">
        <UCard 
          class="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-warning-300 cursor-pointer"
          :class="loadingStats ? 'opacity-50' : ''"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-warning-100 dark:bg-warning-900/20 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-xl bg-warning-100 dark:bg-warning-900/30 group-hover:scale-110 transition-transform">
                <UIcon 
                  v-if="loadingStats" 
                  name="i-heroicons-arrow-path" 
                  class="w-8 h-8 animate-spin text-warning-600 dark:text-warning-400" 
                />
                <UIcon 
                  v-else 
                  name="i-heroicons-megaphone" 
                  class="w-8 h-8 text-warning-600 dark:text-warning-400" 
                />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted">Active Ads</p>
              <h3 class="text-3xl font-bold text-highlighted">
                {{ loadingStats ? '...' : stats.ads }}
              </h3>
            </div>
          </div>
        </UCard>
      </NuxtLink>
      
      <NuxtLink to="/super/templates" class="block">
        <UCard 
          class="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary-300 cursor-pointer"
          :class="loadingStats ? 'opacity-50' : ''"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-secondary-100 dark:bg-secondary-900/20 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 group-hover:scale-110 transition-transform">
                <UIcon 
                  v-if="loadingStats" 
                  name="i-heroicons-arrow-path" 
                  class="w-8 h-8 animate-spin text-secondary-600 dark:text-secondary-400" 
                />
                <UIcon 
                  v-else 
                  name="i-heroicons-paint-brush" 
                  class="w-8 h-8 text-secondary-600 dark:text-secondary-400" 
                />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-muted">Templates</p>
              <h3 class="text-3xl font-bold text-highlighted">
                {{ loadingStats ? '...' : stats.templates }}
              </h3>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
    
    <!-- Quick Actions with Beautiful Design -->
    <UCard class="bg-gradient-to-br from-default via-elevated/50 to-default">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 text-primary" />
          <h2 class="text-2xl font-bold text-highlighted">Quick Actions</h2>
        </div>
      </template>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink to="/super/tenants" class="block">
          <UCard 
            variant="outline" 
            class="hover:shadow-lg hover:border-primary-300 hover:scale-105 transition-all duration-300 h-full cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                <UIcon name="i-heroicons-building-storefront" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-highlighted mb-1">Manage Tenants</h3>
                <p class="text-sm text-muted">Create and manage restaurant accounts</p>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
            </div>
          </UCard>
        </NuxtLink>
        
        <NuxtLink to="/super/users" class="block">
          <UCard 
            variant="outline" 
            class="hover:shadow-lg hover:border-primary-300 hover:scale-105 transition-all duration-300 h-full cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-success-100 dark:bg-success-900/30 group-hover:bg-success-200 dark:group-hover:bg-success-900/50 transition-colors">
                <UIcon name="i-heroicons-users" class="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-highlighted mb-1">Manage Users</h3>
                <p class="text-sm text-muted">View and manage all tenant users</p>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
          </div>
          </UCard>
        </NuxtLink>
        
        <NuxtLink to="/super/cities" class="block">
          <UCard 
            variant="outline" 
            class="hover:shadow-lg hover:border-primary-300 hover:scale-105 transition-all duration-300 h-full cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-info-100 dark:bg-info-900/30 group-hover:bg-info-200 dark:group-hover:bg-info-900/50 transition-colors">
                <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-info-600 dark:text-info-400" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-highlighted mb-1">Manage Cities</h3>
                <p class="text-sm text-muted">Add cities and regions</p>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
          </div>
          </UCard>
        </NuxtLink>
        
        <NuxtLink to="/super/ads" class="block">
          <UCard 
            variant="outline" 
            class="hover:shadow-lg hover:border-primary-300 hover:scale-105 transition-all duration-300 h-full cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-warning-100 dark:bg-warning-900/30 group-hover:bg-warning-200 dark:group-hover:bg-warning-900/50 transition-colors">
                <UIcon name="i-heroicons-megaphone" class="w-8 h-8 text-warning-600 dark:text-warning-400" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-highlighted mb-1">Manage Ads</h3>
                <p class="text-sm text-muted">Create and schedule advertisements</p>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
          </div>
          </UCard>
        </NuxtLink>
        
        <NuxtLink to="/super/templates" class="block">
          <UCard 
            variant="outline" 
            class="hover:shadow-lg hover:border-primary-300 hover:scale-105 transition-all duration-300 h-full cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-900/50 transition-colors">
                <UIcon name="i-heroicons-paint-brush" class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-highlighted mb-1">Manage Templates</h3>
                <p class="text-sm text-muted">Add and update menu templates</p>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0" />
          </div>
          </UCard>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'super',
  middleware: ['super-admin']
})

const { client } = useSupabaseClientStrict()
const toast = useToast()

const stats = reactive({
  tenants: 0,
  cities: 0,
  ads: 0,
  templates: 0
})

const loadingStats = ref(true)
const error = ref<string | null>(null)

const loadStats = async () => {
  loadingStats.value = true
  error.value = null
  
  try {
    console.log('🔄 Loading dashboard stats...')
    console.log('🔍 Client:', client)
    
    // Test connection first
    const { data: testData, error: testError } = await client
    .from('tenants')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Connection test failed:', testError)
      throw testError
    }
    
    console.log('✅ Connection test passed')
    
    // Now fetch counts
    const [tenantsResult, citiesResult, adsResult, templatesResult] = await Promise.all([
      client.from('tenants').select('*', { count: 'exact', head: true }),
      client.from('cities').select('*', { count: 'exact', head: true }),
      client.from('ads').select('*', { count: 'exact', head: true }).eq('active', true),
      client.from('menu_templates').select('*', { count: 'exact', head: true })
    ])
    
    console.log('📊 Stats results:', {
      tenants: { count: tenantsResult.count, error: tenantsResult.error },
      cities: { count: citiesResult.count, error: citiesResult.error },
      ads: { count: adsResult.count, error: adsResult.error },
      templates: { count: templatesResult.count, error: templatesResult.error }
    })
    
    if (tenantsResult.error) {
      console.error('❌ Tenants error:', tenantsResult.error)
      throw tenantsResult.error
    }
    if (citiesResult.error) {
      console.error('❌ Cities error:', citiesResult.error)
      throw citiesResult.error
    }
    if (adsResult.error) {
      console.error('❌ Ads error:', adsResult.error)
      throw adsResult.error
    }
    if (templatesResult.error) {
      console.error('❌ Templates error:', templatesResult.error)
      throw templatesResult.error
    }
  
    stats.tenants = tenantsResult.count ?? 0
    stats.cities = citiesResult.count ?? 0
    stats.ads = adsResult.count ?? 0
    stats.templates = templatesResult.count ?? 0
    
    console.log('✅ Stats loaded:', stats)
    
    if (stats.tenants === 0 && stats.cities === 0 && stats.ads === 0 && stats.templates === 0) {
      console.warn('⚠️ All stats are zero - might be no data in database')
    }
  } catch (err: unknown) {
    const errObj = err as { message?: string; code?: string; details?: string; hint?: string }
    console.error('❌ Error loading stats:', err)
    console.error('Error details:', {
      message: errObj.message,
      code: errObj.code,
      details: errObj.details,
      hint: errObj.hint
    })
    error.value = errObj.message || 'Failed to load dashboard statistics'
    toast.add({
      title: 'Error Loading Stats',
      description: error.value,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    loadingStats.value = false
  }
}

onMounted(async () => {
  if (process.client) {
    // Wait a bit to ensure Supabase client is fully initialized
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    await loadStats()
  }
})
</script>
