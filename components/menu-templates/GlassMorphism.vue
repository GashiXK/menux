<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]"></div>
    </div>
    
    <!-- Header -->
    <header class="relative z-10 backdrop-blur-2xl bg-white/20 border-b border-white/30 sticky top-0">
      <div class="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="text-xl text-white/90 backdrop-blur-sm">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="relative z-10 max-w-6xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <div class="backdrop-blur-2xl bg-white/30 border border-white/40 rounded-3xl p-8 md:p-12 shadow-2xl">
          <!-- Category Header -->
          <div class="text-center mb-10">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {{ category.name }}
            </h2>
            <div class="w-32 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
            <p v-if="category.description" class="text-white/90 mt-4 text-lg backdrop-blur-sm">
              {{ category.description }}
            </p>
          </div>
          
          <!-- Menu Items -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <h3 class="text-xl font-bold text-white flex-1 drop-shadow-md">
                  {{ item.name }}
                </h3>
                <span class="text-2xl font-bold text-white shrink-0 drop-shadow-lg">
                  {{ item.price }} <span class="text-sm text-white/80">{{ item.currency }}</span>
                </span>
              </div>
              <p v-if="item.description" class="text-white/90 text-sm mb-4 leading-relaxed">
                {{ item.description }}
              </p>
              <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-3 py-1 bg-white/30 backdrop-blur-sm border border-white/40 text-white rounded-full text-xs font-semibold"
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
import type { MenuTemplateProps } from '@/types'
defineProps<MenuTemplateProps>()
</script>

