<template>
  <div class="min-h-screen bg-white text-neutral-900">
    <!-- Header -->
    <header class="border-b border-neutral-200">
      <div class="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 class="text-5xl font-light tracking-tight">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-4 text-neutral-600 text-lg">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-4xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-20">
        <h2 class="text-3xl font-light mb-8 pb-3 border-b border-neutral-300">{{ category.name }}</h2>
        <p v-if="category.description" class="text-neutral-600 mb-8">{{ category.description }}</p>
        
        <div class="space-y-8">
          <div v-for="item in category.items" :key="item.id" class="flex justify-between items-start gap-8">
            <div class="flex-1">
              <h3 class="text-xl font-medium mb-1">{{ item.name }}</h3>
              <p v-if="item.description" class="text-neutral-600 text-sm leading-relaxed">
                {{ item.description }}
              </p>
            </div>
            <div class="text-right whitespace-nowrap">
              <span class="text-lg font-medium">{{ item.price }} {{ item.currency }}</span>
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

