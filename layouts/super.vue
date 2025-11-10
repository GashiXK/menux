<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white text-ink-900 dark:from-ink-950 dark:via-ink-950 dark:to-ink-900 dark:text-ink-100">
    <Teleport to="body">
      <Transition name="super-nav-fade">
        <div v-if="isMobileNavOpen" class="fixed inset-0 z-[60] lg:hidden">
          <div class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" @click="closeMobileNav" />
          <aside
            class="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col border-r border-ink-100 bg-white shadow-2xl dark:border-ink-800 dark:bg-ink-950"
            id="super-mobile-nav"
          >
            <div class="flex items-center justify-between border-b border-ink-100 px-6 py-6 dark:border-ink-800">
              <NuxtLink to="/super" class="flex items-center gap-3" @click="closeMobileNav">
                <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
                  <UIcon name="i-heroicons-shield-check" class="h-6 w-6 text-white" />
                </span>
                <div>
                  <p class="text-lg font-semibold text-ink-900 dark:text-white">Super Admin</p>
                  <p class="text-xs font-medium uppercase tracking-widest text-brand-600 dark:text-brand-300">Control Center</p>
                </div>
              </NuxtLink>
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-ink-600 shadow-sm transition hover:bg-ink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
                @click="closeMobileNav"
              >
                <span class="sr-only">Close navigation</span>
                <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
              </button>
            </div>
            <nav class="flex-1 overflow-y-auto px-3 py-6">
              <ul class="space-y-2">
                <li v-for="item in navItems" :key="item.path">
                  <NuxtLink
                    :to="item.path"
                    class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    :class="isActive(item.path)
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : 'text-ink-600 hover:bg-ink-100 hover:text-brand-600 dark:text-ink-300 dark:hover:bg-ink-900 dark:hover:text-brand-300'"
                    @click="closeMobileNav"
                  >
                    <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white" :class="isActive(item.path) ? '' : 'bg-ink-100 text-ink-500 dark:bg-ink-900 dark:text-ink-400'">
                      <UIcon :name="item.icon" class="h-5 w-5" />
                    </span>
                    <span>{{ item.label }}</span>
                    <span v-if="item.badge" class="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[11px] uppercase tracking-widest text-white/80">
                      {{ item.badge }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
            <div class="border-t border-ink-100 px-6 py-6 dark:border-ink-800">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-300"
                @click="() => { closeMobileNav(); handleLogout(); }"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-5 w-5" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <div class="flex min-h-screen">
      <aside class="hidden w-72 flex-col border-r border-ink-100 bg-white/85 p-8 shadow-2xl shadow-brand-500/10 backdrop-blur dark:border-ink-800 dark:bg-ink-950/75 lg:flex">
        <NuxtLink to="/super" class="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl px-2 py-1">
          <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
            <UIcon name="i-heroicons-shield-check" class="h-7 w-7 text-white" />
          </span>
          <div>
            <p class="text-xl font-semibold text-ink-900 dark:text-white leading-tight">Super Admin</p>
            <p class="text-xs font-medium uppercase tracking-widest text-brand-600 dark:text-brand-300">MenuX Control</p>
          </div>
        </NuxtLink>
        <div class="mt-10 flex-1 space-y-6">
          <nav>
            <p class="px-2 text-xs font-semibold uppercase tracking-[0.4em] text-ink-400 dark:text-ink-500">Overview</p>
            <ul class="mt-3 space-y-2">
              <li v-for="item in navItems" :key="item.path">
                <NuxtLink
                  :to="item.path"
                  class="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  :class="isActive(item.path)
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-brand-600 dark:text-ink-300 dark:hover:bg-ink-900 dark:hover:text-brand-300'"
                >
                  <span
                    :class="[
                      'flex h-10 w-10 items-center justify-center rounded-xl transition',
                      isActive(item.path)
                        ? 'bg-white/15 text-white'
                        : 'bg-ink-100 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-600 dark:bg-ink-900 dark:text-ink-400 dark:group-hover:bg-brand-900/40 dark:group-hover:text-brand-300'
                    ]"
                  >
                    <UIcon :name="item.icon" class="h-5 w-5" />
                  </span>
                  <span>{{ item.label }}</span>
                  <span
                    v-if="item.badge"
                    class="ml-auto inline-flex items-center rounded-full bg-brand-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-brand-100 dark:text-brand-200"
                  >
                    {{ item.badge }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <div class="rounded-3xl bg-gradient-to-br from-brand-500/15 via-brand-500/5 to-secondary/20 p-5 text-sm text-ink-600 dark:text-ink-300">
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600 dark:text-brand-300">Health</p>
            <div class="mt-3 space-y-3">
              <div class="flex items-center justify-between">
                <span>Active Tenants</span>
                <span class="text-base font-semibold text-brand-600 dark:text-brand-300">{{ tenantCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Pending requests</span>
                <span class="text-base font-semibold text-secondary">{{ pendingRequests }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>System status</span>
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
                  <span class="h-2 w-2 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8 space-y-4 rounded-2xl border border-ink-100 bg-white/80 p-5 dark:border-ink-800 dark:bg-ink-900/60">
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-ink-400 dark:text-ink-500">Account</p>
          <div class="space-y-4">
            <div class="rounded-xl bg-ink-50 px-4 py-3 dark:bg-ink-900/60">
              <p class="text-sm font-semibold text-ink-700 dark:text-ink-200">{{ user?.email }}</p>
              <p class="text-xs text-ink-500 dark:text-ink-400">Super Admin</p>
            </div>
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-300"
              @click="handleLogout"
            >
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div class="flex flex-1 flex-col">
        <header class="sticky top-0 z-40 border-b border-ink-100 bg-white/80 px-4 py-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/70 sm:px-6 lg:px-10">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-ink-100 text-ink-600 shadow-sm transition hover:bg-ink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden"
                :aria-expanded="isMobileNavOpen"
                aria-controls="super-mobile-nav"
                @click="toggleMobileNav"
              >
                <span class="sr-only">{{ isMobileNavOpen ? 'Close navigation' : 'Open navigation' }}</span>
                <UIcon :name="isMobileNavOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="h-6 w-6" />
              </button>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.4em] text-ink-400 dark:text-ink-500">Super Admin</p>
                <h1 class="text-2xl font-bold text-ink-900 dark:text-white">{{ currentSectionTitle }}</h1>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UButton to="/dashboard" variant="soft" size="sm" icon="i-heroicons-arrow-path" label="Switch to tenant view" />
              <UButton to="/super/templates" size="sm" color="primary" icon="i-heroicons-sparkles" label="Create template" />
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-10">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const isMobileNavOpen = ref(false)
const tenantCount = ref<number | null>(null)
const pendingRequests = ref<number>(0)

const navItems = [
  { label: 'Overview', path: '/super', icon: 'i-heroicons-command-line' },
  { label: 'Tenants', path: '/super/tenants', icon: 'i-heroicons-building-office-2' },
  { label: 'Users', path: '/super/users', icon: 'i-heroicons-users' },
  { label: 'Cities', path: '/super/cities', icon: 'i-heroicons-map-pin' },
  { label: 'Ads', path: '/super/ads', icon: 'i-heroicons-megaphone', badge: 'Live' },
  { label: 'Templates', path: '/super/templates', icon: 'i-heroicons-swatch' }
]

const isActive = (path: string) => {
  if (path === '/super') {
    return route.path === '/super'
  }
  return route.path.startsWith(path)
}

const currentSectionTitle = computed(() => {
  const match = navItems.find(item => isActive(item.path))
  return match ? match.label : 'Overview'
})

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
}

watch(
  () => route.path,
  () => {
    closeMobileNav()
  }
)

const fetchTenantMetrics = async () => {
  try {
    const { data } = await client
      .from('tenants')
      .select('id, is_active', { count: 'exact', head: false })

    tenantCount.value = data?.length ?? 0

    const pending = data?.filter(item => item.is_active === false).length ?? 0
    pendingRequests.value = pending
  } catch (error) {
    console.error('Failed to load tenant metrics', error)
  }
}

onMounted(() => {
  fetchTenantMetrics()
})

const handleLogout = async () => {
  try {
    await client.auth.signOut()
    toast.add({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
    await router.push('/auth/login')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: 'Failed to sign out. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}
</script>

<style scoped>
.super-nav-fade-enter-active,
.super-nav-fade-leave-active {
  transition: opacity 0.25s ease;
}
.super-nav-fade-enter-from,
.super-nav-fade-leave-to {
  opacity: 0;
}
</style>
