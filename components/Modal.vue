<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleClose"></div>
        
        <!-- Modal Content -->
        <div
          class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10"
          :class="contentClass"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
            <div class="flex-1">
              <h2 v-if="title" class="text-2xl font-bold text-ink-900 dark:text-white">
                {{ title }}
              </h2>
              <slot name="header" />
            </div>
            <button
              v-if="closable"
              @click="handleClose"
              class="ml-4 p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
            </button>
          </div>
          
          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="border-t border-ink-100 dark:border-ink-800 p-6">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  closable?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  contentClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

