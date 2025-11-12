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
            :class="[
              'group bg-white dark:bg-ink-900 rounded-3xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
              currentMenu?.template_key === template.key
                ? 'border-brand-500 ring-2 ring-brand-500/20'
                : 'border-ink-100 dark:border-ink-800 hover:border-brand-300 dark:hover:border-brand-700'
            ]"
          >
            <!-- Template Preview -->
            <div class="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl border border-ink-100/70 dark:border-ink-800/60">
              <img
                v-if="template.preview_image_url"
                :src="template.preview_image_url"
                :alt="`${template.name} preview`"
                class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                v-else
                class="absolute inset-0 bg-gradient-to-br opacity-90"
                :class="getTemplateGradient(template.key)"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div class="relative z-10 flex h-full flex-col justify-end gap-2 p-5 text-white">
                <span class="inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                  {{ getTemplateHighlights(template.key)[0] || 'Modern' }}
                </span>
                <div>
                  <h3 class="text-lg font-semibold leading-tight sm:text-xl">{{ template.name }}</h3>
                  <p class="mt-1 text-xs text-white/80 sm:text-sm">
                    {{ getTemplateDescription(template.key) }}
                  </p>
                </div>
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
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="highlight in getTemplateHighlights(template.key)"
                  :key="highlight"
                  class="inline-flex items-center rounded-full bg-ink-100 dark:bg-ink-800 px-3 py-1 text-xs font-medium text-ink-600 dark:text-ink-300"
                >
                  {{ highlight }}
                </span>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                class="px-4 py-2 rounded-xl font-semibold transition-all border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 hover:border-brand-400 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                @click.stop="openPreview(template)"
              >
                Preview Design
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-xl font-semibold transition-all border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 bg-brand-50/70 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!getTemplatePreviewUrl(template.key)"
                @click.stop="previewTemplateLive(template)"
              >
                Live Preview
              </button>
              <button
                type="button"
                @click.stop="applyTemplate(template)"
                :class="[
                  'px-4 py-2 rounded-xl font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  currentMenu?.template_key === template.key
                    ? 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 cursor-not-allowed'
                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                ]"
                :disabled="currentMenu?.template_key === template.key"
              >
                {{ currentMenu?.template_key === template.key ? 'Current Template' : 'Apply Template' }}
              </button>
            </div>
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
              <div class="relative mb-4 aspect-video overflow-hidden rounded-2xl border border-ink-100/60 dark:border-ink-800/60">
                <img
                  v-if="previewTemplate.preview_image_url"
                  :src="previewTemplate.preview_image_url"
                  :alt="`${previewTemplate.name} preview`"
                  class="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  v-else
                  class="absolute inset-0 bg-gradient-to-br"
                  :class="getTemplateGradient(previewTemplate.key)"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div class="relative z-10 flex h-full flex-col justify-end gap-3 p-6 text-white">
                  <span class="inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                    {{ getTemplateHighlights(previewTemplate.key)[0] || 'Design system' }}
                  </span>
                  <div>
                    <h3 class="text-2xl font-semibold leading-tight">{{ previewTemplate.name }}</h3>
                    <p class="mt-1 text-sm text-white/80">{{ getTemplateDescription(previewTemplate.key) }}</p>
                  </div>
                </div>
              </div>
              <p v-if="previewTemplate.inspiration" class="text-ink-600 dark:text-ink-400 mb-4">
                {{ previewTemplate.inspiration }}
              </p>
              <div
                v-if="previewTemplate.tags && previewTemplate.tags.length"
                class="flex flex-wrap gap-2 mb-6"
              >
                <span
                  v-for="tag in previewTemplate.tags"
                  :key="`${previewTemplate.key}-${tag}`"
                  class="inline-flex items-center rounded-full bg-ink-100 dark:bg-ink-800 px-3 py-1 text-xs font-medium text-ink-600 dark:text-ink-300"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="flex gap-4">
                <button
                  type="button"
                  :disabled="!previewTemplate.id || currentMenu?.template_key === previewTemplate.key"
                  @click="previewTemplate && applyTemplate(previewTemplate)"
                  :class="[
                    'flex-1 px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    !previewTemplate.id || currentMenu?.template_key === previewTemplate.key
                      ? 'bg-ink-200 dark:bg-ink-800 text-ink-500 dark:text-ink-400 cursor-not-allowed'
                      : 'bg-brand-500 hover:bg-brand-600 text-white'
                  ]"
                >
                  <span v-if="currentMenu?.template_key === previewTemplate.key">Current Template</span>
                  <span v-else-if="!previewTemplate.id">Coming Soon</span>
                  <span v-else>Apply This Template</span>
                </button>
                <button
                  type="button"
                  @click="previewTemplate = null"
                  class="px-6 py-3 bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-400 rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
import { watch } from 'vue'
import type { MenuTemplate, MenuWithDetails } from '~/types/database'

definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const { currentTenantId, tenant: currentTenant, loadTenantForUser } = useTenant()
const defaultMenuSlugState = useState<string>('tenant-default-menu-slug', () => 'main')
const { listMenusByTenant, updateMenu } = useMenu()
const { client } = useSupabaseClientStrict()
const toast = useToast()

interface TemplateCard {
  id?: number
  key: string
  name: string
  preview_image_url: string | null
  base_config: Record<string, unknown>
  inspiration?: string
  tags?: string[]
}

const curatedTemplates: TemplateCard[] = [
  {
    key: 'aurora-luxe',
    name: 'Aurora Luxe',
    preview_image_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#0f172a',
        surface: '#111827',
        accent: '#38bdf8'
      },
      typography: {
        heading: 'Playfair Display',
        body: 'Inter'
      }
    },
    inspiration: 'Polar-inspired gradients with luminous highlights for premium dining experiences.',
    tags: ['Aurora gradients', 'Glass depth', 'Premium feel']
  },
  {
    key: 'modern-bento',
    name: 'Modern Bento',
    preview_image_url: 'https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      layout: 'bento',
      palette: {
        background: '#f8fafc',
        surface: '#e2e8f0',
        accent: '#0ea5e9'
      },
      typography: {
        heading: 'Space Grotesk',
        body: 'Inter'
      }
    },
    inspiration: 'Modular bento grid layout inspired by contemporary product design systems.',
    tags: ['Bento grid', 'Modular cards', 'Mobile-first']
  },
  {
    key: 'pastel-dream',
    name: 'Pastel Dream',
    preview_image_url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#fdf2f8',
        surface: '#e0f2fe',
        accent: '#f472b6'
      },
      typography: {
        heading: 'DM Serif Display',
        body: 'Nunito Sans'
      }
    },
    inspiration: 'Soft pastel layering with elevated typography for patisseries and boutique cafés.',
    tags: ['Soft pastels', 'Elegant serif', 'Photo friendly']
  },
  {
    key: 'ember-noir',
    name: 'Ember Noir',
    preview_image_url: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#0b0b0f',
        surface: '#111827',
        accent: '#f97316'
      },
      typography: {
        heading: 'Clash Display',
        body: 'Inter Tight'
      }
    },
    inspiration: 'High-contrast dark mode with ember highlights designed for chef-driven concepts.',
    tags: ['Dark mode', 'Ember accents', 'Chef spotlight']
  },
  {
    key: 'botanical-garden',
    name: 'Botanical Garden',
    preview_image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#f1f5f0',
        surface: '#d1fae5',
        accent: '#047857'
      },
      typography: {
        heading: 'Fraunces',
        body: 'Source Sans Pro'
      }
    },
    inspiration: 'Lush botanical textures and organic spacing ideal for farm-to-table experiences.',
    tags: ['Organic palette', 'Nature motifs', 'Slow dining']
  },
  {
    key: 'nordic-slate',
    name: 'Nordic Slate',
    preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#0f172a',
        surface: '#1e293b',
        accent: '#38bdf8'
      },
      typography: {
        heading: 'Manrope',
        body: 'Inter'
      }
    },
    inspiration: 'Scandinavian calm with slate gradients, crisp typography, and generous breathing space.',
    tags: ['Scandinavian', 'Slate gradients', 'Ambient lighting']
  },
  {
    key: 'neo-brutalist',
    name: 'Neo Brutalist',
    preview_image_url: 'https://images.unsplash.com/photo-1529180979161-05b6dd0ebb62?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#fdfbf7',
        surface: '#fef08a',
        accent: '#ef4444'
      },
      typography: {
        heading: 'Clash Grotesk',
        body: 'General Sans'
      }
    },
    inspiration: 'Bold neo-brutal aesthetics with layered cards, strong color blocking, and tactile elevation.',
    tags: ['Bold blocks', 'High contrast', 'Layered shadows']
  },
  {
    key: 'holographic-wave',
    name: 'Holographic Wave',
    preview_image_url: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#0b1120',
        surface: '#111827',
        accent: '#a855f7'
      },
      typography: {
        heading: 'Recoleta',
        body: 'Satoshi'
      }
    },
    inspiration: 'Holographic light waves, glass panels, and cinematic typography for immersive dining experiences.',
    tags: ['Holographic', 'Glass layers', 'Cinematic']
  },
  {
    key: 'velvet-dusk',
    name: 'Velvet Dusk',
    preview_image_url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#1c0f24',
        surface: '#2a1535',
        accent: '#f973c5'
      },
      typography: {
        heading: 'Cormorant Garamond',
        body: 'Satoshi'
      }
    },
    inspiration: 'Opulent twilight palette with velvet textures for cocktail lounges and tasting menus.',
    tags: ['Velvet noir', 'Opulent glow', 'Late night']
  },
  {
    key: 'celestial-ink',
    name: 'Celestial Ink',
    preview_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#020617',
        surface: '#0f172a',
        accent: '#38bdf8'
      },
      typography: {
        heading: 'Syne',
        body: 'Inter'
      }
    },
    inspiration: 'Deep midnight gradients with celestial accents crafted for immersive fine dining.',
    tags: ['Midnight gradient', 'Constellation', 'Immersive']
  },
  {
    key: 'gilded-art-deco',
    name: 'Gilded Art Deco',
    preview_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#0f0f0f',
        surface: '#1c1c1c',
        accent: '#d4af37'
      },
      typography: {
        heading: 'Didot',
        body: 'Work Sans'
      }
    },
    inspiration: 'Art Deco geometry with gilded framing tailored for upscale dining rooms.',
    tags: ['Art deco', 'Gold framing', 'Grand foyer']
  },
  {
    key: 'savanna-sunset',
    name: 'Savanna Sunset',
    preview_image_url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#fff4e6',
        surface: '#ffe0b2',
        accent: '#ff6b35'
      },
      typography: {
        heading: 'Manrope',
        body: 'Inter'
      }
    },
    inspiration: 'Sun-drenched gradients and warm textures suited for fusion bistros and rooftops.',
    tags: ['Warm glow', 'Sunset palette', 'Outdoor dining']
  },
  {
    key: 'coastal-zen',
    name: 'Coastal Zen',
    preview_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    base_config: {
      palette: {
        background: '#edf2ff',
        surface: '#e0f2ff',
        accent: '#0284c7'
      },
      typography: {
        heading: 'Calistoga',
        body: 'Source Sans Pro'
      }
    },
    inspiration: 'Airy coastal minimalism with textured blues perfect for seafood and beach clubs.',
    tags: ['Coastal calm', 'Breezy layers', 'Seafood ready']
  }
]

const curatedLookup = curatedTemplates.reduce<Record<string, TemplateCard>>((acc, template) => {
  acc[template.key] = template
  return acc
}, {})

const cloneTemplateCard = (template: TemplateCard): TemplateCard => ({
  ...template,
  base_config: { ...(template.base_config ?? {}) },
  tags: template.tags ? [...template.tags] : []
})

const normalizeTemplate = (template: TemplateCard): TemplateCard => {
  const curated = curatedLookup[template.key]
  const baseConfigSource = template.base_config && Object.keys(template.base_config).length > 0
    ? template.base_config
    : curated?.base_config && Object.keys(curated.base_config).length > 0
      ? curated.base_config
      : {}

  return {
    ...template,
    base_config: baseConfigSource,
    inspiration: curated?.inspiration ?? template.inspiration,
    preview_image_url: template.preview_image_url ?? curated?.preview_image_url ?? null,
    tags: curated?.tags ?? template.tags ?? []
  }
}

const templateHighlights: Record<string, string[]> = {
  'aurora-luxe': ['Gradient glass', 'Premium typography', 'Dark-to-light contrast'],
  'modern-bento': ['Bento layout', 'Card sorting', 'Edge-to-edge'],
  'pastel-dream': ['Pastel layering', 'Hero imagery', 'Social ready'],
  'ember-noir': ['Chef spotlight', 'Warm ember glow', 'Night mode'],
  'botanical-garden': ['Organic spacing', 'Leaf motifs', 'Calming palette'],
  'neon-night': ['Neon glow', 'Club vibe', 'Animated aura'],
  'minimal-elegance': ['Minimal grid', 'Luxury serif', 'Soft shadows'],
  'dark-glass': ['Glassmorphism', 'Depth blur', 'Premium dark'],
  'retro-card': ['Vintage cards', 'Retro palette', 'Nostalgia'],
  'photo-hero': ['Photo forward', 'Edge gradients', 'Immersive'],
  'grid-menu': ['Structured grid', 'High density', 'Quick scan'],
  'split-panels': ['Split hero', 'Editorial vibe', 'Asymmetric'],
  'chalk-board': ['Handwritten', 'Chalk texture', 'Casual'],
  'magazine': ['Editorial', 'Large headlines', 'Storytelling'],
  'mono-zen': ['Monochrome', 'Zen balance', 'Whitespace'],
  'elegant-modern': ['Soft gradients', 'Elegant type', 'Light chrome'],
  'cosmic-dark': ['Cosmic gradient', 'Galaxy light', 'Modern dark'],
  'glass-morphism': ['Frosted panels', 'Vibrant accents', 'Layered depth'],
  'luxury-gold': ['Gold accents', 'Grand serif', 'Deep contrast'],
  'tropical-vibes': ['Tropical blend', 'Warm gradient', 'Playful'],
  'ocean-breeze': ['Coastal', 'Cool tones', 'Relaxed'],
  'neon-gradient': ['Vivid neon', 'High energy', 'Nightlife'],
  'minimalist-white': ['Ultra clean', 'Bold type', 'High contrast'],
  'forest-nature': ['Earthy greens', 'Organic', 'Calm'],
  'sunset-warm': ['Sunset glow', 'Warm gradient', 'Cozy'],
  'nordic-slate': ['Slate gradient', 'Nordic calm', 'Liquid cards'],
  'neo-brutalist': ['Color blocking', 'Layered depth', 'Punchy type'],
  'holographic-wave': ['Holographic light', 'Glass surfaces', 'Future luxe'],
  'velvet-dusk': ['Velvet shadows', 'Crimson highlights', 'Night lounge'],
  'celestial-ink': ['Midnight canvas', 'Starlit layering', 'Immersive ambience'],
  'gilded-art-deco': ['Art deco lines', 'Gilded frames', 'Statement serif'],
  'savanna-sunset': ['Amber warmth', 'Golden hour', 'Fusion ready'],
  'coastal-zen': ['Sea breeze', 'Cerulean tones', 'Lightweight layout']
}

const getTemplateHighlights = (key: string): string[] => templateHighlights[key] ?? ['Responsive layout', 'Accessible contrast', 'Modern UI']

const templates = ref<TemplateCard[]>([])
const currentMenu = ref<MenuWithDetails | null>(null)
const currentTemplate = ref<TemplateCard | null>(null)
const loading = ref(true)
const previewTemplate = ref<TemplateCard | null>(null)
const getTemplatePreviewUrl = (key: string) => {
  if (!currentTenant.value) {
    return null
  }
  const slug = currentMenu.value?.slug || 'main'
  return `/${slug}?tenant=${currentTenant.value.slug}&templatePreview=${key}`
}

const previewTemplateLive = (template: TemplateCard) => {
  const url = getTemplatePreviewUrl(template.key)
  if (!url) {
    toast.add({
      title: 'Preview unavailable',
      description: 'We need a published menu to render this preview.',
      color: 'yellow',
      icon: 'i-heroicons-information-circle',
      timeout: 4000
    })
    return
  }
  if (process.client) {
    window.open(url, '_blank', 'noopener')
  }
}

onMounted(async () => {
  await ensureTenant()
  await loadTemplates()
  await loadCurrentMenu()
  loading.value = false
})

watch(currentTenantId, async id => {
  if (!id) return
  await loadCurrentMenu()
})

const ensureTenant = async () => {
  if (currentTenant.value) return
  await loadTenantForUser()
}

const loadTemplates = async () => {
  try {
    const { data, error } = await client
      .from('menu_templates')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error

    const supabaseTemplates = (data || []).map<TemplateCard>((template: MenuTemplate) => ({
      id: template.id,
      key: template.key,
      name: template.name,
      preview_image_url: template.preview_image_url,
      base_config: template.base_config ?? {}
    }))

    const combined = new Map<string, TemplateCard>()
    supabaseTemplates.forEach(template => {
      combined.set(template.key, normalizeTemplate(cloneTemplateCard(template)))
    })

    curatedTemplates.forEach(template => {
      if (!combined.has(template.key)) {
        combined.set(template.key, normalizeTemplate(cloneTemplateCard(template)))
      }
    })

    templates.value = Array.from(combined.values()).sort((a, b) => a.name.localeCompare(b.name))
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
    if (!menus || menus.length === 0) {
      currentMenu.value = null
      defaultMenuSlugState.value = 'main'
      toast.add({
        title: 'No menus found',
        description: 'Create and publish a menu before previewing templates.',
        color: 'yellow',
        icon: 'i-heroicons-information-circle',
        timeout: 4000
      })
      return
    }
    currentMenu.value = menus.find(m => m.is_default) || menus[0]
    defaultMenuSlugState.value = currentMenu.value?.slug || 'main'
    
    if (currentMenu.value?.template_key) {
      const { data } = await client
        .from('menu_templates')
        .select('*')
        .eq('key', currentMenu.value.template_key)
        .single()
      
      if (data) {
        currentTemplate.value = normalizeTemplate({
          id: data.id,
          key: data.key,
          name: data.name,
          preview_image_url: data.preview_image_url,
          base_config: data.base_config ?? {}
        })
      }
    }
  } catch (error: unknown) {
    console.error('Error loading current menu:', error)
  }
}

const openPreview = (template: TemplateCard) => {
  previewTemplate.value = normalizeTemplate(cloneTemplateCard(template))
}

const applyTemplate = async (template: TemplateCard) => {
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
    if (!template.id) {
      toast.add({
        title: 'Coming soon',
        description: 'This template is being finalized. Please contact support to enable it for your tenant.',
        color: 'yellow',
        icon: 'i-heroicons-light-bulb',
        timeout: 5000
      })
      return
    }

    await updateMenu(currentMenu.value.id, {
      template_key: template.key
    })

    currentMenu.value.template_key = template.key
    currentTemplate.value = normalizeTemplate(cloneTemplateCard(template))
    previewTemplate.value = null

    toast.add({
      title: 'Success',
      description: `Template "${template.name}" has been applied to your menu`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to apply template',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    const toastId =
      typeof loadingToast === 'object' && loadingToast !== null && 'id' in loadingToast
        ? loadingToast.id
        : loadingToast
    if (toastId) {
      toast.remove(toastId)
    }
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
    'sunset-warm': 'from-orange-100 via-red-100 to-pink-100',
    'aurora-luxe': 'from-slate-950 via-indigo-900 to-emerald-900',
    'modern-bento': 'from-slate-100 via-white to-slate-100',
    'pastel-dream': 'from-rose-100 via-sky-100 to-emerald-100',
    'ember-noir': 'from-black via-slate-900 to-orange-900',
    'botanical-garden': 'from-emerald-100 via-green-200 to-lime-100',
    'nordic-slate': 'from-slate-950 via-slate-900 to-slate-800',
    'neo-brutalist': 'from-amber-100 via-yellow-100 to-rose-100',
    'holographic-wave': 'from-slate-950 via-purple-900 to-sky-900',
    'velvet-dusk': 'from-[#43163d] via-[#2a1030] to-[#110714]',
    'celestial-ink': 'from-slate-950 via-indigo-950 to-slate-900',
    'gilded-art-deco': 'from-[#1f1a12] via-[#2c2314] to-[#0f0b06]',
    'savanna-sunset': 'from-amber-100 via-orange-100 to-rose-100',
    'coastal-zen': 'from-sky-100 via-cyan-100 to-emerald-50'
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
    'sunset-warm': 'Warm sunset colors with vibrant gradients. Great for cozy cafes and warm atmosphere venues.',
    'aurora-luxe': 'Aurora borealis inspired gradient canvas layered with glass panels and premium type hierarchy.',
    'modern-bento': 'Contemporary bento grid layout with modular sections perfect for tasting menus and chef specials.',
    'pastel-dream': 'Pastel gradients with editorial photography frames create an inviting patisserie showcase.',
    'ember-noir': 'Noir-inspired dark mode with ember highlights that amplify signature dishes and mixology.',
    'botanical-garden': 'Botanical textures and refined typography tailored for farm-to-table and plant-forward concepts.',
    'nordic-slate': 'Scandinavian-inspired slate gradients with frosted panels and soft ambient glow.',
    'neo-brutalist': 'Statement-making neo-brutalist layout with tactile blocks and bold typography.',
    'holographic-wave': 'Iridescent glow, glass layers, and cinematic typography for futuristic spaces.',
    'velvet-dusk': 'Midnight velvet backdrop with blush highlights perfect for moody cocktail lounges.',
    'celestial-ink': 'Celestial-inspired gradient canvas designed for immersive tasting menu storytelling.',
    'gilded-art-deco': 'Art Deco lines and gilded accents curated for grand dining rooms and hotel lounges.',
    'savanna-sunset': 'Sun-warmed palette with natural textures ideal for fusion bistros and terrace dining.',
    'coastal-zen': 'Breezy coastal minimalism featuring airy blues and tactile whites for seafood concepts.'
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

