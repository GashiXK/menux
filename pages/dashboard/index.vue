<template>
  <div class="space-y-10">
    <section class="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-brand-500/15 via-white to-secondary/15 px-6 py-10 shadow-xl shadow-brand-500/10 dark:border-ink-800 dark:from-brand-900/30 dark:via-ink-950 dark:to-secondary/20 sm:px-10">
      <div class="absolute inset-0 opacity-40">
        <div class="absolute -left-16 top-[-40px] h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />
        <div class="absolute bottom-[-60px] right-[-30px] h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
      </div>
      <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl space-y-4">
          <span class="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-700 dark:text-brand-300">
            Today’s control room
          </span>
          <h1 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Empower your guests with a story-first menu experience</h1>
          <p class="text-sm text-ink-600 dark:text-ink-300 sm:text-base">
            Monitor category health, publish updates in seconds, and keep your digital menu performance-ready.
          </p>
          <div class="flex flex-wrap gap-3">
            <UButton to="/dashboard/design" color="primary" size="md" icon="i-heroicons-sparkles" label="Customize design" />
            <UButton to="/dashboard/qr" variant="soft" size="md" icon="i-heroicons-qr-code" label="Manage QR codes" />
          </div>
        </div>
        <div class="grid w-full max-w-sm gap-4 rounded-3xl bg-white/80 p-5 text-sm text-ink-600 shadow-lg dark:bg-ink-950/75 dark:text-ink-300">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-medium">
              <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-brand-600 dark:text-brand-300" />
              Published categories
            </span>
            <span v-if="loading" class="h-6 w-10 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <span v-else class="text-lg font-semibold text-ink-900 dark:text-white">{{ stats.categories }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-medium">
              <UIcon name="i-heroicons-squares-2x2" class="h-5 w-5 text-brand-600 dark:text-brand-300" />
              Active items
            </span>
            <span v-if="loading" class="h-6 w-10 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <span v-else class="text-lg font-semibold text-ink-900 dark:text-white">{{ stats.items }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-medium">
              <UIcon :name="menu?.is_published ? 'i-heroicons-signal' : 'i-heroicons-eye-slash'" class="h-5 w-5 text-brand-600 dark:text-brand-300" />
              Menu visibility
            </span>
            <span v-if="loading" class="h-6 w-16 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <button
              v-else
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              :class="menu?.is_published
                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'border-ink-200 bg-ink-100 text-ink-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300'"
              @click="togglePublishStatus"
            >
              {{ menu?.is_published ? 'Live' : 'Draft' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-ink-400 dark:text-ink-500">Operational insights</p>
          <h2 class="mt-1 text-2xl font-bold text-ink-900 dark:text-white">Menu health snapshot</h2>
        </div>
        <div class="flex gap-3">
          <UButton to="/dashboard/items" variant="outline" size="sm" icon="i-heroicons-squares-plus" label="Add menu item" />
          <UButton to="/dashboard/categories" size="sm" color="primary" icon="i-heroicons-folder-plus" label="Create category" />
        </div>
      </div>
      <div class="mt-6 grid gap-6 md:grid-cols-3">
        <NuxtLink to="/dashboard/categories" class="group">
          <div class="h-full rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-ink-800 dark:bg-ink-900/70">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 group-hover:bg-brand-500/20 dark:text-brand-300">
                  <UIcon name="i-heroicons-document-text" class="h-6 w-6" />
                </span>
                <div>
                  <p class="text-sm font-medium text-ink-500 dark:text-ink-400">Categories</p>
                  <p class="text-lg font-semibold text-ink-900 dark:text-white">{{ loading ? '—' : stats.categories }}</p>
                </div>
              </div>
              <UIcon name="i-heroicons-arrow-up-right" class="h-6 w-6 text-ink-300 transition group-hover:text-brand-500" />
            </div>
            <p class="mt-4 text-sm text-ink-500 dark:text-ink-400">Structure your menu narrative with clear categories and seasonal sections.</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/dashboard/items" class="group">
          <div class="h-full rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-ink-800 dark:bg-ink-900/70">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary group-hover:bg-secondary/20">
                  <UIcon name="i-heroicons-shopping-bag" class="h-6 w-6" />
                </span>
                <div>
                  <p class="text-sm font-medium text-ink-500 dark:text-ink-400">Menu items</p>
                  <p class="text-lg font-semibold text-ink-900 dark:text-white">{{ loading ? '—' : stats.items }}</p>
                </div>
              </div>
              <UIcon name="i-heroicons-arrow-up-right" class="h-6 w-6 text-ink-300 transition group-hover:text-brand-500" />
            </div>
            <p class="mt-4 text-sm text-ink-500 dark:text-ink-400">Curate culinary stories with imagery, tags, and translations tailored to guests.</p>
          </div>
        </NuxtLink>
        <div class="h-full rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-md dark:border-ink-800 dark:bg-ink-900/70">
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <UIcon name="i-heroicons-arrow-path" class="h-6 w-6" />
            </span>
            <div>
              <p class="text-sm font-medium text-ink-500 dark:text-ink-400">Live synchronization</p>
              <p class="text-lg font-semibold text-ink-900 dark:text-white">{{ menu?.is_published ? 'Guests see updates instantly' : 'Publish to activate menu' }}</p>
            </div>
          </div>
          <p class="mt-4 text-sm text-ink-500 dark:text-ink-400">
            {{ menu?.is_published ? 'Your guests are viewing the live experience.' : 'Draft changes are hidden until you publish the menu.' }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-lg dark:border-ink-800 dark:bg-ink-900/70 sm:p-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-ink-400 dark:text-ink-500">Quick actions</p>
          <h3 class="mt-1 text-xl font-semibold text-ink-900 dark:text-white">Ship updates at the speed of service</h3>
        </div>
      </div>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to" class="group">
          <div class="h-full rounded-2xl border border-ink-100 bg-ink-50/60 p-6 transition hover:-translate-y-1 hover:border-brand-400 hover:bg-brand-50 dark:border-ink-800 dark:bg-ink-900/60 dark:hover:border-brand-500 dark:hover:bg-brand-900/30">
            <div class="flex items-start gap-4">
              <span :class="['flex h-12 w-12 items-center justify-center rounded-xl transition', action.iconBg]">
                <UIcon :name="action.icon" class="h-6 w-6" />
              </span>
              <div class="flex-1 space-y-1">
                <p class="text-base font-semibold text-ink-900 dark:text-white">{{ action.label }}</p>
                <p class="text-sm text-ink-500 dark:text-ink-400">{{ action.description }}</p>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="h-5 w-5 text-ink-300 transition group-hover:text-brand-500" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
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
const quickActions = [
  {
    to: '/dashboard/categories',
    icon: 'i-heroicons-folder-plus',
    iconBg: 'bg-brand-500/15 text-brand-600 group-hover:bg-brand-500/20 dark:text-brand-300',
    label: 'Organize categories',
    description: 'Design tasting flights, brunch sections, or seasonal collections.'
  },
  {
    to: '/dashboard/items',
    icon: 'i-heroicons-fire',
    iconBg: 'bg-secondary/15 text-secondary group-hover:bg-secondary/25',
    label: 'Launch a hero item',
    description: 'Add imagery, tags, and pricing to your latest culinary story.'
  },
  {
    to: '/dashboard/design',
    icon: 'i-heroicons-swatch',
    iconBg: 'bg-purple-500/15 text-purple-500 group-hover:bg-purple-500/25',
    label: 'Refresh template styling',
    description: 'Apply new gradients, typography, and layout patterns instantly.'
  },
  {
    to: '/dashboard/qr',
    icon: 'i-heroicons-qr-code',
    iconBg: 'bg-emerald-500/15 text-emerald-500 group-hover:bg-emerald-500/25',
    label: 'Distribute QR touchpoints',
    description: 'Generate smart QR codes ready for print, tabletops, or signage.'
  }
]

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
