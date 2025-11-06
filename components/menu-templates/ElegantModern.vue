<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Header -->
    <header class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      <div class="relative max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 class="text-5xl md:text-6xl font-light tracking-tight mb-4">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="text-xl text-slate-300 font-light">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-20">
        <!-- Category Header -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-light text-slate-900 mb-3">{{ category.name }}</h2>
          <div class="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto"></div>
          <p v-if="category.description" class="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">
            {{ category.description }}
          </p>
        </div>
        
        <!-- Menu Items -->
        <div class="space-y-6">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="group border-b border-slate-100 pb-6 last:border-0 last:pb-0 hover:border-slate-200 transition-colors"
          >
            <div class="flex items-start justify-between gap-8">
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-4">
                  <div class="flex-1">
                    <h3 class="text-2xl font-light text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                      {{ item.name }}
                    </h3>
                    <p v-if="item.description" class="text-slate-600 text-base leading-relaxed mb-3">
                      {{ item.description }}
                    </p>
                    <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium uppercase tracking-wide"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-2xl font-light text-slate-900 whitespace-nowrap">
                  {{ item.price }} <span class="text-sm text-slate-500">{{ item.currency }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '@/types'
defineProps<MenuTemplateProps>()
</script>

