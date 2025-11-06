<template>
  <UButton
    :label="label"
    :icon="icon"
    :variant="variant ?? 'solid'"
    :loading="loading"
    :disabled="disabled"
    :type="type ?? 'button'"
    :size="size"
    :color="color"
    class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
    @click="(ev: MouseEvent) => emit('click', ev)"
  />
</template>

<script setup lang="ts">
interface Props {
  label?: string
  icon?: string
  variant?: 'solid' | 'ghost' | 'soft' | 'outline'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

defineProps<Props>()
const emit = defineEmits<{ click: [ev: MouseEvent] }>()
</script>

