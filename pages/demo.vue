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
  name: 'Main Menu',
  slug: 'main',
  template_key: 'minimal-elegance', // Best template for demo
  design_config: {},
  is_published: true,
  is_default: true,
  created_at: new Date().toISOString(),
  template: {
    key: 'minimal-elegance',
    name: 'Minimal Elegance',
    preview_image_url: null,
    base_config: {}
  }
}

const demoCategories = [
  {
    id: 'demo-cat-1',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Appetizers',
    description: 'Start your culinary journey with our carefully crafted starters',
    sort_order: 1,
    visible: true,
    is_special: false,
    items: [
      {
        id: 'demo-item-1',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls filled with truffle and parmesan, served with aioli',
        price: 14.50,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['vegetarian', 'signature'],
        image_url: null
      },
      {
        id: 'demo-item-2',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Burrata Caprese',
        description: 'Fresh burrata with heirloom tomatoes, basil, and aged balsamic',
        price: 16.00,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: ['vegetarian', 'gluten-free'],
        image_url: null
      },
      {
        id: 'demo-item-3',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Seared Scallops',
        description: 'Pan-seared scallops with cauliflower puree and pancetta',
        price: 18.00,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: ['signature'],
        image_url: null
      }
    ]
  },
  {
    id: 'demo-cat-2',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Main Courses',
    description: 'Our chef\'s signature dishes prepared with the finest ingredients',
    sort_order: 2,
    visible: true,
    is_special: false,
    items: [
      {
        id: 'demo-item-4',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Wagyu Beef Tenderloin',
        description: '8oz premium wagyu with roasted vegetables and red wine reduction',
        price: 48.00,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['signature', 'premium'],
        image_url: null
      },
      {
        id: 'demo-item-5',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with lemon butter sauce, asparagus, and quinoa',
        price: 26.00,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: ['gluten-free'],
        image_url: null
      },
      {
        id: 'demo-item-6',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Wild Mushroom Risotto',
        description: 'Creamy arborio rice with assorted wild mushrooms and truffle oil',
        price: 22.00,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: ['vegetarian', 'signature'],
        image_url: null
      },
      {
        id: 'demo-item-7',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Herb-Crusted Lamb Rack',
        description: 'New Zealand lamb with mint jus, roasted potatoes, and seasonal vegetables',
        price: 38.00,
        currency: '€',
        is_active: true,
        sort_order: 4,
        tags: ['signature'],
        image_url: null
      }
    ]
  },
  {
    id: 'demo-cat-3',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Desserts',
    description: 'Sweet endings to your perfect meal',
    sort_order: 3,
    visible: true,
    is_special: false,
    items: [
      {
        id: 'demo-item-8',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Chocolate Soufflé',
        description: 'Warm chocolate soufflé with vanilla bean ice cream',
        price: 12.00,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: ['signature'],
        image_url: null
      },
      {
        id: 'demo-item-9',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers',
        price: 10.00,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: [],
        image_url: null
      },
      {
        id: 'demo-item-10',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Lemon Tart',
        description: 'Zesty lemon curd in a buttery shortcrust pastry',
        price: 9.00,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: ['vegetarian'],
        image_url: null
      }
    ]
  },
  {
    id: 'demo-cat-4',
    menu_id: 'demo-menu',
    tenant_id: 'demo-tenant',
    name: 'Beverages',
    description: 'Carefully selected wines and craft cocktails',
    sort_order: 4,
    visible: true,
    is_special: false,
    items: [
      {
        id: 'demo-item-11',
        category_id: 'demo-cat-4',
        tenant_id: 'demo-tenant',
        name: 'House Wine Selection',
        description: 'Red, white, or rosé - ask your server for recommendations',
        price: 8.00,
        currency: '€',
        is_active: true,
        sort_order: 1,
        tags: [],
        image_url: null
      },
      {
        id: 'demo-item-12',
        category_id: 'demo-cat-4',
        tenant_id: 'demo-tenant',
        name: 'Signature Cocktail',
        description: 'Our bartender\'s special creation - changes seasonally',
        price: 14.00,
        currency: '€',
        is_active: true,
        sort_order: 2,
        tags: ['signature'],
        image_url: null
      },
      {
        id: 'demo-item-13',
        category_id: 'demo-cat-4',
        tenant_id: 'demo-tenant',
        name: 'Espresso',
        description: 'Premium Italian espresso',
        price: 3.50,
        currency: '€',
        is_active: true,
        sort_order: 3,
        tags: [],
        image_url: null
      }
    ]
  }
]

const demoCustomTexts = {
  subtitle: 'Experience fine dining reimagined'
}

// Template component mapping
const templateMap: Record<string, () => Component> = {
  'neon-night': () => resolveComponent('NeonNight') as Component,
  'minimal-elegance': () => resolveComponent('MinimalElegance') as Component,
  'dark-glass': () => resolveComponent('DarkGlass') as Component,
  'retro-card': () => resolveComponent('RetroCard') as Component,
  'photo-hero': () => resolveComponent('PhotoHero') as Component,
  'grid-menu': () => resolveComponent('GridMenu') as Component,
  'split-panels': () => resolveComponent('SplitPanels') as Component,
  'chalk-board': () => resolveComponent('ChalkBoard') as Component,
  'magazine': () => resolveComponent('Magazine') as Component,
  'mono-zen': () => resolveComponent('MonoZen') as Component,
  'elegant-modern': () => resolveComponent('ElegantModern') as Component,
  'cosmic-dark': () => resolveComponent('CosmicDark') as Component,
  'glass-morphism': () => resolveComponent('GlassMorphism') as Component,
  'luxury-gold': () => resolveComponent('LuxuryGold') as Component,
  'tropical-vibes': () => resolveComponent('TropicalVibes') as Component,
  'ocean-breeze': () => resolveComponent('OceanBreeze') as Component,
  'neon-gradient': () => resolveComponent('NeonGradient') as Component,
  'minimalist-white': () => resolveComponent('MinimalistWhite') as Component,
  'forest-nature': () => resolveComponent('ForestNature') as Component,
  'sunset-warm': () => resolveComponent('SunsetWarm') as Component
}

const templateComponent = ref<Component | null>(null)

onMounted(() => {
  const templateKey = demoMenu.template_key || 'minimal-elegance'
  const templateFactory = templateMap[templateKey]
  
  if (templateFactory) {
    templateComponent.value = templateFactory()
  } else {
    templateComponent.value = templateMap['minimal-elegance']()
  }
})
</script>

