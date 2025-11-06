<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b-2 border-black">
      <div class="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 class="text-6xl md:text-7xl font-black text-black mb-6 tracking-tighter">
          {{ tenant.name }}
        </h1>
        <div class="w-32 h-1 bg-black mx-auto mb-6"></div>
        <p v-if="customTexts.subtitle" class="text-xl text-black/70 font-light uppercase tracking-widest">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-4xl mx-auto px-6 py-20">
      <div v-for="category in categories" :key="category.id" class="mb-24">
        <!-- Category Header -->
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-black text-black mb-6 tracking-tighter">
            {{ category.name }}
          </h2>
          <div class="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p v-if="category.description" class="text-black/60 text-lg max-w-2xl mx-auto font-light uppercase tracking-wide">
            {{ category.description }}
          </p>
        </div>
        
        <!-- Menu Items -->
        <div class="space-y-12">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="border-b border-black/10 pb-8 last:border-0 last:pb-0"
          >
            <div class="flex items-start justify-between gap-12">
              <div class="flex-1">
                <h3 class="text-3xl font-black text-black mb-3 tracking-tight">
                  {{ item.name }}
                </h3>
                <p v-if="item.description" class="text-black/60 text-base leading-relaxed mb-4 font-light">
                  {{ item.description }}
                </p>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-3">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-4xl font-black text-black whitespace-nowrap">
                  {{ item.price }} <span class="text-2xl text-black/60">{{ item.currency }}</span>
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

