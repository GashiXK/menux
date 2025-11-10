<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-amber-50">
    <header class="sticky top-0 z-40 border-b border-orange-500/20 bg-black/70 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-orange-400/80">
              <span class="h-px w-8 bg-orange-500/40" />
              Chef&apos;s Table
            </div>
            <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-white">
              {{ tenant.name }}
            </h1>
            <p v-if="customTexts.subtitle" class="text-lg text-orange-200/80 max-w-3xl">
              {{ customTexts.subtitle }}
            </p>
          </div>
          <div v-if="customTexts.cta" class="inline-flex items-center gap-3 rounded-full border border-orange-400/40 bg-orange-500/10 px-6 py-3 text-sm font-medium text-orange-200">
            <UIcon name="i-heroicons-fire" class="w-5 h-5 text-orange-300" />
            {{ customTexts.cta }}
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-12 space-y-14">
      <section
        v-for="category in categories"
        :key="category.id"
        class="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-10 shadow-[0_35px_120px_-60px_rgba(249,115,22,0.7)]"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 class="text-3xl font-semibold text-white">{{ category.name }}</h2>
            <p v-if="category.description" class="text-orange-200/80 mt-2 max-w-2xl">
              {{ category.description }}
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-orange-400/80">
            <span>Inspired by Fire</span>
            <span class="h-px w-8 bg-orange-500/40" />
          </div>
        </div>

        <div class="space-y-6">
          <article
            v-for="item in category.items"
            :key="item.id"
            class="rounded-2xl border border-orange-500/20 bg-black/40 p-6 transition hover:bg-black/60 hover:shadow-[0_30px_80px_-50px_rgba(249,115,22,0.8)]"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 animate-pulse" />
                  <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
                </div>
                <p v-if="item.description" class="text-sm text-orange-200/80 leading-relaxed">
                  {{ item.description }}
                </p>
                <div
                  v-if="item.tags && item.tags.length"
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="inline-flex items-center rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-200"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="text-right min-w-[120px]">
                <p class="text-lg font-semibold text-orange-300">{{ item.price }} {{ item.currency }}</p>
                <div class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
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

