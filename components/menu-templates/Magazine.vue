<template>
  <div class="min-h-screen bg-neutral-50" style="font-family: Georgia, serif;">
    <!-- Header -->
    <header class="bg-neutral-900 text-white py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h1 class="text-7xl font-bold mb-2 tracking-tight">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="text-2xl text-neutral-300 italic">{{ customTexts.subtitle }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-6xl mx-auto px-6 py-16">
      <div v-for="(category, idx) in categories" :key="category.id" class="mb-20">
        <!-- Editorial layout: alternating sides -->
        <div :class="idx % 2 === 0 ? 'text-left' : 'text-right'">
          <h2 class="text-5xl font-bold mb-2 text-neutral-900">{{ category.name }}</h2>
          <p v-if="category.description" class="text-xl text-neutral-600 italic mb-12">
            {{ category.description }}
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-12">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="space-y-3"
          >
            <h3 class="text-3xl font-bold text-neutral-900">{{ item.name }}</h3>
            <p v-if="item.description" class="text-neutral-700 leading-relaxed">{{ item.description }}</p>
            <div class="flex items-baseline gap-2 pt-2">
              <span class="text-4xl font-bold text-neutral-900">{{ item.price }}</span>
              <span class="text-sm text-neutral-500 uppercase">{{ item.currency }}</span>
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

