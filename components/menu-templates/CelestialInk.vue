<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-[#05051a] to-black text-slate-100 antialiased">
    <div class="absolute inset-0 overflow-hidden opacity-30">
      <div class="absolute left-[-15%] top-1/4 h-80 w-80 rounded-full bg-sky-500/40 blur-3xl" />
      <div class="absolute right-[-20%] top-[-10%] h-96 w-96 rounded-full bg-indigo-600/40 blur-3xl" />
      <div class="absolute left-1/3 bottom-[-25%] h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
    </div>
    <div class="relative">
      <header class="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-14 text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-sky-400/40 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-sky-200">
            Celestial dining
          </span>
          <h1 class="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {{ tenant.name }}
          </h1>
          <p v-if="customTexts.subtitle" class="max-w-2xl text-sm text-slate-300/80 md:text-base">
            {{ customTexts.subtitle }}
          </p>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div class="space-y-16">
          <section
            v-for="category in categories"
            :key="category.id"
            class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-[0_30px_90px_-50px_rgba(59,130,246,0.7)] backdrop-blur-2xl"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.45em] text-sky-200/80">Stellar course</p>
                <h2 class="mt-2 text-3xl font-semibold text-white md:text-4xl">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="mt-3 max-w-2xl text-sm text-slate-200/80 md:text-base">
                  {{ category.description }}
                </p>
              </div>
              <div class="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
                <span class="h-2 w-2 rounded-full bg-sky-300 animate-ping" />
                Orbitally paired
              </div>
            </div>

            <div class="mt-10 grid gap-6 md:grid-cols-2">
              <article
                v-for="item in category.items"
                :key="item.id"
                class="group rounded-2xl border border-white/10 bg-black/30 p-6 transition duration-300 hover:border-sky-400/50 hover:bg-sky-500/10"
              >
                <div class="flex flex-col gap-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h3 class="text-xl font-semibold text-white group-hover:text-sky-200 transition">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.description" class="mt-2 text-sm text-slate-300/80">
                        {{ item.description }}
                      </p>
                    </div>
                    <div class="rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-sky-200 shadow-inner shadow-blue-900/60">
                      {{ formatPrice(item.price, item.currency) }}
                    </div>
                  </div>
                  <figure
                    v-if="item.image_url"
                    class="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-[0_30px_90px_-60px_rgba(125,211,252,0.5)]"
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
                    class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-200"
                  >
                    {{ tag }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-white/10 bg-black/70 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-slate-300/80 md:flex-row md:items-center md:justify-between">
          <p>{{ customTexts.footer || 'Experience chef-led tastings beneath our immersive celestial canopy.' }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <span>{{ customTexts.location || 'Observatory Suite · Skyline' }}</span>
            <span aria-hidden="true" class="hidden text-slate-500 md:inline">·</span>
            <span>{{ customTexts.hours || 'Wed–Sun · 17:30 – 23:30' }}</span>
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

