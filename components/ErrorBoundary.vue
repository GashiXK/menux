<template>
  <div v-if="error" class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-error" />
          <h2 class="text-xl font-bold text-highlighted">Something went wrong</h2>
        </div>
      </template>
      
      <div class="space-y-4">
        <p class="text-muted">
          {{ error.message || 'An unexpected error occurred. Please try again.' }}
        </p>
        
        <details v-if="error.stack" class="text-xs">
          <summary class="cursor-pointer text-muted hover:text-highlighted mb-2">
            Technical details
          </summary>
          <pre class="bg-elevated p-3 rounded overflow-auto text-xs">{{ error.stack }}</pre>
        </details>
        
        <div class="flex gap-2 pt-4">
          <UButton
            label="Try Again"
            @click="handleRetry"
          />
          <UButton
            label="Go Home"
            variant="outline"
            to="/"
          />
        </div>
      </div>
    </UCard>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
const error = ref<Error | null>(null)

const handleError = (err: Error) => {
  error.value = err
  console.error('ErrorBoundary caught error:', err)
}

const handleRetry = () => {
  error.value = null
  window.location.reload()
}

onErrorCaptured((err: Error) => {
  handleError(err)
  return false // Prevent the error from propagating
})
</script>

