<template>
  <div class="min-h-screen bg-neutral-100 flex">
    <!-- Side nav -->
    <aside class="w-64 bg-emerald-600 text-white p-8 sticky top-0 h-screen overflow-y-auto">
      <h1 class="text-3xl font-bold mb-8">{{ tenant.name }}</h1>
      <nav class="space-y-3">
        <a
          v-for="category in categories"
          :key="category.id"
          :href="`#cat-${category.id}`"
          class="block px-4 py-2 rounded-lg hover:bg-emerald-500 transition"
        >
          {{ category.name }}
        </a>
      </nav>
    </aside>
    
    <!-- Main content -->
    <main class="flex-1 p-12 overflow-y-auto">
      <div v-for="category in categories" :key="category.id" :id="`cat-${category.id}`" class="mb-16">
        <h2 class="text-4xl font-bold text-emerald-700 mb-8">{{ category.name }}</h2>
        
        <div class="space-y-6">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-bold text-neutral-900">{{ item.name }}</h3>
                <p v-if="item.description" class="text-neutral-600 mt-2">{{ item.description }}</p>
              </div>
              <span class="text-2xl font-bold text-emerald-600">{{ item.price }}</span>
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

