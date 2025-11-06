<template>
  <div v-if="ad" class="relative bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg overflow-hidden shadow-lg">
    <div class="relative z-10 p-6 text-white">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-2">{{ ad.title }}</h3>
          <p v-if="ad.body" class="text-brand-100">{{ ad.body }}</p>
          
          <NuxtLink
            v-if="ad.link_url"
            :to="ad.link_url"
            class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-brand-600 rounded-lg font-medium hover:bg-brand-50 transition"
          >
            Learn More
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        
        <img
          v-if="ad.media_url"
          :src="ad.media_url"
          alt="Ad media"
          class="w-32 h-32 object-cover rounded-lg"
        />
      </div>
    </div>
    
    <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
  </div>
</template>

<script setup lang="ts">
import type { AdWithTargets, AdScope } from '~/types/database'

interface Props {
  tenantId?: string
  cityId?: number
  scope?: AdScope
  pagePath?: string
}

const props = defineProps<Props>()

const ad = ref<AdWithTargets | null>(null)

const loadAd = async () => {
  const { data } = await useFetch('/api/ads/active', {
    query: {
      tenant_id: props.tenantId,
      city_id: props.cityId,
      scope: props.scope || 'all_pages',
      page_path: props.pagePath
    }
  })
  
  ad.value = data.value
}

onMounted(() => {
  loadAd()
})

watch(() => [props.tenantId, props.cityId, props.scope, props.pagePath], () => {
  loadAd()
})
</script>

