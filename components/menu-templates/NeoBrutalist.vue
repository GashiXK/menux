<template>
  <div class="min-h-screen bg-[#fdfbf7] text-[#1b1b1b]">
    <div class="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:px-10">
      <header class="grid gap-8 md:grid-cols-[auto,1fr] md:items-end">
        <div class="flex flex-col gap-4">
          <span class="inline-flex items-center gap-3 rounded-full border-4 border-[#1b1b1b] bg-[#fef08a] px-6 py-2 text-xs font-extrabold uppercase tracking-[0.4em]">
            {{ customTexts.badge || 'Chef Spotlight' }}
          </span>
          <h1 class="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
            {{ customTexts.headline || tenant.name }}
          </h1>
        </div>
        <div class="grid gap-4 text-right">
          <p class="text-sm font-semibold uppercase tracking-wide text-[#5b5b5b]">
            {{ customTexts.hours || 'All-day kitchen · 11:00 – 23:00' }}
          </p>
          <div class="flex items-center justify-end gap-4 text-base font-semibold">
            <span class="rounded-xl bg-[#ef4444] px-4 py-2 text-white shadow-[8px_8px_0_0_#1b1b1b]">
              {{ customTexts.location || 'Urban Market District' }}
            </span>
            <span class="rounded-xl bg-[#fde047] px-4 py-2 shadow-[8px_8px_0_0_#1b1b1b]">
              {{ customTexts.contact || '+355 42 221 221' }}
            </span>
          </div>
        </div>
      </header>

      <section
        v-for="category in categories"
        :key="category.id"
        class="relative grid gap-8 rounded-[2.5rem] border-4 border-[#1b1b1b] bg-white px-8 py-10 shadow-[18px_18px_0_0_#1b1b1b]"
      >
        <div class="flex flex-wrap items-start justify-between gap-6">
          <div class="space-y-4">
            <h2 class="text-4xl font-black uppercase tracking-tight">
              {{ category.name }}
            </h2>
            <p v-if="category.description" class="max-w-xl text-base font-medium text-[#3f3f3f]">
              {{ category.description }}
            </p>
          </div>
          <div class="flex items-center gap-3 rounded-xl border-4 border-[#1b1b1b] bg-[#fef08a] px-4 py-2 text-sm font-black uppercase tracking-wider">
            <UIcon name="i-heroicons-bolt" class="h-5 w-5 text-[#ef4444]" />
            Fresh drop
          </div>
        </div>
        <div class="grid gap-6 md:grid-cols-2">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="grid gap-4 rounded-3xl border-4 border-[#1b1b1b] bg-[#fde68a] px-6 py-6 shadow-[10px_10px_0_0_#1b1b1b] transition-transform duration-200 hover:-translate-y-2"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-2xl font-black uppercase leading-tight">
                  {{ item.name }}
                </h3>
                <p v-if="item.description" class="mt-3 text-sm font-medium text-[#3f3f3f]">
                  {{ item.description }}
                </p>
              </div>
              <div class="rounded-xl bg-[#1b1b1b] px-4 py-2 text-lg font-black text-white shadow-[4px_4px_0_0_#ef4444]">
                {{ formatPrice(item.price, item.currency) }}
              </div>
            </div>
            <figure
              v-if="item.image_url"
              class="overflow-hidden rounded-2xl border-4 border-[#1b1b1b] bg-white shadow-[8px_8px_0_0_#1b1b1b]"
            >
              <img
                :src="item.image_url"
                :alt="`${item.name} photo`"
                class="h-48 w-full object-cover"
                loading="lazy"
              />
            </figure>
            <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="rounded-full border-2 border-[#1b1b1b] bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-[#1b1b1b]"
              >
                {{ tag }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <footer class="grid gap-6 rounded-3xl border-4 border-[#1b1b1b] bg-[#1b1b1b] px-8 py-10 text-base font-semibold text-white shadow-[14px_14px_0_0_#ef4444] md:grid-cols-2">
        <p>{{ customTexts.footer || 'Menu evolves weekly. Allergies or dietary requests? Our team will tailor every plate.' }}</p>
        <div class="flex flex-wrap gap-3 md:justify-end">
          <span class="rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-black uppercase tracking-wide">
            {{ customTexts.social || '@neobrutalist.table' }}
          </span>
          <span class="rounded-lg bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-[#1b1b1b]">
            {{ customTexts.delivery || 'Delivery · 18:00 – 22:00' }}
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '~/types/menu-template'

defineProps<MenuTemplateProps>()

const formatPrice = (value: number | string, currency: string) => {
  const amount = Number(value)
  if (Number.isFinite(amount)) {
    return `${amount.toFixed(2)} ${currency}`
  }
  return typeof value === 'string' && value.trim().length > 0 ? `${value} ${currency}` : currency
}
</script>

