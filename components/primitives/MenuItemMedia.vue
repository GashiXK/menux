<template>
  <figure v-if="src" :class="['relative overflow-hidden rounded-2xl', wrapperClass]">
    <img
      :src="src"
      :alt="alt"
      :class="['h-full w-full object-cover transition duration-500', imageClass]"
      loading="lazy"
    />
    <div v-if="overlayClass" :class="['absolute inset-0', overlayClass]" />
  </figure>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  wrapperClass?: string
  imageClass?: string
  overlayClass?: string
}>(), {
  src: null,
  wrapperClass: '',
  imageClass: '',
  overlayClass: ''
})
const { src, alt, wrapperClass, imageClass, overlayClass } = toRefs(props)
</script>


