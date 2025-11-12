<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <UNotifications />
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMobileNavOpen" class="fixed inset-0 z-[60] lg:hidden">
          <div class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" @click="closeMobileNav" />
          <aside
            class="absolute inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-ink-900 shadow-xl border-r border-ink-100 dark:border-ink-800 flex flex-col"
            @keydown.esc.prevent="closeMobileNav"
            id="dashboard-mobile-nav"
          >
            <div class="px-6 pt-8 pb-6 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="text-lg font-semibold text-ink-900 dark:text-white leading-tight">
                    {{ tenant?.name || 'MenuPika' }}
                  </p>
                  <p v-if="tenant && !tenant.is_active" class="text-xs font-medium text-red-600 dark:text-red-400">
                    Inactive
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="rounded-xl p-2 text-ink-500 dark:text-ink-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-ink-100 dark:hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                @click="closeMobileNav"
              >
                <span class="sr-only">Close navigation</span>
                <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto px-2 py-6">
              <nav class="space-y-2">
                <NuxtLink
                  v-for="item in navItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  :class="isActive(item.path)
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-300'"
                  @click="closeMobileNav"
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </nav>
            </div>
            <div class="px-6 pb-8">
              <button
                type="button"
                @click="() => { closeMobileNav(); handleLogout(); }"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <div class="flex min-h-screen">
      <aside class="hidden lg:flex lg:flex-col w-72 bg-white/90 dark:bg-ink-950/80 backdrop-blur border-r border-ink-100 dark:border-ink-800 shadow-2xl shadow-black/5">
        <div class="px-8 pt-10 pb-6 border-b border-ink-100 dark:border-ink-800">
          <NuxtLink to="/dashboard" class="flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <UIcon name="i-heroicons-building-office-2" class="w-7 h-7 text-white" />
            </div>
            <div>
              <p class="text-xl font-bold text-ink-900 dark:text-white leading-tight">
                {{ tenant?.name || 'MenuPika' }}
              </p>
              <p v-if="tenant && !tenant.is_active" class="text-xs font-semibold text-red-600 dark:text-red-400">
                Inactive
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="flex-1 px-4 py-8 overflow-y-auto">
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              :class="isActive(item.path)
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-300'"
            >
              <div
                :class="[
                  'rounded-lg p-2 transition-colors',
                  isActive(item.path)
                    ? 'bg-white/20 text-white'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-600'
                ]"
              >
                <UIcon :name="item.icon" class="w-5 h-5" />
              </div>
              <span>{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="ml-auto inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-900/30 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </nav>
        </div>
        <div class="px-8 pb-8 pt-6 border-t border-ink-100 dark:border-ink-800">
          <div class="space-y-4">
            <div class="rounded-2xl bg-ink-50/80 dark:bg-ink-800/60 px-4 py-5">
              <p class="text-xs uppercase tracking-wide text-ink-400 dark:text-ink-500 mb-1">
                Account
              </p>
              <p class="text-sm font-semibold text-ink-700 dark:text-ink-200">
                {{ user?.email }}
              </p>
            </div>
            <button
              type="button"
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div class="flex-1 flex flex-col">
        <header class="bg-white/70 dark:bg-ink-900/80 border-b border-ink-100 dark:border-ink-800 backdrop-blur sticky top-0 z-40 shadow-sm">
          <div class="px-4 sm:px-6 lg:px-10">
            <div class="flex justify-between items-center h-20">
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  class="inline-flex lg:hidden items-center justify-center rounded-xl p-2.5 text-ink-600 dark:text-ink-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-ink-100 dark:hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition"
                  :aria-expanded="isMobileNavOpen"
                  aria-controls="dashboard-mobile-nav"
                  @click="toggleMobileNav"
                >
                  <span class="sr-only">{{ isMobileNavOpen ? 'Close navigation' : 'Open navigation' }}</span>
                  <UIcon :name="isMobileNavOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-7 h-7" />
                </button>
                <div>
                  <p class="text-sm font-medium text-ink-500 dark:text-ink-400 uppercase tracking-wide">
                    Tenant Dashboard
                  </p>
                  <h1 class="text-2xl font-bold text-ink-900 dark:text-white leading-snug">
                    {{ currentSectionTitle }}
                  </h1>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-brand-100 dark:border-brand-900/40 bg-brand-50/80 dark:bg-brand-900/20 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition"
                  @click="goToMenuPreview"
                >
                  <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                  View Menu
                </button>
              </div>
            </div>
          </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center space-y-3">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-brand-500 mx-auto" />
              <p class="text-ink-600 dark:text-ink-400 text-sm font-medium">Loading dashboard data</p>
            </div>
          </div>
          <slot v-else />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()
const toast = useToast()
const user = useSupabaseUser()
const { tenant, loadTenantForUser } = useTenant()
const { listMenusByTenant } = useMenu()

const loading = ref(true)
const isMobileNavOpen = ref(false)
const defaultMenuSlug = useState<string>('tenant-default-menu-slug', () => 'main')

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: 'i-heroicons-home-modern' },
  { label: 'Categories', path: '/dashboard/categories', icon: 'i-heroicons-squares-2x2' },
  { label: 'Items', path: '/dashboard/items', icon: 'i-heroicons-clipboard-document-list' },
  { label: 'Design', path: '/dashboard/design', icon: 'i-heroicons-swatch' },
  { label: 'QR Code', path: '/dashboard/qr', icon: 'i-heroicons-qr-code' },
  { label: 'Settings', path: '/dashboard/settings', icon: 'i-heroicons-cog-6-tooth' }
]

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
}

const goToMenuPreview = () => {
  if (!currentMenuRoute.value) {
    return
  }
  if (process.client) {
    window.open(currentMenuRoute.value, '_blank', 'noopener')
  }
}

const currentMenuRoute = computed(() => {
  if (!tenant.value) {
    return null
  }
  return `/${defaultMenuSlug.value}?tenant=${tenant.value.slug}`
})

const currentSectionTitle = computed(() => {
  const match = navItems.find(item => isActive(item.path))
  if (match) {
    return match.label
  }
  return 'Dashboard'
})

const fetchDefaultMenuSlug = async () => {
  if (!tenant.value) {
    return
  }
  try {
    const menus = await listMenusByTenant(tenant.value.id)
    if (!menus || menus.length === 0) {
      defaultMenuSlug.value = 'main'
      return
    }
    const activeMenu = menus.find(menuItem => menuItem.is_default) ?? menus[0]
    defaultMenuSlug.value = activeMenu?.slug ?? 'main'
  } catch (error) {
    console.error('Failed to load default menu slug', error)
  }
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

watch(
  () => route.path,
  () => {
    closeMobileNav()
  }
)

onMounted(async () => {
  if (user.value && !tenant.value) {
    try {
      await loadTenantForUser()
      await fetchDefaultMenuSlug()
    } catch (error: any) {
      console.error('Error loading tenant:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to load tenant information',
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
        timeout: 5000
      })
    } finally {
      loading.value = false
    }
  } else {
    await fetchDefaultMenuSlug()
    loading.value = false
  }
})

watch(
  () => tenant.value?.id,
  async newTenantId => {
    if (newTenantId) {
      await fetchDefaultMenuSlug()
    }
  }
)
</script>
