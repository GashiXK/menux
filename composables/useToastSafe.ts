/**
 * Safe toast composable with error handling
 * Prevents crashes if toast is not available
 */
export const useToastSafe = () => {
  try {
    return useToast()
  } catch {
    // Fallback if toast is not available
    return {
      add: (notification: {
        title: string
        description?: string
        color?: string
        icon?: string
      }) => {
        console.log('[Toast]', notification.title, notification.description)
        // Fallback to alert in development
        if (process.dev) {
          alert(`${notification.title}: ${notification.description || ''}`)
        }
      }
    }
  }
}

