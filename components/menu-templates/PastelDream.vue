<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50 text-slate-900">
    <header class="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-rose-100 shadow-sm">
      <div class="max-w-5xl mx-auto px-6 py-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-3">
            <h1 class="text-4xl sm:text-5xl font-semibold tracking-tight text-rose-500">
              {{ tenant.name }}
            </h1>
            <p v-if="customTexts.subtitle" class="text-lg text-rose-400 max-w-2xl">
              {{ customTexts.subtitle }}
            </p>
          </div>
          <div v-if="customTexts.cta" class="inline-flex items-center gap-3 rounded-full bg-rose-500 text-white px-6 py-3 text-sm font-medium shadow-lg shadow-rose-500/30">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
            {{ customTexts.cta }}
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <section
        v-for="category in categories"
        :key="category.id"
        class="rounded-3xl bg-white/80 border border-white/60 shadow-xl shadow-rose-100/60 overflow-hidden"
      >
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-rose-200/60 via-white to-sky-200/60" />
          <div class="relative px-8 py-10 space-y-4">
            <h2 class="text-3xl font-semibold text-rose-500">{{ category.name }}</h2>
            <p v-if="category.description" class="text-rose-400 max-w-2xl">
              {{ category.description }}
            </p>
          </div>
        </div>

        <div class="grid gap-6 px-8 pb-8 md:grid-cols-2">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="group rounded-2xl border border-rose-100 bg-white p-6 shadow-[0_25px_60px_-35px_rgba(244,114,182,0.7)] transition hover:-translate-y-1 hover:shadow-[0_35px_70px_-30px_rgba(14,165,233,0.5)]"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold text-slate-900">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-rose-400 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-base font-semibold text-rose-500">{{ item.price }} {{ item.currency }}</p>
                  <span class="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-500 mt-2">
                    Signature
                  </span>
                </div>
              </div>
              <div
                v-if="item.tags && item.tags.length"
                class="flex flex-wrap gap-2"
              >
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-500"
                >
                  {{ tag }}
                </span>
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

