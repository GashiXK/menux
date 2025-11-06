<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Modern Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
              City Management
            </h1>
            <p class="text-ink-600 dark:text-ink-300 text-lg">
              Add and manage cities and regions
            </p>
          </div>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create City
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="!loading && cities.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Total Cities</p>
              <p class="text-3xl font-bold text-ink-900 dark:text-white">{{ cities.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-brand-500" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">With Country Code</p>
              <p class="text-3xl font-bold text-brand-500">{{ citiesWithCountry }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-brand-500" />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">With Region</p>
              <p class="text-3xl font-bold text-brand-500">{{ citiesWithRegion }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-map" class="w-6 h-6 text-brand-500" />
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

      <!-- Cities Grid -->
      <div v-else-if="cities.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="city in cities"
          :key="city.id"
          class="group bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <!-- City Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-ink-900 dark:text-white truncate mb-1">
                  {{ city.name }}
                </h3>
                <p class="text-sm text-ink-500 dark:text-ink-400 font-mono truncate">
                  {{ city.slug }}
                </p>
              </div>
            </div>
          </div>

          <!-- City Details -->
          <div class="space-y-3 mb-6">
            <div v-if="city.country_code" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-globe-alt" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300">
                Country: <strong>{{ city.country_code }}</strong>
              </span>
            </div>
            <div v-if="city.region" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-map" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300">
                Region: <strong>{{ city.region }}</strong>
              </span>
            </div>
            <div v-if="!city.country_code && !city.region" class="text-sm text-ink-500 dark:text-ink-400 italic">
              No additional details
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-ink-100 dark:border-ink-800">
            <button
              @click="openDialog(city)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit
            </button>
            <button
              @click="confirmDelete(city)"
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
            <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            No cities yet
          </h3>
          <p class="text-ink-600 dark:text-ink-400 mb-8 text-lg">
            Get started by creating your first city. Cities help organize tenants by location.
          </p>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 mx-auto"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create Your First City
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
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                {{ editingCity ? 'Edit City' : 'Create City' }}
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
                    Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="City name"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Slug <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.slug"
                    type="text"
                    placeholder="city-slug"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    Used in URLs (e.g., /city-slug)
                  </p>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Country Code
                    </label>
                    <input
                      v-model="form.country_code"
                      type="text"
                      placeholder="US, AL, etc."
                      maxlength="2"
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent uppercase"
                    />
                    <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">ISO 3166-1 alpha-2 code</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Region
                    </label>
                    <input
                      v-model="form.region"
                      type="text"
                      placeholder="State or region"
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
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
                {{ editingCity ? 'Update City' : 'Create City' }}
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
                    Delete City
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-4">
                    Are you sure you want to delete <strong>{{ deletingCity?.name }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400 mb-4">
                    This action cannot be undone. Tenants using this city will need to be updated.
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
                Delete City
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { City } from '~/types/database'
import { useCity } from '~/composables/useCity'

definePageMeta({
  layout: 'super',
  middleware: ['super-admin']
})

const { listCities, createCity, updateCity, deleteCity } = useCity()
const toast = useToast()

const cities = ref<City[]>([])
const loading = ref(true)
const dialogOpen = ref(false)
const showDeleteDialog = ref(false)
const editingCity = ref<City | null>(null)
const deletingCity = ref<City | null>(null)
const saving = ref(false)

const form = reactive({
  name: '',
  slug: '',
  country_code: '',
  region: ''
})

const citiesWithCountry = computed(() => cities.value.filter(c => c.country_code).length)
const citiesWithRegion = computed(() => cities.value.filter(c => c.region).length)

const loadData = async () => {
  loading.value = true
  try {
    const result = await listCities()
    cities.value = result || []
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to load cities',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (city?: City) => {
  if (city) {
    editingCity.value = city
    form.name = city.name
    form.slug = city.slug
    form.country_code = city.country_code || ''
    form.region = city.region || ''
  } else {
    editingCity.value = null
    form.name = ''
    form.slug = ''
    form.country_code = ''
    form.region = ''
  }
  dialogOpen.value = true
}

const handleSubmit = async () => {
  if (!form.name || !form.slug) {
    toast.add({
      title: 'Validation Error',
      description: 'Name and Slug are required',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  saving.value = true
  try {
    if (editingCity.value) {
      await updateCity(editingCity.value.id, {
        name: form.name,
        slug: form.slug,
        country_code: form.country_code || null,
        region: form.region || null
      })
      toast.add({
        title: 'Success',
        description: 'City updated successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    } else {
      await createCity({
        name: form.name,
        slug: form.slug,
        country_code: form.country_code || null,
        region: form.region || null
      })
      toast.add({
        title: 'Success',
        description: 'City created successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    }
    await loadData()
    dialogOpen.value = false
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to save city',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (city: City) => {
  deletingCity.value = city
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deletingCity.value) return

  try {
    await deleteCity(deletingCity.value.id)
    await loadData()
    showDeleteDialog.value = false
    deletingCity.value = null

    toast.add({
      title: 'Success',
      description: 'City deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to delete city',
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
