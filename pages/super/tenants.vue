<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Modern Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
              Tenant Management
            </h1>
            <p class="text-ink-600 dark:text-ink-300 text-lg">
              Manage restaurant accounts and their configurations
            </p>
          </div>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create New Tenant
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="!loading && tenants.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Total Tenants</p>
              <p class="text-3xl font-bold text-ink-900 dark:text-white">{{ tenants.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-brand-500" />
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
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Cities</p>
              <p class="text-3xl font-bold text-brand-500">{{ cities.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-brand-500" />
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

      <!-- Tenants Grid -->
      <div v-else-if="tenants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tenant in tenants"
          :key="tenant.id"
          class="group bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <!-- Tenant Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <UIcon name="i-heroicons-building-office-2" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-ink-900 dark:text-white truncate mb-1">
                  {{ tenant.name }}
                </h3>
                <p class="text-sm text-ink-500 dark:text-ink-400 font-mono truncate">
                  {{ tenant.slug }}
                </p>
              </div>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-lg text-xs font-semibold',
                tenant.is_active
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-400'
              ]"
            >
              {{ tenant.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <!-- Tenant Details -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300">
                {{ getCityName(tenant.city_id) || 'No city assigned' }}
              </span>
            </div>
            <div v-if="tenant.logo_url" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-photo" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300 truncate">Logo configured</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300">
                Created {{ formatDate(tenant.created_at) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-ink-100 dark:border-ink-800">
            <button
              @click="openDialog(tenant)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit
            </button>
            <button
              @click="viewMenus(tenant)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              Menus
            </button>
            <button
              @click="manageUsers(tenant)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-users" class="w-4 h-4" />
              Users
            </button>
            <button
              @click="openSeedDialog(tenant)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-cloud-arrow-up" class="w-4 h-4" />
              Seed Menu
            </button>
            <button
              @click="confirmDelete(tenant)"
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
            <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            No tenants yet
          </h3>
          <p class="text-ink-600 dark:text-ink-400 mb-8 text-lg">
            Get started by creating your first tenant account. Tenants represent restaurants or cafés that will use your platform.
          </p>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 mx-auto"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create Your First Tenant
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Modal Component -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="dialogOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="dialogOpen = false"
        >
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="dialogOpen = false"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                {{ editingTenant ? 'Edit Tenant' : 'Create New Tenant' }}
              </h2>
              <button
                @click="dialogOpen = false"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            
            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="handleSave" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Restaurant name"
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
                    placeholder="restaurant-slug"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    Used in URLs (e.g., /menu?tenant=restaurant-slug)
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    City
                  </label>
                  <select
                    v-model="form.city_id"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option :value="null">No city</option>
                    <option v-for="city in cities" :key="city.id" :value="city.id">
                      {{ city.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Logo URL
                  </label>
                  <input
                    v-model="form.logo_url"
                    type="url"
                    placeholder="https://..."
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Status
                  </label>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="form.is_active = !form.is_active"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        form.is_active ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          form.is_active ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-ink-600 dark:text-ink-400">
                      {{ form.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    Inactive tenants won't be accessible
                  </p>
                </div>
              </form>
            </div>
            
            <!-- Footer -->
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="dialogOpen = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleSave"
                :disabled="saving"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="saving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                {{ editingTenant ? 'Update Tenant' : 'Create Tenant' }}
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
                    Delete Tenant
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-4">
                    Are you sure you want to delete <strong>{{ deletingTenant?.name }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400 mb-4">
                    This action cannot be undone. All menus, categories, and items associated with this tenant will be deleted.
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
                Delete Tenant
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Seed Menu Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSeedDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeSeedDialog"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeSeedDialog"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <div>
                <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                  Seed Menu Content
                </h2>
                <p class="mt-1 text-sm text-ink-500 dark:text-ink-400">
                  Provide categories and items as JSON to populate {{ seedingTenant?.name }}.
                </p>
              </div>
              <button
                @click="closeSeedDialog"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                  JSON Payload
                </label>
                <textarea
                  v-model="seedJson"
                  rows="14"
                  class="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm font-mono leading-relaxed text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent p-4"
                  :placeholder="seedMenuJsonPlaceholder"
                />
              </div>
              <div v-if="seedValidationError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                {{ seedValidationError }}
              </div>
              <div class="rounded-xl border border-ink-200 bg-ink-50 px-4 py-4 text-sm text-ink-600 dark:border-ink-700 dark:bg-ink-900/40 dark:text-ink-300">
                <p class="font-semibold text-ink-700 dark:text-ink-200">Tips</p>
                <ul class="mt-2 space-y-1">
                  <li>Categories are created in the order provided. Items inherit their category.</li>
                  <li>Each item requires a name, price, and currency. Tags and images are optional.</li>
                  <li> Existing menu data remains untouched. Run multiple times to append more content.</li>
                </ul>
              </div>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="closeSeedDialog"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleSeed"
                :disabled="seedLoading"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="seedLoading" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-cloud-arrow-up" class="w-4 h-4" />
                Seed Menu
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- View Menus Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showMenusDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showMenusDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showMenusDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                Menus for {{ viewingTenant?.name }}
              </h2>
              <button
                @click="showMenusDialog = false"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="loadingMenus" class="text-center py-12">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-brand-500 mx-auto mb-2" />
                <p class="text-ink-600 dark:text-ink-400">Loading menus...</p>
              </div>
              <div v-else-if="tenantMenus.length === 0" class="text-center py-12">
                <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-ink-400 mx-auto mb-2" />
                <p class="text-ink-600 dark:text-ink-400">No menus found for this tenant.</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="menu in tenantMenus"
                  :key="menu.id"
                  class="bg-ink-50 dark:bg-ink-800 rounded-xl p-4 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
                >
                  <h4 class="font-semibold text-lg text-ink-900 dark:text-white mb-2">{{ menu.name }}</h4>
                  <p class="text-sm text-ink-600 dark:text-ink-400 mb-3">
                    Slug: <code class="px-2 py-1 bg-white dark:bg-ink-900 rounded text-xs">{{ menu.slug }}</code>
                  </p>
                  <div class="flex gap-2 flex-wrap">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        menu.is_published
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-400'
                      ]"
                    >
                      {{ menu.is_published ? 'Published' : 'Draft' }}
                    </span>
                    <span
                      v-if="menu.is_default"
                      class="px-2 py-1 rounded text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400"
                    >
                      Default
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end">
              <button
                @click="showMenusDialog = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Manage Users Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showUsersDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showUsersDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showUsersDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                Manage Users for {{ managingTenant?.name }}
              </h2>
              <button
                @click="showUsersDialog = false"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-ink-900 dark:text-white">Tenant Users</h3>
                <button
                  @click="showAddUserDialog = true"
                  class="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors flex items-center gap-2"
                >
                  <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                  Add User
                </button>
              </div>
              <div v-if="loadingUsers" class="text-center py-12">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-brand-500 mx-auto mb-2" />
                <p class="text-ink-600 dark:text-ink-400">Loading users...</p>
              </div>
              <div v-else-if="tenantUsers.length === 0" class="text-center py-12">
                <UIcon name="i-heroicons-users" class="w-8 h-8 text-ink-400 mx-auto mb-2" />
                <p class="text-ink-600 dark:text-ink-400 mb-4">No users assigned to this tenant.</p>
                <button
                  @click="showAddUserDialog = true"
                  class="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors flex items-center gap-2 mx-auto"
                >
                  <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                  Add User
                </button>
              </div>
              <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="user in tenantUsers"
                  :key="user.user_id"
                  class="bg-ink-50 dark:bg-ink-800 rounded-xl p-4 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h4 class="font-semibold text-ink-900 dark:text-white">{{ user.full_name || user.email }}</h4>
                        <span
                          v-if="user.is_owner"
                          class="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        >
                          Owner
                        </span>
                      </div>
                      <p class="text-sm text-ink-600 dark:text-ink-400 mb-3">{{ user.email }}</p>
                      <span
                        :class="[
                          'px-2 py-1 rounded text-xs font-medium',
                          getRoleColor(user.role) === 'primary'
                            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                            : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-400'
                        ]"
                      >
                        {{ user.role }}
                      </span>
                    </div>
                    <div class="flex gap-2 ml-4">
                      <button
                        @click="editUser(user)"
                        class="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                      >
                        <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                      </button>
                      <button
                        @click="confirmRemoveUser(user)"
                        class="p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end">
              <button
                @click="showUsersDialog = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add/Edit User Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddUserDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showAddUserDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showAddUserDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">
                {{ editingUser ? 'Edit User' : 'Add User to Tenant' }}
              </h2>
              <button
                @click="showAddUserDialog = false; editingUser = null"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="editingUser ? handleUpdateUser() : handleAddUser()" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="userForm.email"
                    type="email"
                    placeholder="admin@example.com"
                    :disabled="editingUser !== null"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
                  />
                  <p v-if="editingUser" class="text-xs text-ink-500 dark:text-ink-400 mt-2">Email cannot be changed</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    {{ editingUser ? 'New Password (optional)' : 'Password' }}
                    <span v-if="!editingUser" class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="userForm.password"
                    type="password"
                    :placeholder="editingUser ? 'Leave blank to keep current password' : 'Secure password'"
                    :required="!editingUser"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    {{ editingUser ? 'Leave blank to keep current password' : 'User will need this password to login' }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Full Name
                  </label>
                  <input
                    v-model="userForm.full_name"
                    type="text"
                    placeholder="Optional full name"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="userForm.role"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Owner
                  </label>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="userForm.is_owner = !userForm.is_owner"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        userForm.is_owner ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          userForm.is_owner ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-ink-600 dark:text-ink-400">
                      {{ userForm.is_owner ? 'Tenant Owner' : 'Regular User' }}
                    </span>
                  </div>
                </div>
              </form>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="showAddUserDialog = false; editingUser = null"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="editingUser ? handleUpdateUser() : handleAddUser()"
                :disabled="savingUser"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="savingUser" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                {{ editingUser ? 'Update User' : 'Add User' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Remove User Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showRemoveUserDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showRemoveUserDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showRemoveUserDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-lg w-full z-10">
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div class="shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-ink-900 dark:text-white mb-2">
                    Remove User from Tenant
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-2">
                    Are you sure you want to remove <strong>{{ removingUser?.full_name || removingUser?.email }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400">
                    This user will lose access to this tenant's dashboard. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="showRemoveUserDialog = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleRemoveUser"
                class="px-6 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center gap-2"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                Remove User
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { Tenant, City, Menu } from '~/types/database'
import { useMenu } from '~/composables/useMenu'

definePageMeta({
  layout: 'super',
  middleware: ['super-admin']
})

const seedMenuJsonPlaceholder = ref<string>(`{
  "categories": [
    {
      "name": "Emri i kategorisë",
      "description": "Përshkrim opsional për kategorinë",
      "sort_order": 1,
      "is_special": false,
      "visible": true,
      "items": [
        {
          "name": "Emri i produktit",
          "description": "Përshkrim i produktit dhe përbërësit kryesorë",
          "price": 0.00,
          "currency": "EUR",
          "tags": ["etiketë1", "etiketë2"],
          "image_url": "https://shembull.com/image.jpg"
        }
      ]
    }
  ]
}`)

const { client } = useSupabaseClientStrict()
const { listMenusByTenant } = useMenu()
const toast = useToast()

const DEFAULT_MENU_TEMPLATE_KEY = 'luxury-gold'
const DEFAULT_MENU_SLUG = 'main'

const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  city_id: z.number().nullable().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean()
})

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer']),
  is_owner: z.boolean()
})

const editUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  full_name: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer']),
  is_owner: z.boolean()
})

const seedMenuItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative('Price must be zero or positive'),
  currency: z.string().min(1, 'Currency is required').default('EUR'),
  tags: z.array(z.string()).optional(),
  image_url: z.string().url().nullable().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
  attributes: z.record(z.any()).optional()
})

const seedMenuCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().nullable().optional(),
  sort_order: z.number().int().nonnegative().optional(),
  is_special: z.boolean().optional(),
  visible: z.boolean().optional(),
  items: z.array(seedMenuItemSchema).optional()
})

const seedMenuPayloadSchema = z.object({
  categories: z.array(seedMenuCategorySchema).min(1, 'Provide at least one category')
})

const tenants = ref<(Tenant & { city?: City })[]>([])
const cities = ref<City[]>([])
const loading = ref(true)
const dialogOpen = ref(false)
const showDeleteDialog = ref(false)
const showMenusDialog = ref(false)
const showUsersDialog = ref(false)
const showAddUserDialog = ref(false)
const showRemoveUserDialog = ref(false)
const editingTenant = ref<Tenant | null>(null)
const deletingTenant = ref<Tenant | null>(null)
const viewingTenant = ref<Tenant | null>(null)
const managingTenant = ref<Tenant | null>(null)
const tenantMenus = ref<Menu[]>([])
const loadingMenus = ref(false)
const tenantUsers = ref<any[]>([])
const loadingUsers = ref(false)
const removingUser = ref<any | null>(null)
const editingUser = ref<any | null>(null)
const saving = ref(false)
const savingUser = ref(false)
const showSeedDialog = ref(false)
const seedingTenant = ref<Tenant | null>(null)
const seedJson = ref('')
const seedLoading = ref(false)
const seedValidationError = ref<string | null>(null)

const form = reactive({
  name: '',
  slug: '',
  city_id: null as number | null,
  logo_url: '',
  is_active: true
})

const userForm = reactive({
  email: '',
  password: '',
  full_name: '',
  role: 'admin' as 'admin' | 'editor' | 'viewer',
  is_owner: false
})

const cityOptions = computed(() => [
  { label: 'No city', value: null },
  ...cities.value.map(c => ({ label: c.name, value: c.id }))
])

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' }
]

const activeCount = computed(() => tenants.value.filter(t => t.is_active).length)
const inactiveCount = computed(() => tenants.value.filter(t => !t.is_active).length)

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'primary'
    case 'editor':
      return 'primary'
    case 'viewer':
      return 'gray'
    default:
      return 'gray'
  }
}

const getCityName = (cityId: number | null) => {
  if (!cityId) return null
  const city = cities.value.find(c => c.id === cityId)
  return city?.name || null
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const loadData = async () => {
  loading.value = true
  
  try {
    const { data: tenantsData, error: tenantsError } = await client
      .from('tenants')
      .select('*')
      .order('name')
    
    const { data: citiesData, error: citiesError } = await client
      .from('cities')
      .select('*')
      .order('name')
    
    if (tenantsError) throw tenantsError
    if (citiesError) throw citiesError
    
    tenants.value = (tenantsData || []) as (Tenant & { city?: City })[]
    cities.value = (citiesData || []) as City[]
  } catch (err: unknown) {
    const errObj = err as { message?: string; code?: string; details?: string }
    toast.add({
      title: 'Error Loading Data',
      description: errObj.message || 'Failed to load tenants',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (tenant?: Tenant) => {
  console.log('🔓 Opening dialog, tenant:', tenant)
  if (tenant) {
    editingTenant.value = tenant
    form.name = tenant.name
    form.slug = tenant.slug
    form.city_id = tenant.city_id
    form.logo_url = tenant.logo_url || ''
    form.is_active = tenant.is_active
  } else {
    editingTenant.value = null
    form.name = ''
    form.slug = ''
    form.city_id = null
    form.logo_url = ''
    form.is_active = true
  }
  dialogOpen.value = true
  console.log('🔓 Dialog state:', dialogOpen.value)
}

const openSeedDialog = (tenant: Tenant) => {
  seedingTenant.value = tenant
  seedJson.value = ''
  seedValidationError.value = null
  showSeedDialog.value = true
}

const closeSeedDialog = () => {
  showSeedDialog.value = false
  seedingTenant.value = null
  seedJson.value = ''
  seedValidationError.value = null
}

const handleSave = async (e?: Event) => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  
  // Validate form
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
    if (editingTenant.value) {
      await client
        .from('tenants')
        .update({
          name: form.name,
          slug: form.slug,
          city_id: form.city_id,
          logo_url: form.logo_url || null,
          is_active: form.is_active
        })
        .eq('id', editingTenant.value.id)
      
      toast.add({
        title: 'Success',
        description: `${form.name} tenant updated successfully`,
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    } else {
      const { data: createdTenant, error: createTenantError } = await client
        .from('tenants')
        .insert({
          name: form.name,
          slug: form.slug,
          city_id: form.city_id,
          logo_url: form.logo_url || null,
          is_active: form.is_active
        })
        .select('*')
        .single()

      if (createTenantError || !createdTenant) {
        throw createTenantError || new Error('Failed to create tenant')
      }

      await createDefaultMenuForTenant(createdTenant.id)

      toast.add({
        title: 'Success',
        description: `${form.name} tenant created successfully`,
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
      description: err.message || 'Failed to save tenant',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const createDefaultMenuForTenant = async (tenantId: string) => {
  try {
    const { error: menuError } = await client
      .from('menus')
      .insert({
        tenant_id: tenantId,
        name: 'Main Menu',
        slug: DEFAULT_MENU_SLUG,
        template_key: DEFAULT_MENU_TEMPLATE_KEY,
        design_config: {},
        is_published: false,
        is_default: true
      })

    if (menuError && menuError.code !== '23505') {
      throw menuError
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Menu setup notice',
      description: err.message || 'Tenant was created, but the default menu could not be generated automatically. Please create one manually.',
      color: 'yellow',
      icon: 'i-heroicons-exclamation-triangle',
      timeout: 6000
    })
  }
}

const confirmDelete = (tenant: Tenant) => {
  console.log('🗑️ Confirming delete for tenant:', tenant.name)
  deletingTenant.value = tenant
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deletingTenant.value) return
  
  try {
    const tenantName = deletingTenant.value.name
    await client
      .from('tenants')
      .delete()
      .eq('id', deletingTenant.value.id)
    
    await loadData()
    showDeleteDialog.value = false
    deletingTenant.value = null
    
    toast.add({
      title: 'Success',
      description: `${tenantName} tenant deleted successfully`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to delete tenant',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const handleSeed = async () => {
  if (!seedingTenant.value) return
  seedValidationError.value = null

  if (!seedJson.value || seedJson.value.trim().length === 0) {
    seedValidationError.value = 'Provide the JSON payload before seeding.'
    return
  }

  let parsedPayload: unknown
  try {
    parsedPayload = JSON.parse(seedJson.value)
  } catch (error: unknown) {
    seedValidationError.value = `Invalid JSON: ${(error as Error).message}`
    return
  }

  const validation = seedMenuPayloadSchema.safeParse(parsedPayload)
  if (!validation.success) {
    seedValidationError.value = validation.error.errors.map(issue => issue.message).join('; ')
    return
  }

  seedLoading.value = true
  const tenantName = seedingTenant.value.name

  try {
    const { data: { session } } = await client.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No active session')
    }

    await $fetch('/api/super/seed-tenant', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      },
      body: {
        tenantId: seedingTenant.value.id,
        payload: validation.data
      }
    })

    toast.add({
      title: 'Success',
      description: `${tenantName} menu seeded successfully`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })

    closeSeedDialog()
  } catch (error: unknown) {
    const err = error as { data?: { statusMessage?: string; message?: string }; message?: string }
    toast.add({
      title: 'Error',
      description: err.data?.statusMessage || err.data?.message || err.message || 'Failed to seed menu',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    seedLoading.value = false
  }
}

const viewMenus = async (tenant: Tenant) => {
  console.log('📋 Viewing menus for tenant:', tenant.name)
  viewingTenant.value = tenant
  showMenusDialog.value = true
  loadingMenus.value = true
  
  try {
    tenantMenus.value = await listMenusByTenant(tenant.id)
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to load menus',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loadingMenus.value = false
  }
}

const manageUsers = async (tenant: Tenant) => {
  console.log('👥 Managing users for tenant:', tenant.name)
  managingTenant.value = tenant
  showUsersDialog.value = true
  loadingUsers.value = true
  
  try {
    const { data: tenantUsersData, error: usersError } = await client
      .from('tenant_users')
      .select('*, user:profiles(*)')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    
    if (usersError) throw usersError
    
    tenantUsers.value = (tenantUsersData || []).map((tu: any) => ({
      user_id: tu.user_id,
      tenant_id: tu.tenant_id,
      role: tu.role,
      is_owner: tu.is_owner,
      created_at: tu.created_at,
      email: tu.user?.email || 'N/A',
      full_name: tu.user?.full_name || tu.user?.email?.split('@')[0] || 'No name'
    }))
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to load users',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loadingUsers.value = false
  }
}

const handleAddUser = async () => {
  if (!managingTenant.value) return
  
  savingUser.value = true
  try {
    const userEmail = userForm.email
    const { data: { session } } = await client.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No active session')
    }
    
    const result = await $fetch('/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: {
        email: userForm.email,
        password: userForm.password,
        full_name: userForm.full_name || null,
        tenant_id: managingTenant.value.id,
        role: userForm.role
      }
    })
    
    if (userForm.is_owner && result?.user_id) {
      await client
        .from('tenant_users')
        .update({ is_owner: true })
        .eq('tenant_id', managingTenant.value.id)
        .eq('user_id', result.user_id)
    }
    
    await manageUsers(managingTenant.value)
    showAddUserDialog.value = false
    editingUser.value = null
    userForm.email = ''
    userForm.password = ''
    userForm.full_name = ''
    userForm.role = 'admin'
    userForm.is_owner = false
    
    toast.add({
      title: 'Success',
      description: `${userEmail} added to ${managingTenant.value.name}`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (err: unknown) {
    const error = err as { data?: { statusMessage?: string }; message?: string }
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || error.message || 'Failed to create user',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    savingUser.value = false
  }
}

const editUser = (user: any) => {
  editingUser.value = user
  userForm.email = user.email
  userForm.password = ''
  userForm.full_name = user.full_name || ''
  userForm.role = user.role
  userForm.is_owner = user.is_owner
  showAddUserDialog.value = true
}

const handleUpdateUser = async () => {
  if (!editingUser.value || !managingTenant.value) return
  
  savingUser.value = true
  try {
    const userEmail = userForm.email
    const { data: { session } } = await client.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No active session')
    }
    
    await client
      .from('tenant_users')
      .update({
        role: userForm.role,
        is_owner: userForm.is_owner
      })
      .eq('tenant_id', managingTenant.value.id)
      .eq('user_id', editingUser.value.user_id)
    
    if (userForm.password && userForm.password.length > 0) {
      await $fetch('/api/admin/update-user-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: {
          user_id: editingUser.value.user_id,
          password: userForm.password
        }
      })
    }
    
    if (userForm.full_name !== editingUser.value.full_name) {
      await client
        .from('profiles')
        .update({ full_name: userForm.full_name || null })
        .eq('id', editingUser.value.user_id)
    }
    
    await manageUsers(managingTenant.value)
    showAddUserDialog.value = false
    editingUser.value = null
    userForm.email = ''
    userForm.password = ''
    userForm.full_name = ''
    userForm.role = 'admin'
    userForm.is_owner = false
    
    toast.add({
      title: 'Success',
      description: `${userEmail} updated successfully`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (err: unknown) {
    const error = err as { data?: { statusMessage?: string }; message?: string }
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || error.message || 'Failed to update user',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    savingUser.value = false
  }
}

const confirmRemoveUser = (user: any) => {
  removingUser.value = user
  showRemoveUserDialog.value = true
}

const handleRemoveUser = async () => {
  if (!removingUser.value || !managingTenant.value) return
  
  try {
    const removedUserLabel = removingUser.value.full_name || removingUser.value.email
    await client
      .from('tenant_users')
      .delete()
      .eq('tenant_id', managingTenant.value.id)
      .eq('user_id', removingUser.value.user_id)
    
    await manageUsers(managingTenant.value)
    showRemoveUserDialog.value = false
    removingUser.value = null
    
    toast.add({
      title: 'Success',
      description: `${removedUserLabel} removed from ${managingTenant.value.name}`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to remove user',
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
