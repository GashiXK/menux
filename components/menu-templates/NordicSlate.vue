<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 antialiased">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),transparent_45%)]" />
    <div class="relative">
      <header class="relative border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/70">
        <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center md:px-10">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/80 shadow-lg shadow-sky-500/20 ring-1 ring-slate-700/60">
            <UIcon name="i-heroicons-cube-transparent" class="h-8 w-8 text-sky-300" />
          </div>
          <div class="space-y-3">
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Seasonal tasting</p>
            <h1 class="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {{ customTexts.headline || tenant.name }}
            </h1>
          </div>
          <p class="mx-auto max-w-2xl text-lg text-slate-300/90">
            {{ customTexts.subtitle || 'Curated plates driven by Nordic craft, served on a canvas of slate gradients and soft light.' }}
          </p>
        </div>
      </header>
      <main class="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div class="grid gap-12">
          <section
            v-for="category in categories"
            :key="category.id"
            class="relative rounded-3xl bg-slate-900/60 p-8 ring-1 ring-slate-700/60 shadow-[0_40px_120px_-60px_rgba(15,118,210,0.45)]"
          >
            <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Signature selection</p>
                <h2 class="mt-2 text-3xl font-semibold text-white md:text-4xl">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="mt-3 max-w-xl text-base text-slate-300">
                  {{ category.description }}
                </p>
              </div>
              <div class="flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-300">
                <span class="inline-block h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                Chef tasting in three acts
              </div>
            </div>
            <div class="mt-10 grid gap-6 md:grid-cols-2">
              <article
                v-for="item in category.items"
                :key="item.id"
                class="group flex flex-col gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 px-6 py-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:bg-slate-900/80"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-semibold text-white group-hover:text-sky-300 transition">
                      {{ item.name }}
                    </h3>
                    <p v-if="item.description" class="mt-2 text-sm leading-relaxed text-slate-400">
                      {{ item.description }}
                    </p>
                  </div>
                <div class="rounded-xl bg-slate-900/80 px-3 py-2 text-right text-base font-semibold text-sky-200 shadow-inner shadow-slate-800/90">
                    {{ formatPrice(item.price, item.currency) }}
                  </div>
                </div>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
      <footer class="border-t border-slate-800/60 bg-slate-950/70">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-slate-400/90 md:flex-row md:px-10">
          <p>{{ customTexts.footer || 'Reservations recommended. Serving seasonal ingredients with Nordic sensibility.' }}</p>
          <div class="flex gap-4">
            <span>{{ customTexts.location || 'Old Town Waterfront' }}</span>
            <span aria-hidden="true">•</span>
            <span>{{ customTexts.hours || 'Wed–Sun · 17:00–23:00' }}</span>
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

