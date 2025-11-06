/**
 * Reusable composable for async operations with loading, error, and success states
 */
export const useAsyncOperation = <T = unknown>() => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T | null>(null)
  const toast = useToast()

  const execute = async (
    operation: () => Promise<T>,
    options: {
      showLoading?: boolean
      showError?: boolean
      showSuccess?: boolean
      successMessage?: string
      errorMessage?: string
    } = {}
  ) => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage,
      errorMessage
    } = options

    loading.value = showLoading
    error.value = null
    data.value = null

    try {
      const result = await operation()
      data.value = result

      if (showSuccess && successMessage) {
        toast.add({
          title: 'Success',
          description: successMessage,
          color: 'success',
          icon: 'i-heroicons-check-circle'
        })
      }

      return result
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      const message = errorMessage || errorObj.message || 'An error occurred'
      error.value = message

      if (showError) {
        toast.add({
          title: 'Error',
          description: message,
          color: 'error',
          icon: 'i-heroicons-exclamation-circle'
        })
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    execute,
    reset
  }
}

