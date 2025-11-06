<template>
  <UModal v-model="isOpen">
    <div class="p-6">
      <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
      
      <div class="mb-6">
        <slot />
      </div>
      
      <div class="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <AppButton
          label="Cancel"
          variant="ghost"
          @click="handleCancel"
        />
        <AppButton
          :label="submitLabel"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  submitLabel?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'Save'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
  cancel: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleSubmit = () => {
  emit('submit')
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

