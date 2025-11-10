<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-white text-emerald-900">
    <header class="sticky top-0 z-40 border-b border-emerald-100 bg-white/80 backdrop-blur-lg shadow-sm">
      <div class="max-w-5xl mx-auto px-6 py-10">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="space-y-3">
            <p class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-emerald-500">
              <span class="h-px w-8 bg-emerald-300" />
              Seasonal Harvest
            </p>
            <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-emerald-900">
              {{ tenant.name }}
            </h1>
            <p v-if="customTexts.subtitle" class="text-lg text-emerald-600 max-w-2xl">
              {{ customTexts.subtitle }}
            </p>
          </div>
          <div v-if="customTexts.cta" class="inline-flex items-center gap-3 rounded-full border border-emerald-300 bg-emerald-100 px-6 py-3 text-sm font-medium text-emerald-700">
            <UIcon name="i-heroicons-leaf" class="w-5 h-5 text-emerald-500" />
            {{ customTexts.cta }}
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <section
        v-for="category in categories"
        :key="category.id"
        class="rounded-3xl border border-emerald-200 bg-white shadow-[0_25px_80px_-40px_rgba(4,120,87,0.35)] overflow-hidden"
      >
        <div class="h-2 bg-gradient-to-r from-emerald-300 via-lime-300 to-emerald-400" />
        <div class="px-8 py-10 space-y-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-3xl font-semibold text-emerald-900">{{ category.name }}</h2>
              <p v-if="category.description" class="text-emerald-600 max-w-2xl">
                {{ category.description }}
              </p>
            </div>
            <div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600">
              Garden Fresh
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <article
              v-for="item in category.items"
              :key="item.id"
              class="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-6 transition hover:bg-emerald-100/60 hover:shadow-[0_25px_60px_-40px_rgba(4,120,87,0.5)]"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold text-emerald-900">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-emerald-600 leading-relaxed">
                    {{ item.description }}
                  </p>
                  <div
                    v-if="item.tags && item.tags.length"
                    class="flex flex-wrap gap-2 pt-2"
                  >
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-200"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="text-right min-w-[120px]">
                  <p class="text-lg font-semibold text-emerald-700">{{ item.price }} {{ item.currency }}</p>
                  <div class="mt-3 inline-flex items-center gap-2 text-xs text-emerald-500">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Sustainably sourced
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '@/types'

defineProps<MenuTemplateProps>()
</script>

