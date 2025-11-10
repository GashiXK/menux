<template>
  <div class="min-h-screen bg-gradient-to-b from-[#f1f7ff] via-[#e0f2ff] to-white text-[#0f172a] antialiased">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_55%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.18),transparent_50%)]" />
    <div class="relative">
      <header class="sticky top-0 z-20 border-b border-[#bae6fd] bg-white/80 backdrop-blur-xl">
        <div class="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-12 text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.45em] text-[#0369a1]">
            Coastal tasting
          </span>
          <h1 class="text-4xl font-semibold tracking-tight text-[#0f172a] md:text-5xl">
            {{ tenant.name }}
          </h1>
          <p v-if="customTexts.subtitle" class="max-w-2xl text-sm text-[#1e3a5f]/70 md:text-base">
            {{ customTexts.subtitle }}
          </p>
        </div>
      </header>

      <main class="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <div class="space-y-12">
          <section
            v-for="category in categories"
            :key="category.id"
            class="rounded-[2.25rem] border border-[#bae6fd] bg-white/85 p-8 shadow-[0_20px_60px_-40px_rgba(14,165,233,0.45)] backdrop-blur"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[#0ea5e9]">Fresh catch</p>
                <h2 class="mt-2 text-3xl font-semibold text-[#0f172a] md:text-[2.2rem]">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="mt-3 max-w-2xl text-sm text-[#1e3a5f]/75 md:text-base">
                  {{ category.description }}
                </p>
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 bg-[#e0f2ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0369a1]">
                <span class="inline-block h-2 w-2 rounded-full bg-[#38bdf8]" />
                Daily tides
              </div>
            </div>

            <div class="mt-10 grid gap-6 md:grid-cols-2">
              <article
                v-for="item in category.items"
                :key="item.id"
                class="rounded-2xl border border-[#bae6fd] bg-[#f8fbff] px-6 py-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0ea5e9]/60"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-semibold text-[#0f172a]">
                      {{ item.name }}
                    </h3>
                    <p v-if="item.description" class="mt-2 text-sm text-[#1e3a5f]/75">
                      {{ item.description }}
                    </p>
                  </div>
                  <div class="rounded-xl border border-[#38bdf8]/40 bg-white px-3 py-2 text-right text-sm font-semibold text-[#0369a1] shadow-inner shadow-[#e0f2ff]">
                    {{ formatPrice(item.price, item.currency) }}
                  </div>
                </div>
                <div v-if="item.tags && item.tags.length" class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-[#bae6fd] bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#0c4a6e]"
                  >
                    {{ tag }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-[#bae6fd] bg-white/85 backdrop-blur">
        <div class="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-[#1e3a5f]/70 md:flex-row md:items-center md:justify-between">
          <p>{{ customTexts.footer || 'Ocean-to-table dining with locally sourced seafood and coastal botanicals.' }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <span>{{ customTexts.location || 'Harborfront Deck · East Pier' }}</span>
            <span aria-hidden="true" class="hidden text-[#0ea5e9]/60 md:inline">·</span>
            <span>{{ customTexts.hours || 'Mon–Sun · 12:00 – 22:30' }}</span>
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

