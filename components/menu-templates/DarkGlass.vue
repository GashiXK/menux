<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <!-- Header -->
    <header class="backdrop-blur-2xl bg-neutral-900/50 border-b border-cyan-500/30 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <h1 class="text-4xl font-bold text-cyan-400">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-2 text-cyan-200/70">{{ customTexts.subtitle }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-6xl mx-auto px-6 py-12">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <div class="backdrop-blur-2xl bg-neutral-800/40 border border-cyan-500/20 rounded-3xl p-8">
          <h2 class="text-2xl font-bold mb-6 text-cyan-300">{{ category.name }}</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div
              v-for="item in category.items"
              :key="item.id"
              class="backdrop-blur-xl bg-neutral-900/60 rounded-2xl p-6 border border-cyan-400/10 hover:border-cyan-400/30 transition"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-white">{{ item.name }}</h3>
                <span class="text-xl font-bold text-cyan-400">{{ item.price }}</span>
              </div>
              <p v-if="item.description" class="text-neutral-300 text-sm">{{ item.description }}</p>
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

