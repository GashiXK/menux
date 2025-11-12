<template>
  <div>
    <!-- Demonstrim i menysë me të dhëna provë -->
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
        <p class="text-muted">Po ngarkohet demo e menysë...</p>
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

// Të dhëna demonstrimi - shfaqje e shabllonit më të mirë
const demoTenant = {
  id: 'demo-tenant',
  name: 'Restorant Bella Vista',
  slug: 'demo',
  city_id: 1,
  logo_url: null,
  is_active: true,
  created_at: new Date().toISOString()
}

const demoMenu = {
  id: 'demo-menu',
  tenant_id: 'demo-tenant',
  name: 'Menu degustimi e madhe',
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
    name: 'Pide',
    description: 'Pide tradicionale me përbërës të ndryshëm',
    sort_order: 1,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-2',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Pide Bolognese',
        description: 'Sos domatesh, kaçkavall, mish i bluar',
        price: 6,
        currency: 'EUR',
        is_active: true,
        sort_order: 2,
        tags: ['pide', 'mish i bluar'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-3',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Pide Përshuti',
        description: 'Sos, kaçkavall, proshutë',
        price: 5,
        currency: 'EUR',
        is_active: true,
        sort_order: 3,
        tags: ['pide', 'proshutë'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-4',
        category_id: 'demo-cat-1',
        tenant_id: 'demo-tenant',
        name: 'Pide me Suxhuk',
        description: 'Sos, kaçkavall, suxhuk',
        price: 5,
        currency: 'EUR',
        is_active: true,
        sort_order: 4,
        tags: ['pide', 'suxhuk'],
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
    name: 'Pasta',
    description: 'Makarona me receta të ndryshme italiane',
    sort_order: 2,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-5',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Pasta Bolognese',
        description: 'Makarona, sos domatesh, mish i bluar, djathë i bardhë',
        price: 4,
        currency: 'EUR',
        is_active: true,
        sort_order: 1,
        tags: ['pasta', 'mish i bluar'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-6',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Pasta Carburana',
        description: 'Makarona, sos i bardhë, proshutë',
        price: 4,
        currency: 'EUR',
        is_active: true,
        sort_order: 2,
        tags: ['pasta', 'proshutë', 'carbonara'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-7',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Shpageti Bolognese',
        description: 'Shpageti, sos domatesh, mish i bluar, djathë i bardhë',
        price: 4,
        currency: 'EUR',
        is_active: true,
        sort_order: 3,
        tags: ['shpageti', 'mish i bluar'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-8',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Shpageti Carburana',
        description: 'Makarona, sos i bardhë, proshutë',
        price: 4,
        currency: 'EUR',
        is_active: true,
        sort_order: 4,
        tags: ['shpageti', 'carbonara', 'proshutë'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-10',
        category_id: 'demo-cat-2',
        tenant_id: 'demo-tenant',
        name: 'Pasta Bolognese në Tavë',
        description: 'Makarona, sos domatesh, mish i bluar, djathë i bardhë, sos i bardhë, kaçkavall',
        price: 6,
        currency: 'EUR',
        is_active: true,
        sort_order: 6,
        tags: ['pasta', 'tavë', 'mish i bluar'],
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
    name: 'Sandwich',
    description: 'Sanduiçë të ngrohtë dhe të ftohtë me përbërës të ndryshëm',
    sort_order: 3,
    visible: true,
    is_special: false,
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'demo-item-12',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Sandwich Tuna',
        description: 'Ton, kaçkavall, sos, patate',
        price: 3,
        currency: 'EUR',
        is_active: true,
        sort_order: 2,
        tags: ['sandwich', 'peshk', 'ton'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-13',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Sandwich Vici',
        description: 'Mish vici, kaçkavall, sos, patate',
        price: 4,
        currency: 'EUR',
        is_active: true,
        sort_order: 3,
        tags: ['sandwich', 'vici'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-item-14',
        category_id: 'demo-cat-3',
        tenant_id: 'demo-tenant',
        name: 'Sandwich Pule',
        description: 'Kaçkavall, mish pule, sos, patate',
        price: 3.5,
        currency: 'EUR',
        is_active: true,
        sort_order: 4,
        tags: ['sandwich', 'pule'],
        image_url: null,
        attributes: {},
        created_at: new Date().toISOString()
      }
    ]
  }
]

const demoCustomTexts = {
  subtitle: 'Një udhëtim degustimi i këndshëm i mbështjellë me drita të ngrohta bronzi dhe shërbim të personalizuar.',
  cta: 'Rezervoni tryezën tuaj'
}

const templateComponent = ref<Component | null>(null)

onMounted(() => {
  const templateKey = demoMenu.template_key || 'luxury-gold'
  const component = resolveTemplateComponent(templateKey) ?? resolveTemplateComponent('luxury-gold')
  templateComponent.value = component
})
</script>

