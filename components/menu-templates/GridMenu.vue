<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <h1 class="text-4xl font-bold text-indigo-600">{{ tenant.name }}</h1>
        <p v-if="customTexts.subtitle" class="mt-2 text-neutral-600">{{ customTexts.subtitle }}</p>
      </div>
    </header>
    
    <!-- Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-indigo-800">{{ category.name }}</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-neutral-900">{{ item.name }}</h3>
                <p v-if="item.description" class="text-neutral-600 text-sm mt-2">{{ item.description }}</p>
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-indigo-600">{{ item.price }}</span>
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

