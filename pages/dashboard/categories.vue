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
            Menu architecture
          </span>
          <div>
            <h1 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Categories</h1>
            <p class="mt-2 max-w-2xl text-sm text-ink-600 dark:text-ink-300 sm:text-base">
              Compose tasting pathways and organize every item into curated sections that feel effortless to scan.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <UButton color="primary" size="md" icon="i-heroicons-plus-circle" :disabled="!menuId || menuLoading" label="Add category" @click="openDialog()" />
            <UButton to="/dashboard/items" variant="soft" size="md" icon="i-heroicons-squares-2x2" label="Manage items" />
          </div>
          <p v-if="menuLoading" class="text-sm text-ink-500 dark:text-ink-400">Loading your menu structure…</p>
        </div>
        <div class="grid w-full max-w-xs gap-4 rounded-3xl bg-white/80 p-5 text-sm text-ink-600 shadow-lg dark:bg-ink-950/75 dark:text-ink-300">
          <div class="flex items-center justify-between">
            <span class="font-medium">Published categories</span>
            <span v-if="loading" class="h-6 w-12 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <span v-else class="text-lg font-semibold text-ink-900 dark:text-white">{{ visibleCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-medium">Hidden drafts</span>
            <span v-if="loading" class="h-6 w-12 rounded bg-ink-200/70 dark:bg-ink-800/70 animate-pulse" />
            <span v-else class="text-lg font-semibold text-ink-900 dark:text-white">{{ hiddenCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-medium">Last updated</span>
            <span class="text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-500">
              {{ lastUpdated }}
            </span>
          </div>
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

    <div v-else-if="categories.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="group rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-xl dark:border-ink-800 dark:bg-ink-900/80"
      >
        <div class="mb-6 flex items-start justify-between">
          <div class="flex flex-1 items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25">
              <UIcon name="i-heroicons-folder" class="h-7 w-7" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-xl font-semibold text-ink-900 dark:text-white truncate">{{ category.name }}</h3>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-[0.3em]',
                    category.visible
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                      : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                  ]"
                >
                  {{ category.visible ? 'Visible' : 'Hidden' }}
                </span>
                <span>Order {{ category.sort_order }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 text-sm text-ink-600 dark:text-ink-300">
          <p v-if="category.description" class="line-clamp-3 leading-relaxed">{{ category.description }}</p>
          <p v-else class="italic text-ink-400 dark:text-ink-500">No description</p>
        </div>

        <div class="mt-6 flex flex-wrap gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button
            @click="openDialog(category)"
            class="flex-1 min-w-[110px] rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-300"
          >
            Edit
          </button>
          <button
            @click="confirmDelete(category)"
            class="flex-1 min-w-[110px] rounded-xl border border-red-200 bg-red-50/70 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex min-h-[50vh] items-center justify-center">
      <div class="max-w-md text-center">
        <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-2xl shadow-brand-500/30">
          <UIcon name="i-heroicons-folder" class="h-12 w-12" />
        </div>
        <h3 class="text-2xl font-semibold text-ink-900 dark:text-white">No categories yet</h3>
        <p class="mt-3 text-sm text-ink-600 dark:text-ink-300">
          Create your first category to organize the story across your sections. Guests discover faster when your menu has rhythm.
        </p>
        <UButton class="mt-6" color="primary" size="md" icon="i-heroicons-plus-circle" label="Create category" @click="openDialog()" />
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
                {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
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
                    Category Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g., Appetizers, Main Courses, Desserts"
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
                    placeholder="Optional description for this category"
                    rows="3"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
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
                      Visibility
                    </label>
                    <div class="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        @click="form.visible = !form.visible"
                        :class="[
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          form.visible ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'
                        ]"
                      >
                        <span
                          :class="[
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            form.visible ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        />
                      </button>
                      <span class="text-sm text-ink-600 dark:text-ink-400">
                        {{ form.visible ? 'Visible' : 'Hidden' }}
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
                {{ editingCategory ? 'Update Category' : 'Create Category' }}
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
                    Delete Category
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-4">
                    Are you sure you want to delete <strong>{{ deletingCategory?.name }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400">
                    This will permanently delete the category and all items within it. This action cannot be undone.
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
                Delete Category
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Category, Menu } from '~/types/database'
import { useCategories } from '~/composables/useCategories'
import { useMenu } from '~/composables/useMenu'

definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const { currentTenantId } = useTenant()
const { listMenusByTenant } = useMenu()
const { listCategories, createCategory, updateCategory, deleteCategory } = useCategories()
const toast = useToast()

const categories = ref<Category[]>([])
const menus = ref<Menu[]>([])
const loading = ref(false)
const menuLoading = ref(false)
const dialogOpen = ref(false)
const showDeleteDialog = ref(false)
const editingCategory = ref<Category | null>(null)
const deletingCategory = ref<Category | null>(null)
const saving = ref(false)

const form = reactive({
  name: '',
  description: '',
  sort_order: 0,
  visible: true
})

const menuId = ref('')

const visibleCount = computed(() => categories.value.filter(category => category.visible).length)
const hiddenCount = computed(() => Math.max(categories.value.length - visibleCount.value, 0))
const lastUpdated = computed(() => {
  if (!categories.value.length) return 'No activity yet'
  const timestamps = categories.value
    .map(category => {
      const date = category.created_at ? new Date(category.created_at) : null
      return date && !Number.isNaN(date.getTime()) ? date.getTime() : null
    })
    .filter((value): value is number => value !== null)
  if (!timestamps.length) return 'No activity yet'
  const latest = new Date(Math.max(...timestamps))
  return latest.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})

const loadCategories = async () => {
  if (!menuId.value) return
  
  loading.value = true
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
  } finally {
    loading.value = false
  }
}

const loadMenus = async (tenantId: string) => {
  menuLoading.value = true
  try {
    const fetched = await listMenusByTenant(tenantId)
    menus.value = fetched
    if (!fetched.length) {
      menuId.value = ''
      categories.value = []
      return
    }
    const preferredMenu = fetched.find(menu => menu.is_default) ?? fetched[0]
    if (preferredMenu && preferredMenu.id !== menuId.value) {
      menuId.value = preferredMenu.id
    } else if (menuId.value) {
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
  } finally {
    menuLoading.value = false
  }
}

watch(menuId, async newMenuId => {
  if (!newMenuId) {
    categories.value = []
    return
  }
  await loadCategories()
})

watch(
  currentTenantId,
  async tenantId => {
    if (!tenantId) {
      menuId.value = ''
      menus.value = []
      categories.value = []
      return
    }
    await loadMenus(tenantId)
  },
  { immediate: true }
)

const openDialog = (category?: Category) => {
  if (category) {
    editingCategory.value = category
    form.name = category.name
    form.description = category.description || ''
    form.sort_order = category.sort_order
    form.visible = category.visible
  } else {
    editingCategory.value = null
    form.name = ''
    form.description = ''
    form.sort_order = 0
    form.visible = true
  }
  dialogOpen.value = true
}

const handleSave = async () => {
  if (!menuId.value) {
    toast.add({
      title: 'Error',
      description: 'No menu selected',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }
  
  if (!form.name) {
    toast.add({
      title: 'Validation Error',
      description: 'Category name is required',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }
  
  saving.value = true
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, {
        name: form.name,
        description: form.description || null,
        sort_order: form.sort_order,
        visible: form.visible
      })
      
      toast.add({
        title: 'Success',
        description: 'Category updated successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    } else {
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
      
      await createCategory({
        menu_id: menuId.value,
        tenant_id: currentTenantId.value,
        name: form.name,
        description: form.description || null,
        sort_order: form.sort_order,
        visible: form.visible
      })
      
      toast.add({
        title: 'Success',
        description: 'Category created successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    }
    
    await loadCategories()
    dialogOpen.value = false
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to save category',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (category: Category) => {
  deletingCategory.value = category
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deletingCategory.value) return
  
  try {
    await deleteCategory(deletingCategory.value.id)
    await loadCategories()
    showDeleteDialog.value = false
    deletingCategory.value = null
    
    toast.add({
      title: 'Success',
      description: 'Category deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to delete category',
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
