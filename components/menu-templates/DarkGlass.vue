<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <!-- Header -->
    <header class="backdrop-blur-2xl bg-neutral-900/50 border-b border-cyan-500/30 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <h1 class="text-4xl font-bold text-cyan-400">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-2 text-cyan-200/70">{{ customTexts.subtitle }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-6xl mx-auto px-6 py-12">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <div class="backdrop-blur-2xl bg-neutral-800/40 border border-cyan-500/20 rounded-3xl p-8">
          <h2 class="text-2xl font-bold mb-6 text-cyan-300">{{ category.name }}</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <article
              v-for="item in category.items"
              :key="item.id"
              class="group overflow-hidden rounded-2xl border border-cyan-400/15 bg-neutral-900/60 p-0 transition hover:border-cyan-400/40 hover:shadow-[0_25px_70px_-40px_rgba(6,182,212,0.45)]"
            >
              <MenuItemMedia
                :src="item.image_url"
                :alt="`${item.name} photo`"
                wrapper-class="h-48 bg-neutral-950"
                overlay-class="bg-gradient-to-b from-transparent via-neutral-950/20 to-neutral-950/70"
                image-class="group-hover:scale-105"
              />
              <div class="space-y-3 px-6 py-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white">{{ item.name }}</h3>
                    <p v-if="item.description" class="mt-2 text-sm text-neutral-300/80">
                      {{ item.description }}
                    </p>
                  </div>
                  <div class="shrink-0 rounded-xl border border-cyan-400/30 bg-neutral-950/80 px-3 py-2 text-right text-sm font-semibold text-cyan-300 shadow-inner shadow-cyan-900/40">
                    {{ formatPrice(item.price, item.currency) }}
                  </div>
                </div>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200/80"
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

