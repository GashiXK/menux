<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
    <!-- Header -->
    <header class="bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white shadow-lg">
      <div class="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="text-xl text-white/95 font-medium">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-6xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <div class="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-orange-200">
          <!-- Category Header -->
          <div class="text-center mb-10">
            <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              {{ category.name }}
            </h2>
            <div class="w-32 h-2 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 rounded-full mx-auto mb-4"></div>
            <p v-if="category.description" class="text-slate-600 mt-4 text-lg">
              {{ category.description }}
            </p>
          </div>
          
          <!-- Menu Items Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <h3 class="text-xl font-bold text-slate-800 flex-1">
                  {{ item.name }}
                </h3>
                <span class="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent shrink-0">
                  {{ item.price }} <span class="text-sm text-slate-600">{{ item.currency }}</span>
                </span>
              </div>
              <p v-if="item.description" class="text-slate-600 text-sm mb-4 leading-relaxed">
                {{ item.description }}
              </p>
              <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full text-xs font-semibold shadow-md"
                >
                  {{ tag }}
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
import type { MenuTemplateProps } from '@/types/menu-template'
defineProps<MenuTemplateProps>()
</script>

