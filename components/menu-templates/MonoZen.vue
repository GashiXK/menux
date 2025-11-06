<template>
  <div class="min-h-screen bg-white text-black">
    <!-- Header -->
    <header class="border-b border-black py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-6xl font-light tracking-widest uppercase">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-4 text-sm tracking-wide uppercase text-neutral-700">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-4xl mx-auto px-6 py-20">
      <div v-for="category in categories" :key="category.id" class="mb-24">
        <h2 class="text-4xl font-light tracking-widest uppercase mb-12 text-center border-b border-black pb-4">
          {{ category.name }}
        </h2>
        
        <div class="space-y-10">
          <div v-for="item in category.items" :key="item.id" class="border-l-2 border-black pl-6">
            <div class="flex justify-between items-baseline gap-8">
              <h3 class="text-2xl font-light">{{ item.name }}</h3>
              <span class="text-xl font-light whitespace-nowrap">{{ item.price }}</span>
            </div>
            <p v-if="item.description" class="text-neutral-700 mt-2 text-sm leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="border-t border-black py-12 text-center">
      <p class="text-sm tracking-wide uppercase text-neutral-600">Thank you for visiting</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { MenuTemplateProps } from '@/types/menu-template'
defineProps<MenuTemplateProps>()
</script>

