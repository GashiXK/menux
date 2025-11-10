<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-6 py-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="mt-2 text-purple-200">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-12">
      <div v-for="category in categories" :key="category.id" class="mb-16">
        <div class="backdrop-blur-xl bg-white/5 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 class="text-3xl font-bold mb-2 text-purple-300">{{ category.name }}</h2>
          <p v-if="category.description" class="text-purple-200 mb-6">{{ category.description }}</p>
          
          <div class="grid gap-6">
            <article
              v-for="item in category.items"
              :key="item.id"
              class="group overflow-hidden rounded-2xl border border-purple-400/20 bg-white/10 p-0 transition hover:border-pink-400/40 hover:shadow-[0_20px_60px_-30px_rgba(244,114,182,0.5)]"
            >
              <figure
                v-if="item.image_url"
                class="relative h-48 w-full overflow-hidden"
              >
                <img
                  :src="item.image_url"
                  :alt="`${item.name} photo`"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-purple-950/60" />
              </figure>
              <div class="space-y-3 px-6 py-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
                    <p v-if="item.description" class="mt-2 text-sm text-purple-100">
                      {{ item.description }}
                    </p>
                  </div>
                  <div class="shrink-0 rounded-xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 px-4 py-2 text-right text-lg font-semibold text-pink-200 ring-1 ring-purple-400/30">
                    {{ formatPrice(item.price, item.currency) }}
                  </div>
                </div>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-purple-100"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </article>
          </div>
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

