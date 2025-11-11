<template>
  <div :class="outerWrapperClass" v-bind="forwardedAttrs">
    <div :class="innerStackClass" role="status" aria-live="polite" aria-busy="true">
      <div v-if="variant === 'restaurant'" class="relative" :class="ringWrapperClass">
        <div class="animate-pulse-scale rounded-full bg-primary/10" :class="sizeClass" />
        <div class="absolute inset-0 flex items-center justify-center rounded-full bg-primary/15">
          <UIcon name="i-lucide-utensils-crossed" class="text-primary animate-cutlery-sway" :class="iconClass" />
        </div>
      </div>
 
      <div
        v-else-if="variant === 'minimal'"
        class="border-4 border-default/40 border-t-primary rounded-full animate-spin"
        :class="sizeClass"
      />
 
      <div v-else-if="variant === 'dots'" class="flex items-center gap-2">
        <span
          v-for="dot in 3"
          :key="dot"
          class="rounded-full bg-primary animate-dot-bounce"
          :class="dotClass"
          :style="dotDelays[dot - 1]"
        />
      </div>
 
      <div v-else-if="variant === 'progress'" class="relative overflow-hidden rounded-full bg-default/60" :class="progressClass">
        <span class="absolute inset-0 h-full w-1/2 animate-progress-bar bg-gradient-to-r from-primary via-primary/60 to-primary" />
      </div>
 
      <UIcon v-else name="i-heroicons-arrow-path" class="text-primary animate-spin" :class="sizeClass" />
 
      <p v-if="text" :class="textClass">
        {{ text }}
      </p>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ComputedRef } from 'vue'
 
type LoaderVariant = 'default' | 'restaurant' | 'minimal' | 'dots' | 'progress'
type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'
 
interface AppLoaderProps {
  variant?: LoaderVariant
  size?: LoaderSize
  fullscreen?: boolean
  text?: string
  className?: string
}
 
defineOptions({ inheritAttrs: false })
 
const props = withDefaults(defineProps<AppLoaderProps>(), {
  variant: 'default',
  size: 'md',
  fullscreen: false,
  text: undefined,
  className: undefined
})
 
const attrs = useAttrs()
 
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
 
const sizeClassMap: Record<LoaderSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
}
 
const iconClassMap: Record<LoaderSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9',
  xl: 'h-14 w-14'
}
 
const dotClassMap: Record<LoaderSize, string> = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
  xl: 'h-6 w-6'
}
 
const textSizeMap: Record<LoaderSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}
 
const progressClassMap: Record<LoaderSize, string> = {
  sm: 'h-1 w-32',
  md: 'h-[0.375rem] w-48',
  lg: 'h-2 w-64',
  xl: 'h-3 w-80'
}
 
const dotDelays: Array<Record<string, string>> = [
  { animationDelay: '0s' },
  { animationDelay: '0.2s' },
  { animationDelay: '0.4s' }
]
 
const sizeClass = computed(() => sizeClassMap[props.size])
const iconClass = computed(() => iconClassMap[props.size])
const dotClass = computed(() => dotClassMap[props.size])
const progressClass = computed(() => progressClassMap[props.size])
const textClass = computed(() => ['text-muted font-medium animate-slide-up', textSizeMap[props.size]].join(' '))
 
const innerStackClass = computed(() => {
  const classes = ['flex flex-col items-center justify-center gap-4 text-center']
  if (props.className) {
    classes.push(props.className)
  }
  const incomingClass = attrs.class as string | undefined
  if (incomingClass) {
    classes.push(incomingClass)
  }
  return classes.join(' ')
})
 
const outerWrapperClass = computed(() => {
  if (!props.fullscreen) {
    return 'w-full'
  }
  return 'fixed inset-0 z-50 flex items-center justify-center bg-default/75 backdrop-blur-sm animate-fade-in'
})
 
const ringWrapperClass: ComputedRef<string> = computed(() => ['flex items-center justify-center', sizeClass.value].join(' '))
 
const variant = computed(() => props.variant)
const text = computed(() => props.text)
</script>
 
 