<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-emerald-900 text-white">
    <header class="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-4xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
              {{ tenant.name }}
            </h1>
            <p v-if="customTexts.subtitle" class="mt-2 text-slate-200 text-lg">
              {{ customTexts.subtitle }}
            </p>
          </div>
          <div v-if="customTexts.cta" class="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.3em] text-slate-100">
            {{ customTexts.cta }}
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <section
        v-for="category in categories"
        :key="category.id"
        class="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.8)] p-10"
      >
        <div class="flex flex-col gap-2 mb-8">
          <div class="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-200">
            <span class="h-px w-10 bg-slate-300/30" />
            Signature Collection
          </div>
          <h2 class="text-3xl font-semibold text-white">{{ category.name }}</h2>
          <p v-if="category.description" class="text-slate-200/90 text-lg">
            {{ category.description }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-[0_25px_50px_-24px_rgba(56,189,248,0.6)] transition"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div class="relative flex items-start gap-4">
              <div class="flex-1 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
                  <p class="text-lg font-semibold text-cyan-200">
                    {{ item.price }} {{ item.currency }}
                  </p>
                </div>
                <p v-if="item.description" class="text-slate-200/80 leading-relaxed">
                  {{ item.description }}
                </p>
                <div
                  v-if="item.tags && item.tags.length"
                  class="flex flex-wrap gap-2 pt-2"
                >
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '@/types'

defineProps<MenuTemplateProps>()
</script>

