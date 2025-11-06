<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
    <!-- Header -->
    <header class="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl">
      <div class="max-w-6xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-xl relative z-10">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="text-xl text-white/95 font-medium relative z-10">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-6xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <div class="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-green-200">
          <!-- Category Header -->
          <div class="text-center mb-10">
            <h2 class="text-4xl md:text-5xl font-bold mb-4 text-green-700">
              {{ category.name }}
            </h2>
            <div class="w-32 h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full mx-auto mb-4"></div>
            <p v-if="category.description" class="text-slate-600 mt-4 text-lg">
              {{ category.description }}
            </p>
          </div>
          
          <!-- Menu Items Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <h3 class="text-xl font-bold text-slate-800 flex-1">
                  {{ item.name }}
                </h3>
                <span class="text-2xl font-bold text-green-600 shrink-0">
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
                  class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
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
import type { MenuTemplateProps } from '~/types/menu-template'
defineProps<MenuTemplateProps>()
</script>

