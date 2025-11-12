<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
          Gjenerator i kodeve QR
        </h1>
        <p class="text-ink-600 dark:text-ink-300 text-lg">
          Gjeneroni një kod QR për menunë tuaj. Klientët mund ta skanojnë për të parë menunë digjitale menjëherë.
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Generate QR Code Card -->
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-8 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="space-y-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-qr-code" class="w-6 h-6 text-brand-500" />
              </div>
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Gjenero kod QR</h2>
            </div>
            
            <p class="text-ink-600 dark:text-ink-400">
              Krijoni një kod QR që lidh direkt me menunë tuaj digjitale. Printojeni dhe vendoseni në tavolina që klientët ta skanojnë.
            </p>
            
            <!-- Menu Selection -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-ink-700 dark:text-ink-300">
                Zgjidh menunë
              </label>
              <div v-if="loadingMenus" class="bg-ink-50 dark:bg-ink-800 rounded-xl p-4 border border-ink-200 dark:border-ink-700">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-brand-500" />
                  <span class="text-sm text-ink-600 dark:text-ink-400">Po ngarkohen menutë...</span>
                </div>
              </div>
              <select
                v-else
                v-model="selectedMenuId"
                class="w-full px-4 py-3 bg-white dark:bg-ink-800 border-2 border-ink-200 dark:border-ink-700 rounded-xl text-ink-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              >
                <option value="" disabled>Zgjidh një menu...</option>
                <option
                  v-for="menu in menus"
                  :key="menu.id"
                  :value="menu.id"
                  class="bg-white dark:bg-ink-800"
                >
                  {{ menu.name }} {{ menu.is_default ? '(Standard)' : '' }} {{ menu.is_published ? '✓ e publikuar' : '✗ skicë' }}
                </option>
              </select>
              <p v-if="menus.length === 0" class="text-sm text-ink-500 dark:text-ink-400">
                Nuk ka menu të disponueshme. Ju lutemi krijoni fillimisht një menu.
              </p>
            </div>
            
            <button
              @click="generateQR"
              :disabled="generating || !selectedMenuId || menus.length === 0"
              class="w-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UIcon v-if="generating" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              <UIcon v-else name="i-heroicons-qr-code" class="w-5 h-5" />
              {{ generating ? 'Po gjenerohet...' : 'Gjenero kod QR' }}
            </button>
          </div>
        </div>
        
        <!-- QR Code Display Card -->
        <div v-if="qrCodeUrl || qrCode" class="bg-white dark:bg-ink-900 rounded-2xl p-8 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Kodi juaj QR</h2>
            <button
              @click="loadExistingQR"
              :disabled="loadingQR"
              class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              aria-label="Rifresko kodin QR"
            >
              <UIcon
                :name="loadingQR ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-path'"
                :class="['w-5 h-5 text-ink-500 dark:text-ink-400', loadingQR && 'animate-spin']"
              />
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="flex justify-center">
              <!-- Server-generated QR code from database -->
              <img
                v-if="qrCode?.image_url"
                :src="qrCode.image_url"
                alt="Kod QR"
                class="w-full max-w-sm rounded-xl shadow-2xl border-4 border-ink-100 dark:border-ink-800"
                @error="(e) => {
                  console.error('Gabim në ngarkimin e imazhit:', e)
                  toast.add({
                    title: 'Gabim',
                    description: 'Dështoi ngarkimi i imazhit të kodit QR',
                    color: 'red',
                    icon: 'i-heroicons-exclamation-circle',
                    timeout: 5000
                  })
                }"
              />
              <div v-else class="w-full max-w-sm rounded-xl bg-ink-100 dark:bg-ink-800 p-8 flex items-center justify-center">
                <p class="text-ink-500 dark:text-ink-400">Nuk ka kod QR të disponueshëm</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-ink-700 dark:text-ink-300">URL e menysë:</p>
              <div class="bg-ink-50 dark:bg-ink-800 p-4 rounded-xl border border-ink-200 dark:border-ink-700">
                <code class="text-sm break-all text-ink-900 dark:text-white font-mono">
                  {{ qrCodeUrl || qrCode?.url || 'Nuk ka URL të disponueshme' }}
                </code>
              </div>
            </div>
            
            <div class="flex gap-3">
              <button
                @click="downloadQR"
                class="flex-1 bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
                Shkarko
              </button>
              <button
                @click="copyURL"
                class="flex-1 bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-900 dark:text-white transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <UIcon name="i-heroicons-clipboard" class="w-5 h-5" />
                Kopjo URL-në
              </button>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-else-if="loadingQR" class="md:col-span-2 bg-white dark:bg-ink-900 rounded-2xl p-12 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 animate-spin text-brand-500 mx-auto mb-4" />
            <p class="text-ink-600 dark:text-ink-400 text-lg mb-2">Po ngarkohet kodi QR...</p>
          </div>
        </div>
        
        <!-- Empty State - Show when no menu selected -->
        <div v-else-if="!selectedMenuId" class="md:col-span-2 bg-white dark:bg-ink-900 rounded-2xl p-12 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/30">
              <UIcon name="i-heroicons-qr-code" class="w-12 h-12 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
              Zgjidh një menu për të gjeneruar kodin QR
            </h3>
            <p class="text-ink-600 dark:text-ink-400 text-lg">
              Zgjidh një menu nga lista më sipër për të parë kodin QR
            </p>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-else-if="loadingQR" class="md:col-span-2 bg-white dark:bg-ink-900 rounded-2xl p-12 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 animate-spin text-brand-500 mx-auto mb-4" />
            <p class="text-ink-600 dark:text-ink-400 text-lg mb-2">Po ngarkohet kodi QR...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import type { QRCode } from '~/types/database'

definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const { currentTenantId, tenant } = useTenant()
const { listMenusByTenant } = useMenu()
const { client } = useSupabaseClientStrict()
const authClient = useSupabaseClient() // Use regular client for auth operations
const user = useSupabaseUser()
const toast = useToast()

const qrCode = ref<QRCode | null>(null)
const generating = ref(false)
const loadingQR = ref(false)
const menus = ref<Array<{ id: string; name: string; slug: string; is_default: boolean; is_published: boolean }>>([])
const selectedMenuId = ref<string>('')
const loadingMenus = ref(false)

// Generate QR code URL on client side for instant display
const qrCodeUrl = computed(() => {
  if (!selectedMenuId.value || !currentTenantId.value || !tenant.value) return null
  
  const selectedMenu = menus.value.find(m => m.id === selectedMenuId.value)
  if (!selectedMenu) return null
  
  // Generate URL format: http://localhost:3000/main?tenant=skyline
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const menuSlug = selectedMenu.slug || 'main'
  const tenantSlug = tenant.value.slug
  
  return `${origin}/${menuSlug}?tenant=${tenantSlug}`
})

const loadExistingQR = async () => {
  if (!currentTenantId.value || !selectedMenuId.value) return
  
  loadingQR.value = true
  try {
    const { data, error } = await client
      .from('qr_codes')
      .select('*')
      .eq('tenant_id', currentTenantId.value)
      .eq('menu_id', selectedMenuId.value)
      .maybeSingle()
    
    if (error) {
      console.error('Gabim gjatë ngarkimit të kodit QR:', error)
      return
    }
    
    if (data) {
      qrCode.value = data as QRCode
    } else {
      qrCode.value = null
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Gabim gjatë ngarkimit të kodit QR:', err)
  } finally {
    loadingQR.value = false
  }
}

// Watch for menu selection changes and reload QR code
watch(selectedMenuId, async (newMenuId) => {
  if (newMenuId) {
    await loadExistingQR()
  } else {
    qrCode.value = null
  }
})

const loadMenus = async () => {
  if (!currentTenantId.value) return
  
  loadingMenus.value = true
  try {
    const menusList = await listMenusByTenant(currentTenantId.value)
    menus.value = menusList
    
    // Set default selected menu if none selected
    if (!selectedMenuId.value && menusList.length > 0) {
      const defaultMenu = menusList.find(m => m.is_default) || menusList[0]
      selectedMenuId.value = defaultMenu.id
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Gabim',
      description: err.message || 'Dështoi ngarkimi i menyve',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loadingMenus.value = false
  }
}

const generateQR = async () => {
  if (!currentTenantId.value) {
    toast.add({
      title: 'Gabim',
      description: 'Nuk ka informacion për qiramarrësin',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
    return
  }
  
  if (!selectedMenuId.value) {
    toast.add({
      title: 'Gabim',
      description: 'Ju lutemi zgjidhni fillimisht një menu',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
    return
  }
  
  generating.value = true
  
  try {
    const selectedMenu = menus.value.find(m => m.id === selectedMenuId.value)
    
    if (!selectedMenu) {
      throw new Error('Menuja e zgjedhur nuk u gjet. Ju lutemi zgjidhni një menu të vlefshme.')
    }
    
    // Check if user is authenticated
    if (!user.value) {
      throw new Error('Përdoruesi nuk është autentikuar. Ju lutemi identifikohuni përsëri.')
    }
    
    // Get session token for API call
    let accessToken: string | null = null
    try {
      const { data: sessionData } = await authClient.auth.getSession()
      if (sessionData?.session?.access_token) {
        accessToken = sessionData.session.access_token
      }
    } catch (e) {
      console.log('⚠️ Nuk u mor sesioni, por po vazhdojmë sidoqoftë (cookies duhet të funksionojnë)')
    }
    
    // Make the API call to save QR code to database
    const result = await $fetch('/api/qr/generate', {
      method: 'POST',
      body: {
        tenant_id: currentTenantId.value,
        menu_id: selectedMenuId.value
      },
      ...(accessToken ? {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      } : {}),
      credentials: 'include'
    })
    
    if (!result || !result.id) {
      throw new Error('Përgjigje e pavlefshme për kodin QR nga serveri')
    }
    
    // Set the QR code (URL will be used by qrcode.vue component)
    qrCode.value = result as QRCode
    
    // Load existing QR to ensure we have the latest data
    await loadExistingQR()
    
    toast.add({
      title: 'Sukses',
      description: 'Kodi QR u gjenerua me sukses!',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    console.error('❌ Gabim gjatë gjenerimit të kodit QR:', error)
    const err = error as { message?: string; statusMessage?: string; data?: { message?: string } }
    const errorMessage = err.data?.message || err.statusMessage || err.message || 'Dështoi gjenerimi i kodit QR'
    
    toast.add({
      title: 'Gabim',
      description: errorMessage,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    generating.value = false
  }
}

const downloadQR = async () => {
  if (!qrCodeUrl.value) return
  
  try {
    // Use qrcode.vue to generate and download
    // Create a canvas element to capture the SVG
    const qrElement = document.querySelector('.qrcode-vue3') as HTMLElement
    if (!qrElement) {
      throw new Error('Elementi i kodit QR nuk u gjet')
    }
    
    // Get the SVG element
    const svgElement = qrElement.querySelector('svg')
    if (!svgElement) {
      throw new Error('Elementi SVG nuk u gjet')
    }
    
    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    // Create download link
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-code-${tenant.value?.slug || 'menu'}-${selectedMenuId.value.substring(0, 8)}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.add({
      title: 'Sukses',
      description: 'Kodi QR u shkarkua me sukses',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    // Fallback: try to download from database image_url if available
    if (qrCode.value?.image_url) {
      try {
        const a = document.createElement('a')
        a.href = qrCode.value.image_url
        a.download = `qr-code-${tenant.value?.slug || 'menu'}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        toast.add({
          title: 'Sukses',
          description: 'Kodi QR u shkarkua me sukses',
          color: 'green',
          icon: 'i-heroicons-check-circle',
          timeout: 3000
        })
        return
      } catch (fallbackError) {
        console.error('Gabim gjatë shkarkimit rezervë:', fallbackError)
      }
    }
    
    const err = error as { message?: string }
    toast.add({
      title: 'Gabim',
      description: err.message || 'Dështoi shkarkimi i kodit QR',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const copyURL = async () => {
  const urlToCopy = qrCodeUrl.value || qrCode.value?.url
  if (!urlToCopy) return
  
  try {
    await navigator.clipboard.writeText(urlToCopy)
    toast.add({
      title: 'U kopjua!',
      description: 'URL e menysë u kopjua në kujtesë',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Gabim',
      description: err.message || 'Dështoi kopjimi i URL-së',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

onMounted(async () => {
  await loadMenus()
  if (selectedMenuId.value) {
    await loadExistingQR()
  }
})
</script>
