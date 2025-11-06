<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
          Menu Design & Templates
        </h1>
        <p class="text-ink-600 dark:text-ink-300 text-lg">
          Choose a template that matches your restaurant's style or create a custom design
        </p>
      </div>

      <!-- Current Template -->
      <div v-if="currentMenu" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-ink-900 dark:text-white mb-2">Current Template</h2>
            <p class="text-ink-600 dark:text-ink-400">
              {{ currentTemplate?.name || 'No template selected' }}
            </p>
          </div>
          <a
            v-if="currentMenu && currentTenant"
            :href="`/${currentMenu.slug}?tenant=${currentTenant.slug}`"
            target="_blank"
            class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <UIcon name="i-heroicons-eye" class="w-5 h-5" />
            Preview Menu
          </a>
        </div>
      </div>

      <!-- Template Grid -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Choose a Template</h2>
        
        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-ink-200 dark:bg-ink-800 rounded-2xl h-96 animate-pulse"></div>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="template in templates"
            :key="template.key"
            @click="selectTemplate(template)"
            :class="[
              'bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
              currentMenu?.template_key === template.key
                ? 'border-brand-500 ring-2 ring-brand-500/20'
                : 'border-ink-100 dark:border-ink-800 hover:border-brand-300 dark:hover:border-brand-700'
            ]"
          >
            <!-- Template Preview -->
            <div class="aspect-video bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-900 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br opacity-50" :class="getTemplateGradient(template.key)"></div>
              <div class="relative z-10 text-center px-4">
                <h3 class="text-lg font-semibold text-ink-900 dark:text-white mb-1">{{ template.name }}</h3>
                <p class="text-xs text-ink-600 dark:text-ink-400">{{ getTemplateDescription(template.key) }}</p>
              </div>
            </div>

            <!-- Template Info -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-lg text-ink-900 dark:text-white">{{ template.name }}</h3>
                <span
                  v-if="currentMenu?.template_key === template.key"
                  class="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-lg text-xs font-semibold"
                >
                  Active
                </span>
              </div>
              <p class="text-sm text-ink-600 dark:text-ink-400 line-clamp-2">
                {{ getTemplateDescription(template.key) }}
              </p>
            </div>

            <!-- Apply Button -->
            <button
              @click.stop="selectTemplate(template)"
              :class="[
                'w-full mt-4 px-4 py-2 rounded-xl font-semibold transition-all',
                currentMenu?.template_key === template.key
                  ? 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 text-white'
              ]"
              :disabled="currentMenu?.template_key === template.key"
            >
              {{ currentMenu?.template_key === template.key ? 'Current Template' : 'Apply Template' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Template Builder (Coming Soon) -->
      <div class="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-8 border-2 border-brand-200 dark:border-brand-800">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-ink-900 dark:text-white mb-2">Custom Template Builder</h3>
            <p class="text-ink-600 dark:text-ink-400 mb-4">
              Coming soon! Create your own custom template with full control over colors, fonts, layout, and styling.
            </p>
            <button
              disabled
              class="px-4 py-2 bg-ink-200 dark:bg-ink-700 text-ink-500 dark:text-ink-400 rounded-xl font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="previewTemplate" class="modal-overlay" @click.self="previewTemplate = null">
          <div class="modal-container max-w-4xl">
            <div class="modal-header">
              <h3 class="modal-title">Preview: {{ previewTemplate.name }}</h3>
              <button class="modal-close-button" @click="previewTemplate = null">×</button>
            </div>
            <div class="modal-body">
              <div class="aspect-video bg-gradient-to-br rounded-xl mb-4 flex items-center justify-center relative overflow-hidden" :class="getTemplateGradient(previewTemplate.key)">
                <div class="relative z-10 text-center px-4">
                  <h3 class="text-2xl font-semibold text-white mb-2">{{ previewTemplate.name }}</h3>
                  <p class="text-white/80">{{ getTemplateDescription(previewTemplate.key) }}</p>
                </div>
              </div>
              <p class="text-ink-600 dark:text-ink-400 mb-6">
                {{ getTemplateDescription(previewTemplate.key) }}
              </p>
              <div class="flex gap-4">
                <button
                  @click="applyTemplate(previewTemplate)"
                  class="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Apply This Template
                </button>
                <button
                  @click="previewTemplate = null"
                  class="px-6 py-3 bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-400 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const { currentTenantId, currentTenant } = useTenant()
const { listMenusByTenant, updateMenu } = useMenu()
const { client } = useSupabaseClientStrict()
const toast = useToast()

const templates = ref<Array<{ key: string; name: string; preview_image_url: string | null; base_config: any }>>([])
const currentMenu = ref<any>(null)
const currentTemplate = ref<any>(null)
const loading = ref(true)
const previewTemplate = ref<any>(null)

onMounted(async () => {
  await Promise.all([loadTemplates(), loadCurrentMenu()])
  loading.value = false
})

const loadTemplates = async () => {
  try {
    const { data, error } = await client
      .from('menu_templates')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    templates.value = data || []
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load templates',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const loadCurrentMenu = async () => {
  if (!currentTenantId.value) return
  
  try {
    const menus = await listMenusByTenant(currentTenantId.value)
    currentMenu.value = menus.find(m => m.is_default) || menus[0]
    
    if (currentMenu.value?.template_key) {
      const { data } = await client
        .from('menu_templates')
        .select('*')
        .eq('key', currentMenu.value.template_key)
        .single()
      
      currentTemplate.value = data
    }
  } catch (error: unknown) {
    console.error('Error loading current menu:', error)
  }
}

const selectTemplate = (template: any) => {
  if (currentMenu.value?.template_key === template.key) return
  previewTemplate.value = template
}

const applyTemplate = async (template: any) => {
  if (!currentMenu.value) {
    toast.add({
      title: 'Error',
      description: 'No menu found. Please create a menu first.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
    return
  }

  const loadingToast = toast.add({
    title: 'Applying template...',
    description: `Applying ${template.name} to your menu`,
    color: 'primary',
    icon: 'i-heroicons-arrow-path',
    timeout: 0
  })

  try {
    await updateMenu(currentMenu.value.id, {
      template_key: template.key
    })

    currentMenu.value.template_key = template.key
    currentTemplate.value = template
    previewTemplate.value = null

    toast.remove(loadingToast)
    toast.add({
      title: 'Success',
      description: `Template "${template.name}" has been applied to your menu`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.remove(loadingToast)
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to apply template',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const getTemplateGradient = (key: string): string => {
  const gradients: Record<string, string> = {
    'neon-night': 'from-purple-900 via-indigo-900 to-black',
    'minimal-elegance': 'from-gray-50 to-gray-100',
    'dark-glass': 'from-gray-900 via-gray-800 to-black',
    'retro-card': 'from-red-50 to-orange-50',
    'photo-hero': 'from-blue-100 to-purple-100',
    'grid-menu': 'from-green-50 to-emerald-50',
    'split-panels': 'from-teal-50 to-cyan-50',
    'chalk-board': 'from-gray-800 to-gray-900',
    'magazine': 'from-yellow-50 to-amber-50',
    'mono-zen': 'from-gray-100 to-gray-200',
    'elegant-modern': 'from-slate-50 to-slate-100',
    'cosmic-dark': 'from-purple-950 via-slate-950 to-slate-950',
    'glass-morphism': 'from-blue-200 via-purple-200 to-pink-200',
    'luxury-gold': 'from-slate-900 via-amber-900 to-slate-900',
    'tropical-vibes': 'from-orange-200 via-pink-200 to-yellow-200',
    'ocean-breeze': 'from-blue-100 via-cyan-100 to-teal-100',
    'neon-gradient': 'from-purple-900 via-pink-900 to-blue-900',
    'minimalist-white': 'from-white to-gray-50',
    'forest-nature': 'from-green-100 via-emerald-100 to-teal-100',
    'sunset-warm': 'from-orange-100 via-red-100 to-pink-100'
  }
  return gradients[key] || 'from-ink-100 to-ink-200'
}

const getTemplateDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    'neon-night': 'Bold neon colors with glassmorphism effects. Perfect for bars and nightlife venues.',
    'minimal-elegance': 'Clean, minimalist design with elegant typography. Ideal for fine dining.',
    'dark-glass': 'Modern dark theme with glassmorphism and blur effects. Great for upscale restaurants.',
    'retro-card': 'Vintage-inspired design with card-based layout. Perfect for cafes and diners.',
    'photo-hero': 'Hero image focused layout with stunning visuals. Best for showcasing food photography.',
    'grid-menu': 'Organized grid layout with clear categorization. Great for large menus.',
    'split-panels': 'Split-screen design with visual hierarchy. Perfect for modern restaurants.',
    'chalk-board': 'Chalkboard-style design with handwritten feel. Ideal for casual dining.',
    'magazine': 'Magazine-style layout with rich typography. Great for premium establishments.',
    'mono-zen': 'Monochrome minimalist design with zen aesthetics. Perfect for Japanese and Asian cuisine.',
    'elegant-modern': 'Sophisticated design with light typography and elegant spacing. Perfect for upscale dining.',
    'cosmic-dark': 'Stunning dark theme with cosmic gradients and modern effects. Great for contemporary venues.',
    'glass-morphism': 'Modern glassmorphism design with vibrant colors and blur effects. Perfect for trendy restaurants.',
    'luxury-gold': 'Luxurious design with gold accents and elegant typography. Ideal for premium fine dining.',
    'tropical-vibes': 'Vibrant tropical colors with warm gradients. Perfect for beach bars and tropical restaurants.',
    'ocean-breeze': 'Fresh ocean-inspired design with cool blue tones. Great for seafood restaurants and cafes.',
    'neon-gradient': 'Dynamic neon gradients with animated effects. Perfect for modern bars and nightlife.',
    'minimalist-white': 'Ultra-minimal black and white design with bold typography. Ideal for contemporary restaurants.',
    'forest-nature': 'Natural green tones inspired by nature. Perfect for organic and healthy food restaurants.',
    'sunset-warm': 'Warm sunset colors with vibrant gradients. Great for cozy cafes and warm atmosphere venues.'
  }
  return descriptions[key] || 'A beautiful menu template for your restaurant.'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 1.5rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .modal-container {
  background: #1a1a1a;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
}

.dark .modal-header {
  border-bottom-color: #404040;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
}

.dark .modal-title {
  color: #fff;
}

.modal-close-button {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: #f5f5f5;
  color: #666;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .modal-close-button {
  background: #404040;
  color: #ccc;
}

.modal-close-button:hover {
  background: #e5e5e5;
}

.dark .modal-close-button:hover {
  background: #525252;
}

.modal-body {
  padding: 1.5rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}
</style>

