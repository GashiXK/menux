<template>
  <div class="min-h-screen bg-[#0c0c0e] text-[#f5e6c6] antialiased">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_55%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,215,128,0.12),transparent_50%)]" />
    <div class="relative">
      <header class="sticky top-0 z-20 border-b border-[#f2d28f]/20 bg-[#0c0c0e]/90 backdrop-blur-lg">
        <div class="mx-auto max-w-5xl px-6 py-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.55em] text-[#f8e6b7]/80">Art deco collection</p>
          <h1 class="mt-4 text-4xl font-bold tracking-[0.08em] text-[#fef8e8] md:text-5xl">
            {{ tenant.name }}
          </h1>
          <p v-if="customTexts.subtitle" class="mt-3 text-sm text-[#f5e6c6]/80 md:text-base">
            {{ customTexts.subtitle }}
          </p>
        </div>
      </header>

      <main class="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <div class="grid gap-12">
          <section
            v-for="category in categories"
            :key="category.id"
            class="rounded-[2.5rem] border border-[#f2d28f]/30 bg-gradient-to-br from-[#151514] via-[#10100f] to-[#0a0a0b] p-8 shadow-[0_35px_120px_-60px_rgba(242,210,143,0.45)]"
          >
            <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.6em] text-[#f5dca3]/70">Chef\'s selection</p>
                <h2 class="mt-2 text-3xl font-semibold text-[#fdf6dd] md:text-[2.25rem]">
                  {{ category.name }}
                </h2>
                <p v-if="category.description" class="mt-3 max-w-2xl text-sm text-[#f8e7c4]/75 md:text-base">
                  {{ category.description }}
                </p>
              </div>
              <div class="inline-flex items-center gap-3 rounded-full border border-[#f2d28f]/30 bg-[#f2d28f]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#f2d28f]">
                <span class="inline-block h-2 w-2 rounded-full bg-[#f2d28f] animate-pulse" />
                Limited release
              </div>
            </div>

            <div class="mt-10 space-y-6">
              <article
                v-for="item in category.items"
                :key="item.id"
                class="grid gap-4 rounded-3xl border border-[#f2d28f]/25 bg-black/30 px-6 py-5 transition duration-300 hover:-translate-y-1 hover:border-[#f8e6b7]/60 hover:bg-[#1a1610]/60 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <h3 class="text-xl font-semibold tracking-[0.03em] text-[#fef8e8]">
                    {{ item.name }}
                  </h3>
                  <p v-if="item.description" class="mt-3 text-sm text-[#f5e6c6]/80">
                    {{ item.description }}
                  </p>
                  <div v-if="item.tags && item.tags.length" class="mt-4 flex flex-wrap gap-2">
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="rounded-full border border-[#f2d28f]/30 bg-[#f2d28f]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-[#f2d28f]"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="flex items-start justify-end md:pl-6">
                  <div class="rounded-2xl border border-[#f2d28f]/40 bg-[#0b0b0b]/80 px-4 py-3 text-right text-base font-semibold tracking-[0.08em] text-[#f8e7c4] shadow-inner shadow-black/70">
                    {{ formatPrice(item.price, item.currency) }}
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-[#f2d28f]/25 bg-[#0b0b0b]/90 backdrop-blur-xl">
        <div class="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-9 text-sm text-[#f5e6c6]/75 md:flex-row md:items-center md:justify-between">
          <p>{{ customTexts.footer || 'Dress code: modern formal · Reservations required for parties of six or more.' }}</p>
          <div class="flex flex-wrap items-center gap-3">
            <span>{{ customTexts.location || 'Art Deco House · Grand Foyer Level' }}</span>
            <span aria-hidden="true" class="hidden text-[#f2d28f]/50 md:inline">·</span>
            <span>{{ customTexts.hours || 'Tue–Sat · 18:00 – 23:00' }}</span>
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

