<template>
  <div>
    <!-- Ad Banner -->
    <AdBanner
      v-if="tenant && menu"
      :tenant-id="tenant.id"
      :city-id="tenant.city_id || undefined"
      scope="menu"
    />
   
    <!-- Dynamic Template -->
    <component
      v-if="!loading && !error && templateComponent && tenant && menu"
      :is="templateComponent"
      :tenant="tenant"
      :menu="menu"
      :categories="categories"
      :custom-texts="customTexts"
    />
   
    <!-- Loading State -->
    <AppLoader
      v-else-if="loading"
      variant="restaurant"
      :size="loaderSize"
      :fullscreen="true"
      text="Loading menu..."
      class="text-neutral-700 dark:text-neutral-200"
    />
   
    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-default px-4">
      <UCard class="max-w-md w-full">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-error" />
            <h2 class="text-xl font-bold text-highlighted">Error Loading Menu</h2>
          </div>
        </template>
       
        <div class="space-y-4">
          <p class="text-muted">{{ error }}</p>
          <div class="bg-elevated p-4 rounded-lg">
            <p class="text-sm text-muted mb-2">To access a menu, use one of these methods:</p>
            <ul class="text-sm text-muted space-y-1 list-disc list-inside">
              <li>Add <code class="bg-default px-2 py-1 rounded text-xs">?tenant=slug</code> to the URL</li>
              <li>Use a custom domain or subdomain</li>
            </ul>
          </div>
         
          <UButton
            label="Try Again"
            @click="loadMenu"
            class="w-full"
          />
      </div>
      </UCard>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import type { MenuWithDetails, CategoryWithItems, Tenant } from '~/types/database'
import type { Component } from 'vue'
import { resolveTemplateComponent } from '~/utils/template-registry'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
 
// Public page - no auth required
definePageMeta({
  layout: false,
  middleware: [],
  ssr: false // Client-only to avoid hydration issues with dynamic content
})
 
const route = useRoute()
const menuSlug = route.params.menuSlug as string
 
const tenant = ref<Tenant | null>(null)
const menu = ref<MenuWithDetails | null>(null)
const categories = ref<CategoryWithItems[]>([])
const customTexts = ref<Record<string, string>>({})
const templateComponent = ref<Component | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const breakpoints = useBreakpoints(breakpointsTailwind)
const loaderSize = computed<'lg' | 'xl'>(() => (breakpoints.greater('lg').value ? 'xl' : 'lg'))
const previewTemplateKey = computed(() => {
  const raw = route.query.templatePreview
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw
  }
  return null
})
 
// Use public Supabase client for menu viewing (no auth required)
const client = useSupabaseClient()
 
interface TenantWithCity extends Tenant {
  city?: {
    id: number
    name: string
    slug: string
  }
}
 
const loadTenantByDomain = async (domain: string): Promise<TenantWithCity> => {
  const { data: domainData, error: domainError } = await client
    .from('tenant_domains')
    .select('*, tenant:tenants!inner(*, city:cities(*))')
    .or(`domain.eq.${domain},subdomain.eq.${domain}`)
    .maybeSingle()
   
  if (domainError) {
    console.error('Error loading tenant by domain:', domainError)
    throw domainError
  }
 
  const domainRecord = domainData as { tenant?: TenantWithCity } | null

  if (!domainRecord || !domainRecord.tenant) {
    throw new Error(`Tenant not found for domain: ${domain}`)
  }
 
  return domainRecord.tenant
}
 
interface RawCategory {
  id: string
  visible: boolean
  [key: string]: unknown
}

interface RawMenuItem {
  id: string
  category_id: string
  is_active: boolean
  [key: string]: unknown
}

const loadPublishedMenu = async (tenantId: string, slug = 'main') => {
  // Load menu with template
  const { data: menuData, error: menuError } = await client
    .from('menus')
    .select('*, template:menu_templates(*)')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .maybeSingle()
   
  if (menuError) {
    console.error('Error loading menu:', menuError)
    throw menuError
  }
 
  const menuRecord = menuData as MenuWithDetails | null

  if (!menuRecord) {
    throw new Error(`Menu not found: ${slug} for tenant ${tenantId}`)
  }
 
  // Load categories
  const { data: categoriesData, error: catError } = await client
    .from('categories')
    .select('*')
    .eq('menu_id', menuRecord.id)
    .order('sort_order', { ascending: true })
   
  if (catError) {
    console.error('Error loading categories:', catError)
    throw catError
  }
 
  // Load menu items for all categories
  const categoryRows = (categoriesData || []) as RawCategory[]
  const categoryIds = categoryRows.map(category => category.id)
  let itemRows: RawMenuItem[] = []
 
  if (categoryIds.length > 0) {
    const { data: itemsData, error: itemsError } = await client
      .from('menu_items')
      .select('*')
      .in('category_id', categoryIds)
      .order('sort_order', { ascending: true })
   
    if (itemsError) {
      console.warn('Error loading menu items:', itemsError)
    } else {
      itemRows = (itemsData || []) as RawMenuItem[]
    }
  }
 
  const activeItems = itemRows.filter(item => item.is_active)

  // Attach items to categories
  const visibleCategories = categoryRows.filter(category => category.visible)
  const categoriesWithItems = visibleCategories.map(category => ({
    ...category,
    items: activeItems.filter(item => item.category_id === category.id)
  }))
 
  // Load custom texts
  const { data: customTextsData, error: textsError } = await client
    .from('custom_texts')
    .select('*')
    .eq('tenant_id', tenantId)
 
  if (textsError) {
    console.warn('Error loading custom texts:', textsError)
  }
 
  const textRows = (customTextsData || []) as Array<{ key: string; value: string }>
  const textsMap = textRows.reduce((acc, text) => {
    acc[text.key] = text.value
    return acc
  }, {} as Record<string, string>)
 
  return {
    menu: menuRecord,
    categories: categoriesWithItems as CategoryWithItems[],
    customTexts: textsMap
  }
}
 
const loadMenu = async () => {
  // Only run on client side
if (process.server) {
    loading.value = false
    return
  }
 
  loading.value = true
  error.value = null
 
  try {
    // Try to get tenant from various sources
    if (!tenant.value) {
      // 1. Check server-side context (if available)
  const event = useRequestEvent()
      if (event?.context?.tenant) {
        tenant.value = event.context.tenant as Tenant
      }
     
      // 2. Check query parameter
      if (!tenant.value) {
        const tenantSlug = route.query.tenant as string
        if (tenantSlug) {
          const { data: tenantData, error: tenantError } = await client
            .from('tenants')
            .select('*, city:cities(*)')
            .eq('slug', tenantSlug)
            .maybeSingle()

          if (tenantError) {
            console.error('Error loading tenant from query param:', tenantError)
          } else if (tenantData) {
            tenant.value = tenantData as Tenant
          }
        }
      }
   
      // 3. Try domain-based detection
      if (!tenant.value && typeof window !== 'undefined') {
      const host = window.location.host
      const subdomain = host.split('.')[0]
        if (subdomain && subdomain !== 'localhost' && subdomain !== '127.0.0.1') {
      try {
        tenant.value = await loadTenantByDomain(subdomain)
      } catch (e) {
        console.error('Failed to load tenant from domain', e)
          }
        }
      }
     
      // 4. Fallback: load first available tenant (for development/testing)
      if (!tenant.value) {
        console.warn('No tenant found, trying to load first available tenant')
        const { data: tenantsData, error: tenantsError } = await client
          .from('tenants')
          .select('*, city:cities(*)')
          .limit(1)
          .maybeSingle()

        if (!tenantsError && tenantsData) {
          tenant.value = tenantsData as Tenant
        } else {
          error.value = 'No tenant found. Please provide a tenant slug in the query parameter (?tenant=slug)'
          loading.value = false
          return
        }
    }
  }
 
    if (!tenant.value) {
      error.value = 'Unable to load tenant information'
      loading.value = false
      return
    }
   
    // Load menu data
    const data = await loadPublishedMenu(tenant.value.id, menuSlug || 'main')
    menu.value = data.menu
    categories.value = data.categories
    customTexts.value = data.customTexts
   
    // Set template component
    assignTemplateComponent()
  } catch (e: unknown) {
    console.error('Failed to load menu', e)
    const err = e as Error
    error.value = err.message || 'Failed to load menu. Please try again.'
  } finally {
    loading.value = false
  }
}
 
// Only load menu on client side to avoid hydration issues
if (process.client) {
onMounted(() => {
  loadMenu()
})
} else {
  // On server, set loading to false
  loading.value = false
}
 
watch(
  () => [menu.value?.template_key, previewTemplateKey.value],
  () => {
    assignTemplateComponent()
  }
)
 
const assignTemplateComponent = () => {
  const fallbackKey = menu.value?.template_key || 'minimal-elegance'
  const keyToUse = previewTemplateKey.value ?? fallbackKey
  const component = resolveTemplateComponent(keyToUse) ?? resolveTemplateComponent('minimal-elegance')
  if (component) {
    templateComponent.value = component
  } else {
    console.warn(`Template component not found for key: ${keyToUse}`)
    templateComponent.value = null
  }
}
</script>
 