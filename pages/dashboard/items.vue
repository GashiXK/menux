<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div class="space-y-2">
          <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
            Menu Items
          </h1>
          <p class="text-ink-600 dark:text-ink-300 text-lg">
            Manage your menu items and pricing
          </p>
        </div>
        <button
          @click="openDialog()"
          :disabled="!selectedCategoryId"
          class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
          Add Item
        </button>
      </div>

      <!-- Category Selector -->
      <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800">
        <div class="flex items-center gap-4">
          <div class="shrink-0 w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <UIcon name="i-heroicons-folder" class="w-6 h-6 text-brand-500" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
              Select Category
            </label>
            <select
              v-model="selectedCategoryId"
              @change="loadItems"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Choose a category to manage items</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats Card -->
      <div v-if="!loading && items.length > 0 && selectedCategoryId" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Total Items in Category</p>
            <p class="text-3xl font-bold text-ink-900 dark:text-white">{{ items.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6 text-brand-500" />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 animate-pulse">
          <div class="h-4 bg-ink-200 dark:bg-ink-700 rounded w-2/3 mb-4"></div>
          <div class="h-3 bg-ink-200 dark:bg-ink-700 rounded w-full mb-2"></div>
          <div class="h-3 bg-ink-200 dark:bg-ink-700 rounded w-3/4"></div>
        </div>
      </div>

      <!-- Items Grid -->
      <div v-else-if="items.length > 0 && selectedCategoryId" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in items"
          :key="item.id"
          class="group bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <!-- Item Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <UIcon name="i-heroicons-shopping-bag" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-ink-900 dark:text-white truncate mb-1">
                  {{ item.name }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-brand-500">
                    {{ formatPrice(item.price, item.currency) }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      item.is_active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-400'
                    ]"
                  >
                    {{ item.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Item Details -->
          <div class="space-y-3 mb-6">
            <div v-if="item.description" class="text-sm text-ink-600 dark:text-ink-300 line-clamp-2">
              {{ item.description }}
            </div>
            <div v-else class="text-sm text-ink-500 dark:text-ink-400 italic">
              No description
            </div>
            <div class="text-xs text-ink-500 dark:text-ink-400">
              Sort Order: {{ item.sort_order }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-ink-100 dark:border-ink-800">
            <button
              @click="openDialog(item)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit
            </button>
            <button
              @click="confirmDelete(item)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State - No Items -->
      <div v-else-if="selectedCategoryId && !loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/30">
            <UIcon name="i-heroicons-squares-plus" class="w-12 h-12 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            No items yet
          </h3>
          <p class="text-ink-600 dark:text-ink-400 mb-8 text-lg">
            Get started by adding your first menu item to this category. Items will appear on your public menu.
          </p>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 mx-auto"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Add Your First Item
          </button>
        </div>
      </div>

      <!-- Empty State - No Category Selected -->
      <div v-else-if="!selectedCategoryId" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <UIcon name="i-heroicons-folder-open" class="w-12 h-12 text-ink-400" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            Select a category
          </h3>
          <p class="text-ink-600 dark:text-ink-400 text-lg">
            Choose a category from the dropdown above to start managing menu items. Create categories first if you don't have any.
          </p>
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
        description: 'Item updated successfully',
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
        description: 'Item created successfully',
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
    await deleteItem(deletingItem.value.id)
    await loadItems()
    showDeleteDialog.value = false
    deletingItem.value = null
    
    toast.add({
      title: 'Success',
      description: 'Item deleted successfully',
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
