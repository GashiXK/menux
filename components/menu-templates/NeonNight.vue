<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-6 py-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="mt-2 text-purple-200">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-12">
      <div v-for="category in categories" :key="category.id" class="mb-16">
        <div class="backdrop-blur-xl bg-white/5 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 class="text-3xl font-bold mb-2 text-purple-300">{{ category.name }}</h2>
          <p v-if="category.description" class="text-purple-200 mb-6">{{ category.description }}</p>
          
          <div class="grid gap-6">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-purple-400/20 hover:border-purple-400/50 transition"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
                  <p v-if="item.description" class="text-purple-100 mt-1">{{ item.description }}</p>
                  <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2 mt-3">
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="px-3 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-pink-400">{{ item.price }} {{ item.currency }}</span>
                </div>
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

