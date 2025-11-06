<template>
  <div class="min-h-screen bg-neutral-800 text-white" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhaW4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PGNpcmNsZSBjeD0iNzAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZ3JhaW4pIi8+PC9zdmc+');">
    <!-- Header -->
    <header class="border-b-4 border-white/30 py-12">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <h1 class="text-6xl font-bold" style="font-family: 'Brush Script MT', cursive; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          {{ tenant.name }}
        </h1>
        <p v-if="customTexts.subtitle" class="mt-4 text-2xl text-white/90">{{ customTexts.subtitle }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-16">
      <div v-for="category in categories" :key="category.id" class="mb-16">
        <h2 class="text-4xl font-bold mb-8 text-yellow-300 underline decoration-wavy">{{ category.name }}</h2>
        
        <div class="space-y-8">
          <div v-for="item in category.items" :key="item.id" class="border-b border-white/20 pb-6">
            <div class="flex justify-between items-baseline gap-4">
              <h3 class="text-2xl font-semibold">{{ item.name }}</h3>
              <div class="border-b border-dotted border-white/40 flex-1"></div>
              <span class="text-2xl font-bold text-yellow-400">{{ item.price }}</span>
            </div>
            <p v-if="item.description" class="text-white/80 mt-2 italic">{{ item.description }}</p>
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

