<template>
  <div class="min-h-screen bg-black text-white relative overflow-hidden">
    <!-- Animated Gradient Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 opacity-50 animate-gradient"></div>
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>
    
    <!-- Header -->
    <header class="relative z-10 border-b border-purple-500/30 backdrop-blur-xl bg-black/30">
      <div class="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 class="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-text">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="text-xl text-purple-200/80 font-medium">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="relative z-10 max-w-6xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <div class="backdrop-blur-2xl bg-black/40 border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-purple-500/20">
          <!-- Category Header -->
          <div class="text-center mb-10">
            <h2 class="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {{ category.name }}
            </h2>
            <div class="w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mx-auto mb-4"></div>
            <p v-if="category.description" class="text-purple-200/80 mt-4 text-lg">
              {{ category.description }}
            </p>
          </div>
          
          <!-- Menu Items Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="group backdrop-blur-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <h3 class="text-xl font-bold text-white group-hover:text-purple-300 transition-colors flex-1">
                  {{ item.name }}
                </h3>
                <span class="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent shrink-0">
                  {{ item.price }} <span class="text-sm text-purple-300/70">{{ item.currency }}</span>
                </span>
              </div>
              <p v-if="item.description" class="text-purple-200/80 text-sm mb-4 leading-relaxed">
                {{ item.description }}
              </p>
              <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30 text-purple-200 rounded-full text-xs font-bold"
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

<style scoped>
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient-text {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-text {
  background-size: 200% 200%;
  animation: gradient-text 3s ease infinite;
}
</style>

