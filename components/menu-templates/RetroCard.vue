<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Header -->
    <header class="bg-red-600 text-white shadow-lg">
      <div class="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 class="text-5xl font-bold drop-shadow-lg">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-3 text-amber-100 text-lg">{{ customTexts.subtitle }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-6xl mx-auto px-6 py-12">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-red-700 text-center">{{ category.name }}</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="bg-white rounded-xl shadow-xl p-6 border-4 border-red-400 transform hover:scale-105 transition"
          >
            <h3 class="text-xl font-bold text-red-700 mb-2">{{ item.name }}</h3>
            <p v-if="item.description" class="text-neutral-700 text-sm mb-4">{{ item.description }}</p>
            <div class="text-right">
              <span class="text-2xl font-black text-red-600">{{ item.price }} {{ item.currency }}</span>
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

