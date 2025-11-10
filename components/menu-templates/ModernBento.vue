<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <header class="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.4em] text-slate-500">
              Chef&apos;s selections
            </p>
            <h1 class="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              {{ tenant.name }}
            </h1>
            <p v-if="customTexts.subtitle" class="text-slate-600 text-lg max-w-2xl">
              {{ customTexts.subtitle }}
            </p>
          </div>
          <div v-if="customTexts.cta" class="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-medium">
            <span class="h-2 w-2 rounded-full bg-cyan-400" />
            {{ customTexts.cta }}
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-12 space-y-10">
      <section
        v-for="category in categories"
        :key="category.id"
        class="space-y-6"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">{{ category.name }}</h2>
            <p v-if="category.description" class="text-slate-600">
              {{ category.description }}
            </p>
          </div>
          <div class="h-px flex-1 bg-slate-200 hidden sm:block" />
        </div>

        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="group rounded-3xl bg-white shadow-[0_25px_50px_-30px_rgba(15,23,42,0.5)] border border-slate-100 p-6 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(14,165,233,0.5)]"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-slate-900">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-sm text-slate-600 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-base font-semibold text-slate-900">{{ item.price }} {{ item.currency }}</p>
                  <div class="mt-2 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 group-hover:scale-x-105 origin-right transition" />
                </div>
              </div>
              <div
                v-if="item.tags && item.tags.length"
                class="flex flex-wrap gap-2"
              >
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
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

