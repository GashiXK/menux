<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950 text-white">
    <div class="absolute inset-0 bg-[conic-gradient(from_140deg_at_50%_50%,rgba(59,130,246,0.25),rgba(244,114,182,0.18),rgba(16,185,129,0.25),rgba(59,130,246,0.25))]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.25),transparent_55%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
    <div class="relative backdrop-blur-[20px]">
      <header class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center md:gap-8 md:px-10">
        <div class="mx-auto h-16 w-16 rounded-full bg-white/10 shadow-[0_0_60px_rgba(59,130,246,0.3)] ring-2 ring-white/20 backdrop-blur">
          <div class="flex h-full items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="h-8 w-8 text-emerald-200" />
          </div>
        </div>
        <p class="text-xs uppercase tracking-[0.6em] text-white/60">
          {{ customTexts.badge || 'Immersive Dining' }}
        </p>
        <h1 class="bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl" style="background-image: linear-gradient(135deg,#a855f7 0%,#38bdf8 50%,#10b981 100%);">
          {{ customTexts.headline || tenant.name }}
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-white/80">
          {{ customTexts.subtitle || 'A holographic wave of flavor, where prisms of light meet sensory cuisine.' }}
        </p>
      </header>

      <main class="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <div class="grid gap-14">
          <section
            v-for="category in categories"
            :key="category.id"
            class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_40px_120px_-60px_rgba(168,85,247,0.6)]"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            <div class="relative space-y-8 px-6 py-10 md:px-10">
              <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div class="space-y-3">
                  <h2 class="text-3xl font-semibold text-white md:text-4xl">
                    {{ category.name }}
                  </h2>
                  <p v-if="category.description" class="max-w-xl text-sm leading-relaxed text-white/70">
                    {{ category.description }}
                  </p>
                </div>
                <div class="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                  {{ customTexts.highlight || 'Prismatic pairing' }}
                </div>
              </div>
              <div class="grid gap-6 md:grid-cols-2">
                <article
                  v-for="item in category.items"
                  :key="item.id"
                  class="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 px-6 py-6 shadow-[0_24px_70px_-50px_rgba(59,130,246,0.8)] transition duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-slate-950/60"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div class="relative flex flex-col gap-4">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <h3 class="text-xl font-semibold text-white">
                          {{ item.name }}
                        </h3>
                        <p v-if="item.description" class="mt-2 text-sm text-white/70">
                          {{ item.description }}
                        </p>
                      </div>
                      <div class="rounded-xl bg-white/10 px-3 py-2 text-right text-base font-semibold text-emerald-200 shadow-inner shadow-emerald-500/20">
                        {{ formatPrice(item.price, item.currency) }}
                      </div>
                    </div>
                    <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-white/10 bg-slate-950/80">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-white/70 md:flex-row md:px-10">
          <p>{{ customTexts.footer || 'Limited seats nightly. Immersive visual journey through each course.' }}</p>
          <div class="flex flex-wrap items-center gap-4">
            <span>{{ customTexts.location || 'Skyline Atrium · Level 28' }}</span>
            <span aria-hidden="true" class="text-white/40">•</span>
            <span>{{ customTexts.dressCode || 'Dress code · Smart creative' }}</span>
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

