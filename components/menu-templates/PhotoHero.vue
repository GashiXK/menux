<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero -->
    <header
      class="relative h-96 bg-cover bg-center"
      style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600')"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-6xl font-bold drop-shadow-2xl">{{ tenant.name }}</h1>
          <p v-if="customTexts.subtitle" class="mt-4 text-xl drop-shadow-lg">{{ customTexts.subtitle }}</p>
        </div>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-16">
        <h2 class="text-4xl font-bold mb-8 text-neutral-800">{{ category.name }}</h2>
        
        <div class="space-y-6">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div class="flex justify-between items-start gap-6">
              <div class="flex-1">
                <h3 class="text-2xl font-semibold text-neutral-900">{{ item.name }}</h3>
                <p v-if="item.description" class="text-neutral-600 mt-2">{{ item.description }}</p>
              </div>
              <span class="text-3xl font-bold text-green-600">{{ item.price }}</span>
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

