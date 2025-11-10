<template>
  <div class="min-h-screen bg-white text-neutral-900">
    <!-- Header -->
    <header class="border-b border-neutral-200">
      <div class="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 class="text-5xl font-light tracking-tight">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-4 text-neutral-600 text-lg">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-4xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-20">
        <h2 class="text-3xl font-light mb-8 pb-3 border-b border-neutral-300">{{ category.name }}</h2>
        <p v-if="category.description" class="text-neutral-600 mb-8">{{ category.description }}</p>
        
        <div class="space-y-10">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="flex flex-col gap-5 md:flex-row md:items-start md:gap-8"
          >
            <figure
              v-if="item.image_url"
              class="overflow-hidden rounded-2xl bg-neutral-100 shadow-sm md:w-64"
            >
              <img
                :src="item.image_url"
                :alt="`${item.name} photo`"
                class="h-48 w-full object-cover md:h-full"
                loading="lazy"
              />
            </figure>
            <div class="flex flex-1 flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div class="flex-1">
                <h3 class="text-xl font-medium text-neutral-900">{{ item.name }}</h3>
                <p v-if="item.description" class="mt-2 text-sm leading-relaxed text-neutral-600">
                  {{ item.description }}
                </p>
                <div v-if="item.tags && item.tags.length" class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="text-right whitespace-nowrap font-medium text-neutral-900">
                {{ formatPrice(item.price, item.currency) }}
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '@/types'
defineProps<MenuTemplateProps>()

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

