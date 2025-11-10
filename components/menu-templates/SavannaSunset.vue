<template>
  <div class="min-h-screen bg-gradient-to-br from-[#fff2d7] via-[#ffe6c1] to-[#ffd5aa] text-[#47280d] antialiased">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,166,0,0.25),transparent_60%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(244,114,82,0.2),transparent_55%)]" />
    <div class="relative">
      <header class="sticky top-0 z-20 border-b border-[#fbbf24]/40 bg-[#fffaf2]/90 backdrop-blur">
        <div class="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-12 text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.5em] text-[#bf3b0d]">
            Sunset table
          </span>
          <h1 class="text-4xl font-semibold tracking-tight text-[#5b2c10] md:text-5xl">
            {{ tenant.name }}
          </h1>
          <p v-if="customTexts.subtitle" class="max-w-2xl text-sm text-[#6b3411]/70 md:text-base">
            {{ customTexts.subtitle }}
          </p>
        </div>
      </header>

      <main class="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <div class="space-y-14">
          <section
            v-for="category in categories"
            :key="category.id"
            class="rounded-[2.5rem] border border-[#fbbf24]/40 bg-white/80 p-8 shadow-[0_25px_60px_-35px_rgba(249,115,22,0.45)] transition"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.45em] text-[#d97706]">Chef\'s trail</p>
                <h2 class="mt-2 text-3xl font-semibold text-[#5b2c10] md:text-[2.3rem]">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="mt-3 max-w-2xl text-sm text-[#7c3f16]/80 md:text-base">
                  {{ category.description }}
                </p>
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-[#fb923c]/40 bg-[#fb923c]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#c2410c]">
                <span class="inline-block h-2 w-2 rounded-full bg-[#fb923c]" />
                Golden hour pick
              </div>
            </div>

            <div class="mt-10 grid gap-6 md:grid-cols-2">
              <article
                v-for="item in category.items"
                :key="item.id"
                class="rounded-2xl border border-[#fcd34d]/40 bg-white px-6 py-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#f97316]/50"
              >
                <div class="flex flex-col gap-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h3 class="text-xl font-semibold text-[#5b2c10]">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.description" class="mt-2 text-sm text-[#7c3f16]/75">
                        {{ item.description }}
                      </p>
                    </div>
                    <div class="rounded-xl border border-[#f97316]/30 bg-[#fff5eb] px-3 py-2 text-right text-sm font-semibold text-[#c2410c] shadow-inner shadow-[#fef3c7]">
                      {{ formatPrice(item.price, item.currency) }}
                    </div>
                  </div>
                  <figure
                    v-if="item.image_url"
                    class="overflow-hidden rounded-2xl border border-[#f97316]/40 bg-[#fff5eb] shadow-[0_30px_80px_-50px_rgba(249,115,22,0.45)]"
                  >
                    <img
                      :src="item.image_url"
                      :alt="`${item.name} photo`"
                      class="h-48 w-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div v-if="item.tags && item.tags.length" class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-[#fcd34d]/40 bg-[#fef3c7] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#92400e]"
                  >
                    {{ tag }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-[#fbbf24]/40 bg-[#fff8ec]/90 backdrop-blur">
        <div class="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-[#6b3411]/75 md:flex-row md:items-center md:justify-between">
          <p>{{ customTexts.footer || 'Sip sundowners with our curated menu and live acoustic sets every evening.' }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <span>{{ customTexts.location || 'Savanna Terrace · Rooftop Level' }}</span>
            <span aria-hidden="true" class="hidden text-[#fb923c]/60 md:inline">·</span>
            <span>{{ customTexts.hours || 'Daily · 17:00 – 23:30' }}</span>
          </div>
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

