<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a0f1f] via-[#120918] to-black text-white antialiased">
    <div class="absolute inset-0 overflow-hidden opacity-40">
      <div class="absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-[#ff6bd6]/40 blur-3xl" />
      <div class="absolute right-[-20%] top-1/3 h-72 w-72 rounded-full bg-[#5b21b6]/40 blur-3xl" />
      <div class="absolute left-1/4 bottom-[-15%] h-80 w-80 rounded-full bg-[#f973c5]/30 blur-3xl" />
    </div>
    <div class="relative">
      <header class="sticky top-0 z-20 bg-gradient-to-b from-black/70 via-black/40 to-transparent backdrop-blur-xl border-b border-white/10">
        <div class="mx-auto max-w-6xl px-6 py-12 text-center">
          <p class="text-xs uppercase tracking-[0.6em] text-rose-200/80">Velvet tasting</p>
          <h1 class="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {{ tenant.name }}
          </h1>
          <p v-if="customTexts.subtitle" class="mt-3 text-sm text-rose-100/80 md:text-base">
            {{ customTexts.subtitle }}
          </p>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div class="space-y-16">
          <section
            v-for="category in categories"
            :key="category.id"
            class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_-40px_rgba(249,115,197,0.6)] backdrop-blur-xl"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.5em] text-rose-200/70">Signature course</p>
                <h2 class="mt-2 text-3xl font-semibold text-white md:text-4xl">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="mt-3 max-w-2xl text-sm text-rose-100/80 md:text-base">
                  {{ category.description }}
                </p>
              </div>
              <div class="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                <span class="inline-flex h-2 w-2 rounded-full bg-rose-300 animate-pulse" />
                Nightly pairings
              </div>
            </div>

            <div class="mt-10 grid gap-6 md:grid-cols-2">
              <article
                v-for="item in category.items"
                :key="item.id"
                class="group rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-rose-300/40 hover:bg-white/10"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-semibold text-white group-hover:text-rose-200 transition">
                      {{ item.name }}
                    </h3>
                    <p v-if="item.description" class="mt-2 text-sm text-rose-100/80 leading-relaxed">
                      {{ item.description }}
                    </p>
                  </div>
                  <div class="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-right text-sm font-semibold text-rose-100 shadow-inner shadow-black/40">
                    {{ formatPrice(item.price, item.currency) }}
                  </div>
                </div>
                <div v-if="item.tags && item.tags.length" class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-rose-100/80"
                  >
                    {{ tag }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-white/10 bg-black/60 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-rose-100/70 md:flex-row md:items-center md:justify-between">
          <p>{{ customTexts.footer || 'Late-night mixology and chef collaborations every weekend.' }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <span>{{ customTexts.location || 'Velvet District · Level 27' }}</span>
            <span aria-hidden="true" class="hidden text-rose-200/60 md:inline">·</span>
            <span>{{ customTexts.hours || 'Thu–Sun · 18:00 – 02:00' }}</span>
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

