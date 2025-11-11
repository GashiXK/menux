<template>
  <div>
    <!-- Demo Menu with Sample Data -->
    <component
      v-if="templateComponent"
      :is="templateComponent"
      :tenant="demoTenant"
      :menu="demoMenu"
      :categories="demoCategories"
      :custom-texts="demoCustomTexts"
    />
    
    <!-- Loading State -->
    <div v-else class="min-h-screen flex items-center justify-center bg-default">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p class="text-muted">Loading demo menu...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '~/types/menu-template'
import type { Component } from 'vue'
import { resolveTemplateComponent } from '~/utils/template-registry'

definePageMeta({
  layout: false,
  middleware: [],
  ssr: false
})

// Demo Data - Best Template Showcase
const demoTenant = {
  id: 'demo-tenant',
  name: 'Bella Vista Restaurant',
  slug: 'demo',
  city_id: 1,
  logo_url: null,
  is_active: true,
  created_at: new Date().toISOString()
}

const demoMenu = {
  id: 'demo-menu',
  tenant_id: 'demo-tenant',
  name: 'Grand Tasting Menu',
  slug: 'main',
  template_key: 'luxury-gold',
  design_config: {},
  is_published: true,
  is_default: true,
  created_at: new Date().toISOString(),
  template: {
    key: 'luxury-gold',
    name: 'Luxury Gold',
    preview_image_url: null,
    base_config: {}
  }
}

const demoCategories = [
  {
    id: 'demo-cat-1',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Prelude Bites',
    description: 'Petite introductions plated with warm gilded accents to open the evening service.',
    sort_order: 1,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-1',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Gilded Truffle Arancini',
        description: 'Saffron risotto, Alba truffle mousse, 36-month parmigiano mist.',
        price: 22,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['Signature', 'Vegetarian'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-2',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Champagne Burrata',
        description: 'Hand-pulled burrata, sparkling grape gelée, basil oil, smoked fleur de sel.',
        price: 24,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: ['Vegetarian', 'Gluten-free'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-3',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Velvet Sea Scallops',
        description: 'Diver scallops, parsnip silk, pancetta glass, Oscietra caviar pearls.',
        price: 28,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: ['Seafood'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'demo-cat-2',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Signature Courses',
    description: 'Centerpiece plates choreographed for a gold-accented dining room.',
    sort_order: 2,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-4',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'A5 Wagyu Royale',
        description: 'Binchōtan-finished wagyu, pomme mousseline, black garlic lacquer.',
        price: 68,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['Signature', 'Premium'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-5',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Champagne Poached Salmon',
        description: 'Champagne beurre monté, leek ash, candied Meyer lemon.',
        price: 38,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: ['Gluten-free'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-6',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Porcini Risotto',
        description: 'Wild porcini emulsion, aged pecorino, Alba white truffle shaving.',
        price: 34,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: ['Vegetarian'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-7',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Lamb Duet à la Maison',
        description: 'Herb-crusted lamb rack, confit shoulder, preserved mint yoghurt.',
        price: 49,
        currency: '€',
        is_active: true,
        sort_order: 4,
        tags: ['Signature'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'demo-cat-3',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Grand Finale',
    description: 'Dessert compositions with luminous caramel threads and gold leaf.',
    sort_order: 3,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-8',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Grand Cru Soufflé',
        description: '70% cacao, Tahitian vanilla crème, smoked fleur de sel.',
        price: 16,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['Signature'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-9',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Golden Tiramisu',
        description: 'Espresso savoiardi, pistachio mascarpone, cocoa veil, gold dust.',
        price: 15,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: [],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-10',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Limoncello Prism',
        description: 'Meyer lemon curd, brûléed meringue, almond sable, sparkling sugar.',
        price: 14,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: ['Vegetarian'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'demo-cat-4',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Elevated Pairings',
    description: 'Sommelier pairings and signature cocktails with gilded glassware.',
    sort_order: 4,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-11',
        category_id: 'demo-cat-4',
        tenant_id: 'demo-tenant',
        name: 'Sommelier Flight',
        description: 'Three-cellar tasting flight curated nightly by our sommelier.',
        price: 36,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['Pairing'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-12',
        category_id: 'demo-cat-4',
        tenant_id: 'demo-tenant',
        name: 'Gilded Negroni',
        description: 'Saffron gin, bitter bianco, smoked vermouth sphere, orange blossom mist.',
        price: 19,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: ['Signature'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-13',
        category_id: 'demo-cat-4',
        tenant_id: 'demo-tenant',
        name: 'Gold Crest Espresso',
        description: 'Single-origin roast, cedar smoke, Madagascar vanilla crema.',
        price: 6,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: [],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      }
    ]
  }
]

const demoCustomTexts = {
  subtitle: 'An indulgent tasting journey wrapped in warm brass lighting and bespoke service.',
  cta: 'Reserve your table'
}

const templateComponent = ref<Component | null>(null)

onMounted(() => {
  const templateKey = demoMenu.template_key || 'luxury-gold'
  const component = resolveTemplateComponent(templateKey) ?? resolveTemplateComponent('luxury-gold')
  templateComponent.value = component
})
</script>

