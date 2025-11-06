<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
    <!-- Decorative Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Header -->
    <header class="relative z-10 border-b border-amber-500/20">
      <div class="max-w-5xl mx-auto px-6 py-20 text-center">
        <div class="inline-block mb-6">
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4"></div>
          <h1 class="text-5xl md:text-6xl font-light tracking-wider mb-4 text-amber-400">
            {{ tenant.name }}
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
        </div>
        <p v-if="customTexts.subtitle" class="text-xl text-amber-200/80 font-light tracking-wide">
          {{ customTexts.subtitle }}
        </p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="relative z-10 max-w-5xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-20">
        <!-- Category Header -->
        <div class="text-center mb-12">
          <div class="w-16 h-px bg-amber-400 mx-auto mb-4"></div>
          <h2 class="text-4xl font-light text-amber-400 mb-4 tracking-wider">
            {{ category.name }}
          </h2>
          <div class="w-16 h-px bg-amber-400 mx-auto mb-4"></div>
          <p v-if="category.description" class="text-amber-200/70 mt-4 text-lg max-w-2xl mx-auto font-light">
            {{ category.description }}
          </p>
        </div>
        
        <!-- Menu Items -->
        <div class="space-y-8">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="border-l-2 border-amber-500/30 pl-8 py-4 hover:border-amber-400/50 transition-colors group"
          >
            <div class="flex items-start justify-between gap-8">
              <div class="flex-1">
                <h3 class="text-2xl font-light text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {{ item.name }}
                </h3>
                <p v-if="item.description" class="text-slate-300 text-base leading-relaxed mb-3 font-light">
                  {{ item.description }}
                </p>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="px-3 py-1 bg-amber-500/10 border border-amber-400/30 text-amber-300 rounded-full text-xs font-light uppercase tracking-wider"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-3xl font-light text-amber-400 whitespace-nowrap">
                  {{ item.price }} <span class="text-lg text-amber-300/70">{{ item.currency }}</span>
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

