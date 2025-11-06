<template>
  <UInput
    :model-value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :autocomplete="autocomplete"
    :size="size"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

