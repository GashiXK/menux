<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Modern Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
              Template Management
            </h1>
            <p class="text-ink-600 dark:text-ink-300 text-lg">
              Add and update menu templates
            </p>
          </div>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create Template
          </button>
        </div>
      </div>

      <!-- Stats Card -->
      <div v-if="!loading && templates.length > 0" class="mb-8">
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Total Templates</p>
              <p class="text-3xl font-bold text-ink-900 dark:text-white">{{ templates.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-paint-brush" class="w-6 h-6 text-brand-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 animate-pulse">
          <div class="aspect-video bg-ink-200 dark:bg-ink-700 rounded-xl mb-4"></div>
          <div class="h-4 bg-ink-200 dark:bg-ink-700 rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-ink-200 dark:bg-ink-700 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Templates Grid -->
      <div v-else-if="templates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="template in templates"
          :key="template.key"
          class="group bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          @click="openDialog(template)"
        >
          <!-- Preview Image -->
          <div v-if="template.preview_image_url" class="aspect-video rounded-xl overflow-hidden bg-ink-100 dark:bg-ink-800 mb-4 group-hover:scale-105 transition-transform duration-300">
            <img
              :src="template.preview_image_url"
              :alt="template.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-else class="aspect-video rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-photo" class="w-12 h-12 text-ink-400" />
          </div>

          <!-- Template Info -->
          <div class="mb-6">
            <h3 class="font-bold text-lg text-ink-900 dark:text-white mb-2">
              {{ template.name }}
            </h3>
            <code class="text-xs text-ink-500 dark:text-ink-400 px-2 py-1 bg-ink-50 dark:bg-ink-800 rounded font-mono">
              {{ template.key }}
            </code>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 pt-4 border-t border-ink-100 dark:border-ink-800">
            <button
              @click.stop="openDialog(template)"
              class="flex-1 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit
            </button>
            <button
              @click.stop="confirmDelete(template)"
              class="flex-1 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            <UIcon name="i-heroicons-paint-brush" class="w-12 h-12 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            No templates yet
          </h3>
          <p class="text-ink-600 dark:text-ink-400 mb-8 text-lg">
            Get started by creating your first menu template. Templates define the visual design and layout for menus.
          </p>
          <button
            @click="openDialog()"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 mx-auto"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Create Your First Template
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
                {{ editingTemplate ? 'Edit Template' : 'Create Template' }}
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
                    Key <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.key"
                    type="text"
                    placeholder="template-key"
                    required
                    :disabled="!!editingTemplate"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    Unique identifier (cannot be changed after creation)
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Template name"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Preview Image URL
                  </label>
                  <input
                    v-model="form.preview_image_url"
                    type="url"
                    placeholder="https://..."
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <div v-if="form.preview_image_url" class="mt-4">
                    <img
                      :src="form.preview_image_url"
                      alt="Preview"
                      class="w-full max-w-md rounded-xl border border-ink-200 dark:border-ink-700"
                      @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Base Config (JSON) <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="configJson"
                    placeholder='{"colors": {...}, "fonts": {...}}'
                    rows="12"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm"
                    :class="configError ? 'border-red-500 dark:border-red-500' : ''"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    JSON configuration for the template
                  </p>
                  <div
                    v-if="configError"
                    class="mt-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                  >
                    <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                      {{ configError }}
                    </p>
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
                :disabled="saving || !!configError"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="saving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                {{ editingTemplate ? 'Update Template' : 'Create Template' }}
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
                    Delete Template
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-4">
                    Are you sure you want to delete <strong>{{ deletingTemplate?.name }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400">
                    This action cannot be undone. Menus using this template will need to be updated.
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
                Delete Template
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplate } from '~/types/database'
import { useTemplate } from '~/composables/useTemplate'

definePageMeta({
  layout: 'super',
  middleware: ['super-admin']
})

const { listTemplates, createTemplate, updateTemplate, deleteTemplate } = useTemplate()
const toast = useToast()

const templates = ref<MenuTemplate[]>([])
const loading = ref(true)
const dialogOpen = ref(false)
const showDeleteDialog = ref(false)
const editingTemplate = ref<MenuTemplate | null>(null)
const deletingTemplate = ref<MenuTemplate | null>(null)
const configError = ref<string | null>(null)
const saving = ref(false)

const form = reactive({
  key: '',
  name: '',
  preview_image_url: '',
  base_config: {} as Record<string, unknown>
})

const configJson = computed({
  get: () => {
    try {
      return JSON.stringify(form.base_config, null, 2)
    } catch {
      return '{}'
    }
  },
  set: (val: string) => {
    configError.value = null
    try {
      if (!val.trim()) {
        form.base_config = {}
        return
      }
      form.base_config = JSON.parse(val) as Record<string, unknown>
    } catch (e: unknown) {
      const err = e as { message?: string }
      configError.value = `Invalid JSON: ${err.message || 'Parse error'}`
    }
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const result = await listTemplates()
    templates.value = result || []
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to load templates',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (template?: MenuTemplate) => {
  if (template) {
    editingTemplate.value = template
    form.key = template.key
    form.name = template.name
    form.preview_image_url = template.preview_image_url || ''
    form.base_config = template.base_config || {}
  } else {
    editingTemplate.value = null
    form.key = ''
    form.name = ''
    form.preview_image_url = ''
    form.base_config = {}
  }
  configError.value = null
  dialogOpen.value = true
}

const handleSubmit = async () => {
  if (configError.value) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fix JSON syntax errors',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  if (!form.key || !form.name) {
    toast.add({
      title: 'Validation Error',
      description: 'Key and Name are required',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  saving.value = true
  try {
    if (editingTemplate.value) {
      await updateTemplate(editingTemplate.value.key, {
        name: form.name,
        preview_image_url: form.preview_image_url || null,
        base_config: form.base_config
      })
      toast.add({
        title: 'Success',
        description: 'Template updated successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    } else {
      await createTemplate({
        key: form.key,
        name: form.name,
        preview_image_url: form.preview_image_url || null,
        base_config: form.base_config
      })
      toast.add({
        title: 'Success',
        description: 'Template created successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
      })
    }

    await loadData()
    dialogOpen.value = false
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to save template',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (template: MenuTemplate) => {
  deletingTemplate.value = template
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deletingTemplate.value) return

  try {
    await deleteTemplate(deletingTemplate.value.key)
    await loadData()
    showDeleteDialog.value = false
    deletingTemplate.value = null

    toast.add({
      title: 'Success',
      description: 'Template deleted successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to delete template',
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
