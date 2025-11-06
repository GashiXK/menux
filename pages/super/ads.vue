<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Modern Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
              Ad Management
            </h1>
            <p class="text-ink-600 dark:text-ink-300 text-lg">
              Create and schedule advertisements
            </p>
          </div>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create Ad
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="!loading && ads.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Total Ads</p>
              <p class="text-3xl font-bold text-ink-900 dark:text-white">{{ ads.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-megaphone" class="w-6 h-6 text-brand-500" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Active</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ activeCount }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Inactive</p>
              <p class="text-3xl font-bold text-ink-500 dark:text-ink-400">{{ inactiveCount }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-ink-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-ink-500" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Avg Priority</p>
              <p class="text-3xl font-bold text-brand-500">{{ avgPriority }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-6 h-6 text-brand-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-ink-200 dark:bg-ink-700 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-ink-200 dark:bg-ink-700 rounded w-1/3"></div>
              <div class="h-3 bg-ink-200 dark:bg-ink-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ads Grid -->
      <div v-else-if="ads.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="ad in ads"
          :key="ad.id"
          class="group bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <!-- Ad Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <UIcon name="i-heroicons-megaphone" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-ink-900 dark:text-white truncate mb-1">
                  {{ ad.title }}
                </h3>
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      ad.active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-400'
                    ]"
                  >
                    {{ ad.active ? 'Active' : 'Inactive' }}
                  </span>
                  <span class="px-2 py-1 rounded text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
                    Priority: {{ ad.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ad Details -->
          <div class="space-y-3 mb-6">
            <div v-if="ad.body" class="text-sm text-ink-600 dark:text-ink-300 line-clamp-2">
              {{ ad.body }}
            </div>
            <div v-if="ad.media_url" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-photo" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300 truncate">Media URL configured</span>
            </div>
            <div v-if="ad.link_url" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-link" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300 truncate">Link URL configured</span>
            </div>
            <div v-if="ad.targets && ad.targets.length > 0" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-funnel" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300 capitalize">
                Scope: {{ ad.targets[0]?.scope || 'all_pages' }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300">
                Created {{ formatDate(ad.created_at) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-ink-100 dark:border-ink-800">
            <button
              @click="openDialog(ad)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit
            </button>
            <button
              @click="confirmDelete(ad)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/30">
            <UIcon name="i-heroicons-megaphone" class="w-12 h-12 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            No ads yet
          </h3>
          <p class="text-ink-600 dark:text-ink-400 mb-8 text-lg">
            Get started by creating your first advertisement. Ads help promote special offers and announcements.
          </p>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 mx-auto"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create Your First Ad
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="dialogOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="dialogOpen = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="dialogOpen = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                {{ editingAd ? 'Edit Ad' : 'Create Ad' }}
              </h2>
              <button
                @click="dialogOpen = false"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="Ad title"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Body
                  </label>
                  <textarea
                    v-model="form.body"
                    placeholder="Ad description"
                    rows="3"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Media URL
                    </label>
                    <input
                      v-model="form.media_url"
                      type="url"
                      placeholder="https://..."
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Link URL
                    </label>
                    <input
                      v-model="form.link_url"
                      type="url"
                      placeholder="https://..."
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Priority
                  </label>
                  <input
                    v-model.number="form.priority"
                    type="number"
                    min="0"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">Higher priority ads show first</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Status
                  </label>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="form.active = !form.active"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        form.active ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          form.active ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-ink-600 dark:text-ink-400">
                      {{ form.active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Start Time
                    </label>
                    <input
                      v-model="form.start_time"
                      type="datetime-local"
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      End Time
                    </label>
                    <input
                      v-model="form.end_time"
                      type="datetime-local"
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="border-t border-ink-100 dark:border-ink-800 pt-4 mt-4">
                  <h3 class="font-semibold text-ink-900 dark:text-white mb-4">Targeting</h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                        Scope
                      </label>
                      <select
                        v-model="form.scope"
                        class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      >
                        <option value="all_pages">All Pages</option>
                        <option value="menu">Menu</option>
                        <option value="category">Category</option>
                        <option value="item">Item</option>
                      </select>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                          Tenant
                        </label>
                        <select
                          v-model="form.tenant_id"
                          class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                          <option :value="null">All tenants</option>
                          <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                            {{ tenant.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                          City
                        </label>
                        <select
                          v-model="form.city_id"
                          class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                          <option :value="null">All cities</option>
                          <option v-for="city in cities" :key="city.id" :value="city.id">
                            {{ city.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="dialogOpen = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="saving"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="saving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                {{ editingAd ? 'Update Ad' : 'Create Ad' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showDeleteDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-lg w-full z-10">
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div class="shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-ink-900 dark:text-white mb-2">
                    Delete Ad
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-4">
                    Are you sure you want to delete <strong>{{ deletingAd?.title }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="showDeleteDialog = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleDelete"
                class="px-6 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center gap-2"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                Delete Ad
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Ad, AdTarget, Tenant, City } from '~/types/database'

definePageMeta({
  layout: 'super',
  middleware: ['super-admin']
})

const { client } = useSupabaseClientStrict()
const toast = useToast()

const ads = ref<(Ad & { targets?: AdTarget[] })[]>([])
const tenants = ref<Tenant[]>([])
const cities = ref<City[]>([])
const loading = ref(true)
const dialogOpen = ref(false)
const showDeleteDialog = ref(false)
const editingAd = ref<(Ad & { targets?: AdTarget[] }) | null>(null)
const deletingAd = ref<Ad | null>(null)
const saving = ref(false)

const form = reactive({
  title: '',
  body: '',
  media_url: '',
  link_url: '',
  priority: 0,
  active: true,
  start_time: '',
  end_time: '',
  scope: 'all_pages' as 'all_pages' | 'menu' | 'category' | 'item',
  tenant_id: null as string | null,
  city_id: null as number | null
})

const activeCount = computed(() => ads.value.filter(a => a.active).length)
const inactiveCount = computed(() => ads.value.filter(a => !a.active).length)
const avgPriority = computed(() => {
  if (ads.value.length === 0) return 0
  const sum = ads.value.reduce((acc, ad) => acc + ad.priority, 0)
  return Math.round(sum / ads.value.length)
})

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

const loadData = async () => {
  loading.value = true
  try {
    const [adsData, tenantsData, citiesData] = await Promise.all([
      client
        .from('ads')
        .select('*, targets:ad_targets(*)')
        .order('created_at', { ascending: false }),
      client
        .from('tenants')
        .select('*')
        .order('name'),
      client
        .from('cities')
        .select('*')
        .order('name')
    ])

    if (adsData.error) throw adsData.error
    if (tenantsData.error) throw tenantsData.error
    if (citiesData.error) throw citiesData.error

    ads.value = adsData.data || []
    tenants.value = tenantsData.data || []
    cities.value = citiesData.data || []
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to load ads',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (ad?: Ad & { targets?: AdTarget[] }) => {
  if (ad) {
    editingAd.value = ad
    form.title = ad.title
    form.body = ad.body || ''
    form.media_url = ad.media_url || ''
    form.link_url = ad.link_url || ''
    form.priority = ad.priority
    form.active = ad.active
    form.start_time = ad.start_time ? new Date(ad.start_time).toISOString().slice(0, 16) : ''
    form.end_time = ad.end_time ? new Date(ad.end_time).toISOString().slice(0, 16) : ''

    if (ad.targets && ad.targets.length > 0) {
      const target = ad.targets[0]
      form.scope = target.scope
      form.tenant_id = target.tenant_id
      form.city_id = target.city_id
    } else {
      form.scope = 'all_pages'
      form.tenant_id = null
      form.city_id = null
    }
  } else {
    editingAd.value = null
    form.title = ''
    form.body = ''
    form.media_url = ''
    form.link_url = ''
    form.priority = 0
    form.active = true
    form.start_time = ''
    form.end_time = ''
    form.scope = 'all_pages'
    form.tenant_id = null
    form.city_id = null
  }
  dialogOpen.value = true
}

const handleSubmit = async () => {
  if (!form.title) {
    toast.add({
      title: 'Validation Error',
      description: 'Title is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  saving.value = true
  try {
    const user = useSupabaseUser()

    const adData = {
      title: form.title,
      body: form.body || null,
      media_url: form.media_url || null,
      link_url: form.link_url || null,
      priority: form.priority,
      active: form.active,
      start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
      created_by: user.value?.id || null
    }

    let adId: string

    if (editingAd.value) {
      const { data, error: updateError } = await client
        .from('ads')
        .update(adData)
        .eq('id', editingAd.value.id)
        .select()
        .single()

      if (updateError) throw updateError
      adId = editingAd.value.id

      await client
        .from('ad_targets')
        .delete()
        .eq('ad_id', adId)
    } else {
      const { data, error: createError } = await client
        .from('ads')
        .insert(adData)
        .select()
        .single()

      if (createError) throw createError
      adId = data.id
    }

    await client
      .from('ad_targets')
      .insert({
        ad_id: adId,
        tenant_id: form.tenant_id,
        city_id: form.city_id,
        scope: form.scope,
        page_path: null
      })

    await loadData()
    dialogOpen.value = false

    toast.add({
      title: 'Success',
      description: editingAd.value ? 'Ad updated successfully' : 'Ad created successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to save ad',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (ad: Ad) => {
  deletingAd.value = ad
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deletingAd.value) return

  try {
    await client
      .from('ad_targets')
      .delete()
      .eq('ad_id', deletingAd.value.id)

    await client
      .from('ads')
      .delete()
      .eq('id', deletingAd.value.id)

    await loadData()
    showDeleteDialog.value = false
    deletingAd.value = null

    toast.add({
      title: 'Success',
      description: 'Ad deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to delete ad',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
