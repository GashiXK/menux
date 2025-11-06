<template>
  <div class="space-y-4">
    <div
      class="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center hover:border-brand-500 transition cursor-pointer"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-brand-500 bg-brand-50 dark:bg-brand-950': isDragging }"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileChange"
      />
      
      <Icon name="heroicons:cloud-arrow-up" class="mx-auto h-12 w-12 text-neutral-400" />
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {{ label || 'Click to upload or drag and drop' }}
      </p>
      <p v-if="hint" class="mt-1 text-xs text-neutral-500">
        {{ hint }}
      </p>
    </div>
    
    <div v-if="preview" class="relative">
      <img :src="preview" alt="Preview" class="max-w-full h-48 object-contain rounded-lg mx-auto" />
      <AppButton
        icon="heroicons:x-mark"
        variant="ghost"
        size="sm"
        class="absolute top-2 right-2"
        @click="clearFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: File | null
  accept?: string
  label?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*'
})

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const preview = ref<string | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  emit('update:modelValue', file)
  
  // Create preview if image
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const clearFile = () => {
  emit('update:modelValue', null)
  preview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

