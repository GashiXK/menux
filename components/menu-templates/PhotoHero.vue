<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero -->
    <header
      class="relative h-[28rem] bg-cover bg-center"
      :style="heroStyle"
    >
      <div class="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center">
        <div class="text-center text-white space-y-4 px-6">
          <span class="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
            {{ customTexts.badge || 'Signature experience' }}
          </span>
          <h1 class="text-5xl font-bold drop-shadow-2xl sm:text-6xl">{{ tenant.name }}</h1>
          <p v-if="customTexts.subtitle" class="mx-auto max-w-2xl text-lg drop-shadow-lg">
            {{ customTexts.subtitle }}
          </p>
        </div>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-16 space-y-16">
      <section v-for="category in categories" :key="category.id" class="space-y-8">
        <div class="flex flex-col gap-3 text-neutral-800">
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500">Chef's table</p>
          <h2 class="text-4xl font-bold">{{ category.name }}</h2>
          <p v-if="category.description" class="text-neutral-600">{{ category.description }}</p>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <figure v-if="item.image_url" class="relative h-48 overflow-hidden">
              <img
                :src="item.image_url"
                :alt="`${item.name} photo`"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </figure>
            <div class="space-y-4 px-6 py-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-2xl font-semibold text-neutral-900 group-hover:text-neutral-700 transition">
                    {{ item.name }}
                  </h3>
                  <p v-if="item.description" class="mt-2 text-sm leading-relaxed text-neutral-600">
                    {{ item.description }}
                  </p>
                </div>
                <div class="rounded-xl bg-neutral-900 px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-neutral-900/20">
                  {{ formatPrice(item.price, item.currency) }}
                </div>
              </div>
              <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MenuTemplateProps } from '@/types'

const props = defineProps<MenuTemplateProps>()

const heroImage = computed(() => props.menu.template?.preview_image_url || props.customTexts.hero_image || props.customTexts.heroImage || null)

const heroStyle = computed(() => {
  if (heroImage.value) {
    return `background-image: linear-gradient(rgba(17,24,39,0.35), rgba(17,24,39,0.6)), url('${heroImage.value}')`
  }
  return "background-image: linear-gradient(rgba(17,24,39,0.35), rgba(17,24,39,0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600')"
})

const formatPrice = (value: number | string, currency: string) => {
  const amount = Number(value)
  if (Number.isFinite(amount)) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(amount)
  }
  return typeof value === 'string' && value.trim().length > 0 ? value : '—'
}
</script>

