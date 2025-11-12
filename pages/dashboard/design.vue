<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
          Dizajni i menysë dhe shabllonet
        </h1>
        <p class="text-ink-600 dark:text-ink-300 text-lg">
          Zgjidhni një shabllon që i përshtatet stilit të restorantit ose krijoni një dizajn të personalizuar
        </p>
      </div>

      <!-- Current Template -->
      <div v-if="currentMenu" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-ink-900 dark:text-white mb-2">Shablloni aktual</h2>
            <p class="text-ink-600 dark:text-ink-400">
              {{ currentTemplate?.name || 'Nuk është zgjedhur asnjë shabllon' }}
            </p>
          </div>
          <a
            v-if="currentMenu && currentTenant"
            :href="`/${currentMenu.slug}?tenant=${currentTenant.slug}`"
            target="_blank"
            class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <UIcon name="i-heroicons-eye" class="w-5 h-5" />
            Shiko menunë
          </a>
        </div>
      </div>

      <!-- Template Grid -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Zgjidh një shabllon</h2>
        
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
                :alt="`Parapamje e ${template.name}`"
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
                  Aktiv
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
                Parapamje dizajni
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-xl font-semibold transition-all border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 bg-brand-50/70 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!getTemplatePreviewUrl(template.key)"
                @click.stop="previewTemplateLive(template)"
              >
                Parapamje live
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
                {{ currentMenu?.template_key === template.key ? 'Shablloni aktual' : 'Apliko shabllonin' }}
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
            <h3 class="text-xl font-semibold text-ink-900 dark:text-white mb-2">Ndërtuesi i shablloneve të personalizuara</h3>
            <p class="text-ink-600 dark:text-ink-400 mb-4">
              Së shpejti! Krijoni shabllonin tuaj të personalizuar me kontroll të plotë mbi ngjyrat, fontet, paraqitjen dhe stilimin.
            </p>
            <button
              disabled
              class="px-4 py-2 bg-ink-200 dark:bg-ink-700 text-ink-500 dark:text-ink-400 rounded-xl font-semibold cursor-not-allowed"
            >
              Së shpejti
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
              <h3 class="modal-title">Parapamje: {{ previewTemplate.name }}</h3>
              <button class="modal-close-button" @click="previewTemplate = null">×</button>
            </div>
            <div class="modal-body">
              <div class="relative mb-4 aspect-video overflow-hidden rounded-2xl border border-ink-100/60 dark:border-ink-800/60">
                <img
                  v-if="previewTemplate.preview_image_url"
                  :src="previewTemplate.preview_image_url"
                  :alt="`Parapamje e ${previewTemplate.name}`"
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
                    {{ getTemplateHighlights(previewTemplate.key)[0] || 'Sistem dizajni' }}
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
                  <span v-if="currentMenu?.template_key === previewTemplate.key">Shablloni aktual</span>
                  <span v-else-if="!previewTemplate.id">Së shpejti</span>
                  <span v-else>Apliko këtë shabllon</span>
                </button>
                <button
                  type="button"
                  @click="previewTemplate = null"
                  class="px-6 py-3 bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-400 rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Anulo
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
    inspiration: 'Gradientë të frymëzuar nga aurora me theksime të ndritshme për përvoja kulinare premium.',
    tags: ['Gradientë aurora', 'Thellësi xhami', 'Ndjesi premium']
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
    inspiration: 'Rrjet modular bento i frymëzuar nga sistemet bashkëkohore të dizajnit të produkteve.',
    tags: ['Rrjet bento', 'Karta modulare', 'Prioritet mobil']
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
    inspiration: 'Shtresa pastel të buta me tipografi të rafinuar për pastiçeri dhe kafene boutique.',
    tags: ['Pastel të buta', 'Serif elegant', 'Miqësore për foto']
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
    inspiration: 'Modalitet i errët me kontrast të lartë dhe theksime flakërimesh për koncepte të udhëhequra nga shefat.',
    tags: ['Modalitet i errët', 'Theksime flake', 'Në qendër shefi']
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
    inspiration: 'Tekstura botanike të pasura dhe hapësira organike ideale për përvoja nga ferma në tryezë.',
    tags: ['Paletë organike', 'Motiv natyre', 'Ritëm i ngadaltë']
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
    inspiration: 'Qetësi skandinave me gradientë shisto, tipografi të qartë dhe hapësirë të bollshme.',
    tags: ['Skandinave', 'Gradientë shisto', 'Ndriçim ambient']
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
    inspiration: 'Estetikë neo-brutaliste me karta të shtresuara, ndarje të forta ngjyrash dhe thellësi taktile.',
    tags: ['Blloqe të guximshme', 'Kontrast i lartë', 'Hije të shtresuara']
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
    inspiration: 'Valë drite holografike, panele xhami dhe tipografi kinematike për përvoja zhytëse të ngrënies.',
    tags: ['Holografike', 'Shtresa xhami', 'Kinematike']
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
    inspiration: 'Paletë perëndimi luksoze me tekstura kadifeje për lounge koktejsh dhe menu degustimi.',
    tags: ['Kadife noir', 'Shkëlqim i pasur', 'Natë vonë']
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
    inspiration: 'Gradientë të thellë mesnate me theksime qiellore të krijuara për darka të sofistikuara.',
    tags: ['Gradient mesnate', 'Konstelacion', 'Përvojë zhytëse']
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
    inspiration: 'Gjeometri Art Deco me korniza të arta të përshtatura për hapësira të sofistikuara ngrënieje.',
    tags: ['Art Deco', 'Kornizë e artë', 'Foyer madhështor']
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
    inspiration: 'Gradientë të zhytur në diell dhe tekstura të ngrohta të përshtatshme për bistro fusion dhe terasa.',
    tags: ['Shkëlqim i ngrohtë', 'Paletë perëndimi', 'Ngrënie në natyrë']
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
    inspiration: 'Minimalizëm bregdetar i ajrosur me blu të teksturuara, perfekt për ushqim deti dhe beach club.',
    tags: ['Qetësi bregdetare', 'Shtresa me fllad', 'Gati për ushqim deti']
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
  'aurora-luxe': ['Gradient xhami', 'Tipografi premium', 'Kontrast errësirë-dritë'],
  'modern-bento': ['Paraqitje bento', 'Renditje kartash', 'Skaj në skaj'],
  'pastel-dream': ['Shtresim pastel', 'Imazhe hero', 'Gati për rrjete sociale'],
  'ember-noir': ['Në qendër shefi', 'Shkëlqim flake i ngrohtë', 'Modalitet nate'],
  'botanical-garden': ['Hapësirë organike', 'Motiv gjethe', 'Paletë qetësuese'],
  'neon-night': ['Shkëlqim neon', 'Atmosferë klubi', 'Aureolë e animuar'],
  'minimal-elegance': ['Rrjet minimal', 'Serif luksoz', 'Hije të buta'],
  'dark-glass': ['Glassmorphism', 'Mjegull thellësie', 'E errët premium'],
  'retro-card': ['Karta vintage', 'Paletë retro', 'Nostalgi'],
  'photo-hero': ['Fokus te fotoja', 'Gradientë skaji', 'Përvojë zhytëse'],
  'grid-menu': ['Rrjet i strukturuar', 'Dendësi e lartë', 'Skanim i shpejtë'],
  'split-panels': ['Hero i ndarë', 'Frymë editoriale', 'Asimetrike'],
  'chalk-board': ['Shkrim me dorë', 'Teksturë shkumësi', 'Casual'],
  'magazine': ['Editorial', 'Tituj të mëdhenj', 'Rrëfim i pasur'],
  'mono-zen': ['Monokrom', 'Balancë zen', 'Hapësirë e bardhë'],
  'elegant-modern': ['Gradientë të butë', 'Tipografi elegante', 'Shkëlqim i lehtë'],
  'cosmic-dark': ['Gradient kozmik', 'Dritë galaksie', 'Modalitet modern i errët'],
  'glass-morphism': ['Panele të ngrira', 'Theksime të gjalla', 'Thellësi e shtresuar'],
  'luxury-gold': ['Theksime ari', 'Serif madhështor', 'Kontrast i thellë'],
  'tropical-vibes': ['Përzierje tropikale', 'Gradient i ngrohtë', 'Lojë e gjallë'],
  'ocean-breeze': ['Bregdetare', 'Tonalitete të ftohta', 'Atmosferë relaksuese'],
  'neon-gradient': ['Neon i gjallë', 'Energji e lartë', 'Natë urbane'],
  'minimalist-white': ['Shumë i pastër', 'Tipografi e theksuar', 'Kontrast i lartë'],
  'forest-nature': ['Tonalitete toke', 'Organike', 'Qetësi'],
  'sunset-warm': ['Shkëlqim perëndimi', 'Gradient i ngrohtë', 'Atmosferë e ngrohtë'],
  'nordic-slate': ['Gradient shisto', 'Qetësi nordike', 'Karta fluide'],
  'neo-brutalist': ['Bllokime ngjyrash', 'Thellësi e shtresuar', 'Tipografi e fuqishme'],
  'holographic-wave': ['Dritë holografike', 'Siperfaqe xhami', 'Luks futurist'],
  'velvet-dusk': ['Hije kadifeje', 'Theksime karmin', 'Lounge nate'],
  'celestial-ink': ['Kanvas mesnate', 'Shtresa me yje', 'Atmosferë zhytëse'],
  'gilded-art-deco': ['Vija Art Deco', 'Korniza të arta', 'Serif mahnitës'],
  'savanna-sunset': ['Ngrohtësi qelibar', 'Orë e artë', 'Gati për fusion'],
  'coastal-zen': ['Fllad deti', 'Tonalitete cerulean', 'Paraqitje e lehtë']
}

const getTemplateHighlights = (key: string): string[] => templateHighlights[key] ?? ['Paraqitje responsive', 'Kontrast i aksesueshëm', 'UI moderne']

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
      title: 'Parapamja nuk është e disponueshme',
      description: 'Na nevojitet një menu e publikuar për ta shfaqur këtë parapamje.',
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
      title: 'Gabim',
      description: err.message || 'Dështoi ngarkimi i shablloneve',
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
        title: 'Nuk u gjetën menu',
        description: 'Krijoni dhe publikoni një menu përpara se të shihni shabllonet.',
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
    console.error('Gabim gjatë ngarkimit të menysë aktuale:', error)
  }
}

const openPreview = (template: TemplateCard) => {
  previewTemplate.value = normalizeTemplate(cloneTemplateCard(template))
}

const applyTemplate = async (template: TemplateCard) => {
  if (!currentMenu.value) {
    toast.add({
      title: 'Gabim',
      description: 'Nuk u gjet asnjë menu. Ju lutemi krijoni fillimisht një menu.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
    return
  }

  const loadingToast = toast.add({
    title: 'Po aplikohet shablloni...',
    description: `Duke aplikuar ${template.name} në menunë tuaj`,
    color: 'primary',
    icon: 'i-heroicons-arrow-path',
      timeout: 0
  })

  try {
    if (!template.id) {
      toast.add({
        title: 'Së shpejti',
        description: 'Ky shabllon po finalizohet. Ju lutemi kontaktoni mbështetjen për ta aktivizuar për qiramarrësin tuaj.',
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
      title: 'Sukses',
      description: `Shablloni "${template.name}" u aplikua në menunë tuaj`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Gabim',
      description: err.message || 'Dështoi aplikimi i shabllonit',
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
    'neon-night': 'Ngjyra neon të guximshme me efekte glassmorphism. Përkryer për bare dhe ambiente nate.',
    'minimal-elegance': 'Dizajn i pastër minimal me tipografi elegante. Ideal për darka të rafinuara.',
    'dark-glass': 'Temë moderne e errët me glassmorphism dhe efekte mjegulle. Shkëlqen për restorante luksoze.',
    'retro-card': 'Dizajn i frymëzuar nga vintage me paraqitje në karta. I përshtatshëm për kafene dhe bistro klasike.',
    'photo-hero': 'Paraqitje me fokus te imazhi kryesor dhe pamje mahnitëse. Ideale për të ekspozuar fotografi ushqimi.',
    'grid-menu': 'Rrjet i organizuar me kategorizim të qartë. I shkëlqyer për menu të mëdha.',
    'split-panels': 'Dizajn me ekran të ndarë dhe hierarki vizuale. Për restorante moderne.',
    'chalk-board': 'Stil dërrase shkumësi me ndjesi shkrimi me dorë. I përshtatshëm për ambiente të përditshme.',
    'magazine': 'Paraqitje në stil reviste me tipografi të pasur. I shkëlqyer për lokale premium.',
    'mono-zen': 'Dizajn monokrom minimal me estetikë zen. Për kuzhina japoneze dhe aziatike.',
    'elegant-modern': 'Dizajn i sofistikuar me tipografi të lehtë dhe hapësira elegante. Ideal për darka të nivelit të lartë.',
    'cosmic-dark': 'Temë e errët mahnitëse me gradientë kozmikë dhe efekte moderne. Për ambiente bashkëkohore.',
    'glass-morphism': 'Dizajn glassmorphism me ngjyra të gjalla dhe efekte mjegulle. Për restorante trendi.',
    'luxury-gold': 'Dizajn luksoz me theksime ari dhe tipografi elegante. Ideal për fine dining premium.',
    'tropical-vibes': 'Ngjyra tropikale të gjalla me gradientë të ngrohtë. Për beach bar dhe restorante tropikale.',
    'ocean-breeze': 'Dizajn i frymëzuar nga deti me tonalitete blu të ftohta. I përshtatshëm për restorante ushqimi deti.',
    'neon-gradient': 'Gradientë neon dinamikë me efekte të animuara. Për bare moderne dhe jetën e natës.',
    'minimalist-white': 'Dizajn bardh e zi ultra minimal me tipografi të theksuar. Ideal për restorante bashkëkohore.',
    'forest-nature': 'Tonalitete të gjelbra natyrore të frymëzuara nga pyjet. Për restorante organike dhe të shëndetshme.',
    'sunset-warm': 'Ngjyra të ngrohta perëndimi me gradientë të gjallë. Të përsosur për kafene të ngrohta dhe ambiente intime.',
    'aurora-luxe': 'Kanvas gradient i frymëzuar nga aurora me panele xhami dhe hierarki tipografike premium.',
    'modern-bento': 'Rrjet bashkëkohor bento me seksione modulare për menu degustimi dhe oferta speciale të shefit.',
    'pastel-dream': 'Gradientë pastel me korniza fotografike editoriale që krijojnë vitrinë mikpritëse për pastiçeri.',
    'ember-noir': 'Modalitet i errët noir me theksime flake që nxjerrin në pah pjatat firmë dhe miksologjinë.',
    'botanical-garden': 'Tekstura botanike dhe tipografi të rafinuara për koncepte nga ferma në tryezë dhe bazuar në bimë.',
    'nordic-slate': 'Gradientë shisto të frymëzuar nga Skandinavia me panele të ngrira dhe dritë ambienti të butë.',
    'neo-brutalist': 'Paraqitje neo-brutaliste me blloqe taktile dhe tipografi të guximshme.',
    'holographic-wave': 'Shkëlqim iridescent, shtresa xhami dhe tipografi kinematike për hapësira futuriste.',
    'velvet-dusk': 'Sfond kadifeje mesnate me theksime rozë, perfekt për lounge koktejsh atmosferikë.',
    'celestial-ink': 'Kanvas gradient i frymëzuar nga qielli për rrëfim zhytës të menuse degustuese.',
    'gilded-art-deco': 'Vija Art Deco dhe theksime të arta të kuruara për salla madhështore dhe lounge hotelesh.',
    'savanna-sunset': 'Paletë e ngrohtë nga dielli me tekstura natyrore për bistro fusion dhe ngrënie në tarracë.',
    'coastal-zen': 'Minimalizëm bregdetar me blu ajrore dhe të bardha taktile për koncepte ushqimi deti.'
  }
  return descriptions[key] || 'Një shabllon i bukur menuje për restorantin tuaj.'
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

