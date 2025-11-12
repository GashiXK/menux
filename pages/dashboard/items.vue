<template>
  <div class="space-y-10">
    <section class="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-brand-500/15 via-white to-secondary/15 px-6 py-10 shadow-xl shadow-brand-500/10 dark:border-ink-800 dark:from-brand-900/30 dark:via-ink-950 dark:to-secondary/20 sm:px-10">
      <div class="absolute inset-0 opacity-40">
        <div class="absolute -left-16 top-[-40px] h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />
        <div class="absolute bottom-[-60px] right-[-30px] h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
      </div>
      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-4">
          <span class="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-700 dark:text-brand-300">
            Menu inventory
          </span>
          <div>
            <h1 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Menu items</h1>
            <p class="mt-2 max-w-2xl text-sm text-ink-600 dark:text-ink-300 sm:text-base">
              Curate every plate and beverage with rich descriptions, imagery, and pricing designed to convert.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              size="md"
              icon="i-heroicons-plus-circle"
              label="Add item"
              :disabled="!selectedCategoryId"
              @click="openDialog()"
            />
            <UButton to="/dashboard/categories" variant="soft" size="md" icon="i-heroicons-folder" label="Manage categories" />
          </div>
        </div>
        <div class="grid w-full max-w-xs gap-4 rounded-3xl bg-white/80 p-5 text-sm text-ink-600 shadow-lg dark:bg-ink-950/75 dark:text-ink-300">
          <div class="flex items-center justify-between">
            <span class="font-medium">Published items</span>
            <span v-if="loading" class="h-6 w-12 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <span v-else class="text-lg font-semibold text-ink-900 dark:text-white">{{ activeCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-medium">Draft items</span>
            <span v-if="loading" class="h-6 w-12 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <span v-else class="text-lg font-semibold text-ink-900 dark:text-white">{{ inactiveCount }}</span>
          </div>
          <div class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-500">
            <span>Last update</span>
            <span>{{ lastUpdated }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-ink-100 bg-white px-6 py-6 shadow-md dark:border-ink-800 dark:bg-ink-900 sm:px-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-ink-400 dark:text-ink-500">Category focus</p>
          <h2 class="text-xl font-semibold text-ink-900 dark:text-white">
            {{ selectedCategoryName || 'Select a category' }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <select
            v-model="selectedCategoryId"
            @change="loadItems"
            class="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 md:w-72"
          >
            <option value="">Choose a category to manage items</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="rounded-2xl border border-ink-100 bg-white p-6 shadow-md animate-pulse dark:border-ink-800 dark:bg-ink-900">
        <div class="mb-4 h-4 w-2/3 rounded bg-ink-200 dark:bg-ink-700" />
        <div class="mb-2 h-3 w-full rounded bg-ink-200 dark:bg-ink-700" />
        <div class="h-3 w-3/4 rounded bg-ink-200 dark:bg-ink-700" />
      </div>
    </div>

    <div v-else-if="items.length > 0 && selectedCategoryId" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="group rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-xl dark:border-ink-800 dark:bg-ink-900/80"
      >
        <div class="mb-6 flex items-start justify-between">
          <div class="flex flex-1 items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25">
              <UIcon name="i-heroicons-shopping-bag" class="h-7 w-7" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-xl font-semibold text-ink-900 dark:text-white">{{ item.name }}</h3>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
                <span class="text-lg font-semibold text-brand-600 dark:text-brand-300">
                  {{ formatPrice(item.price, item.currency) }}
                </span>
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-[0.3em]',
                    item.is_active
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                      : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                  ]"
                >
                  {{ item.is_active ? 'Active' : 'Draft' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 text-sm text-ink-600 dark:text-ink-300">
          <p v-if="item.description" class="line-clamp-3 leading-relaxed">{{ item.description }}</p>
          <p v-else class="italic text-ink-400 dark:text-ink-500">No description provided</p>
          <p class="text-xs text-ink-400 dark:text-ink-500">Display order {{ item.sort_order }}</p>
        </div>

        <div class="mt-6 flex flex-wrap gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button
            @click="openDialog(item)"
            class="flex-1 min-w-[110px] rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-300"
          >
            Edit
          </button>
          <button
            @click="confirmDelete(item)"
            class="flex-1 min-w-[110px] rounded-xl border border-red-200 bg-red-50/70 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="selectedCategoryId && !loading" class="flex min-h-[50vh] items-center justify-center">
      <div class="max-w-md text-center">
        <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-2xl shadow-brand-500/30">
          <UIcon name="i-heroicons-squares-plus" class="h-12 w-12" />
        </div>
        <h3 class="text-2xl font-semibold text-ink-900 dark:text-white">No items yet</h3>
        <p class="mt-3 text-sm text-ink-600 dark:text-ink-300">
          Add your first item to this category to bring the page to life. Items sync instantly with your published menu.
        </p>
        <UButton class="mt-6" color="primary" size="md" icon="i-heroicons-plus-circle" label="Add item" @click="openDialog()" />
      </div>
    </div>

    <div v-else-if="!selectedCategoryId" class="flex min-h-[50vh] items-center justify-center">
      <div class="max-w-md text-center">
        <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-ink-100 text-ink-500 shadow-inner dark:bg-ink-900 dark:text-ink-300">
          <UIcon name="i-heroicons-folder-open" class="h-12 w-12" />
        </div>
        <h3 class="text-2xl font-semibold text-ink-900 dark:text-white">Select a category</h3>
        <p class="mt-3 text-sm text-ink-600 dark:text-ink-300">
          Choose a category above to review and edit the items inside. Create a new category first if you are starting from scratch.
        </p>
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
                {{ editingItem ? 'Edit Menu Item' : 'Create New Menu Item' }}
              </h2>
              <button
                @click="dialogOpen = false"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="handleSave" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Item Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g., Margherita Pizza, Caesar Salad"
                    required
                    autofocus
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Description
                  </label>
                  <textarea
                    v-model="form.description"
                    placeholder="Describe the item (ingredients, preparation, etc.)"
                    rows="3"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Price <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="form.price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Currency <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.currency"
                      type="text"
                      placeholder="EUR"
                      required
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Sort Order
                    </label>
                    <input
                      v-model.number="form.sort_order"
                      type="number"
                      min="0"
                      placeholder="0"
                      class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                      Status
                    </label>
                    <div class="flex items-center gap-3 pt-2">
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
                @click="handleSave"
                :disabled="saving"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="saving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                {{ editingItem ? 'Update Item' : 'Create Item' }}
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
                    Delete Menu Item
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-4">
                    Are you sure you want to delete <strong>{{ deletingItem?.name }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400">
                    This action cannot be undone. The item will be permanently removed from your menu.
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
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem, Category } from '~/types/database'
import { useMenuItems } from '~/composables/useMenuItems'
import { useCategories } from '~/composables/useCategories'
import { useMenu } from '~/composables/useMenu'

definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const { currentTenantId } = useTenant()
const { listMenusByTenant } = useMenu()
const { listCategories } = useCategories()
const { listItems, createItem, updateItem, deleteItem } = useMenuItems()
const toast = useToast()

const items = ref<MenuItem[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const dialogOpen = ref(false)
const showDeleteDialog = ref(false)
const editingItem = ref<MenuItem | null>(null)
const deletingItem = ref<MenuItem | null>(null)
const saving = ref(false)
const selectedCategoryId = ref<string>('')

const form = reactive({
  name: '',
  description: '',
  price: 0,
  currency: 'EUR',
  sort_order: 0,
  is_active: true
})

const menuId = ref('')

const activeCount = computed(() => items.value.filter(item => item.is_active).length)
const inactiveCount = computed(() => Math.max(items.value.length - activeCount.value, 0))
const selectedCategoryName = computed(() => categories.value.find(category => category.id === selectedCategoryId.value)?.name ?? '')
const lastUpdated = computed(() => {
  if (!items.value.length) return 'No activity yet'
  const timestamps = items.value
    .map(item => {
      const date = item.created_at ? new Date(item.created_at) : null
      return date && !Number.isNaN(date.getTime()) ? date.getTime() : null
    })
    .filter((value): value is number => value !== null)
  if (!timestamps.length) return 'No activity yet'
  const latest = new Date(Math.max(...timestamps))
  return latest.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2
  }).format(price)
}

const loadCategories = async () => {
  if (!menuId.value) return
  
  try {
    categories.value = await listCategories(menuId.value)
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load categories',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const loadItems = async () => {
  if (!selectedCategoryId.value) {
    items.value = []
    return
  }
  
  loading.value = true
  try {
    items.value = await listItems(selectedCategoryId.value)
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load items',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!currentTenantId.value) {
    toast.add({
      title: 'Error',
      description: 'No tenant information available',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
    return
  }
  
  try {
    const menus = await listMenusByTenant(currentTenantId.value)
    const defaultMenu = menus.find(m => m.is_default) || menus[0]
    if (defaultMenu) {
      menuId.value = defaultMenu.id
      await loadCategories()
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load menus',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
})

watch(selectedCategoryId, () => {
  loadItems()
})

const openDialog = (item?: MenuItem) => {
  if (item) {
    editingItem.value = item
    form.name = item.name
    form.description = item.description || ''
    form.price = item.price
    form.currency = item.currency
    form.sort_order = item.sort_order
    form.is_active = item.is_active
  } else {
    editingItem.value = null
    form.name = ''
    form.description = ''
    form.price = 0
    form.currency = 'EUR'
    form.sort_order = 0
    form.is_active = true
  }
  dialogOpen.value = true
}

const handleSave = async () => {
  if (!selectedCategoryId.value) {
    toast.add({
      title: 'Error',
      description: 'Please select a category first',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }
  
  if (!currentTenantId.value) {
    toast.add({
      title: 'Error',
      description: 'No tenant information available',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  if (!form.name || form.price < 0 || !form.currency) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all required fields with valid values',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }
  
  saving.value = true
  try {
    if (editingItem.value) {
      await updateItem(editingItem.value.id, {
        name: form.name,
        description: form.description || null,
        price: form.price,
        currency: form.currency,
        sort_order: form.sort_order,
        is_active: form.is_active
      })
      
      toast.add({
        title: 'Success',
        description: `${form.name} item updated successfully`,
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    } else {
      await createItem({
        category_id: selectedCategoryId.value,
        tenant_id: currentTenantId.value,
        name: form.name,
        description: form.description || null,
        price: form.price,
        currency: form.currency,
        sort_order: form.sort_order,
        is_active: form.is_active
      })
      
      toast.add({
        title: 'Success',
        description: `${form.name} item created successfully`,
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    }
    
    await loadItems()
    dialogOpen.value = false
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to save item',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: MenuItem) => {
  deletingItem.value = item
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deletingItem.value) return
  
  try {
    const itemName = deletingItem.value.name
    await deleteItem(deletingItem.value.id)
    await loadItems()
    showDeleteDialog.value = false
    deletingItem.value = null
    
    toast.add({
      title: 'Success',
      description: `${itemName} item deleted successfully`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to delete item',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}
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
