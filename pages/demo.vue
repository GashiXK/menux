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
  name: 'Chef’s Signature Menu',
  slug: 'main',
  template_key: 'aurora-luxe',
  design_config: {},
  is_published: true,
  is_default: true,
  created_at: new Date().toISOString(),
  template: {
    key: 'aurora-luxe',
    name: 'Aurora Luxe',
    preview_image_url: null,
    base_config: {}
  }
}

const demoCategories = [
  {
    id: 'demo-cat-1',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Prelude Plates',
    description: 'Begin with luminous flavors crafted for the golden hour in our lounge.',
    sort_order: 1,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-1',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Golden Truffle Arancini',
        description: 'Crisp saffron risotto, black truffle cream, 30-month parmigiano.',
        price: 18,
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
        name: 'Burrata Stellata',
        description: 'Heirloom tomatoes, yuzu pearls, basil oil, smoked sea salt.',
        price: 19,
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
        name: 'Emerald Sea Scallops',
        description: 'Pan-seared scallops, pea velouté, crispy pancetta lattice.',
        price: 21,
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
    description: 'Iconic dishes that define the Aurora Luxe tasting journey.',
    sort_order: 2,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-4',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'A5 Wagyu Aurora',
        description: 'Charred wagyu, smoked pomme purée, black garlic jus.',
        price: 54,
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
        name: 'Glacier Salmon',
        description: 'Miso-glazed Atlantic salmon, charred asparagus, preserved lemon.',
        price: 32,
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
        name: 'Forest Floor Risotto',
        description: 'Wild mushrooms, aged pecorino, white truffle espuma.',
        price: 27,
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
        name: 'Heritage Lamb Duet',
        description: 'Herb-crusted lamb rack, confit shoulder, mint-labneh glaze.',
        price: 42,
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
    name: 'Dessert Gallery',
    description: 'Brilliant finales inspired by aurora-lit nights.',
    sort_order: 3,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-8',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Midnight Soufflé',
        description: '70% cacao, vanilla bean chantilly, smoked salt.',
        price: 14,
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
        name: 'Aurora Tiramisu',
        description: 'Espresso-soaked savoiardi, pistachio mascarpone, cocoa veil.',
        price: 13,
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
        description: 'Meyer lemon curd, brûléed meringue, almond sable.',
        price: 12,
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
    description: 'Cocktails and pours choreographed for the tasting sequence.',
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
        description: 'Three curated pours, rotating weekly terroirs.',
        price: 24,
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
        name: 'Celestial Negroni',
        description: 'Saffron gin, bitter bianco, smoked vermouth sphere.',
        price: 16,
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
        name: 'Nordic Espresso',
        description: 'Single-origin roast, cedar smoke, vanilla crema.',
        price: 5,
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
  subtitle: 'Aurora-lit tasting journeys with sustainably sourced ingredients.',
  cta: 'Reservations recommended'
}

const templateComponent = ref<Component | null>(null)

onMounted(() => {
  const templateKey = demoMenu.template_key || 'aurora-luxe'
  const component = resolveTemplateComponent(templateKey) ?? resolveTemplateComponent('aurora-luxe')
  templateComponent.value = component
})
</script>

