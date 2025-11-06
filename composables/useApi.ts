/**
 * Reusable composable for API calls with proper error handling and type safety
 */
import type { ApiError } from '~/types/common'

export interface ApiOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

export const useApi = () => {
  const client = useSupabaseClient()
  const toast = useToast()

  /**
   * Make an API call with automatic error handling and toast notifications
   */
  const apiCall = async <T>(
    endpoint: string,
    options: ApiOptions<T> = {}
  ): Promise<T> => {
    try {
      // Get session token for authenticated requests
      const { data: { session } } = await client.auth.getSession()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers
      }

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
      }

      const response = await $fetch<T>(endpoint, {
        method: options.method || 'GET',
        body: options.body,
        headers,
        params: options.params
      })

      return response
    } catch (error: unknown) {
      const apiError = error as ApiError
      
      // Handle 401 errors (unauthorized) - redirect to login
      if (apiError.statusCode === 401 || apiError.status === 401) {
        toast.add({
          title: 'Session Expired',
          description: 'Please login again',
          color: 'error',
          icon: 'i-heroicons-exclamation-circle'
        })
        navigateTo('/auth/login')
        throw apiError
      }

      // Handle other errors
      const errorMessage = 
        apiError.data?.statusMessage || 
        apiError.statusMessage || 
        apiError.message || 
        'An error occurred'

      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })

      throw apiError
    }
  }

  /**
   * Make an API call without toast notifications (for background operations)
   */
  const apiCallSilent = async <T>(
    endpoint: string,
    options: ApiOptions<T> = {}
  ): Promise<T> => {
    try {
      const { data: { session } } = await client.auth.getSession()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers
      }

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
      }

      return await $fetch<T>(endpoint, {
        method: options.method || 'GET',
        body: options.body,
        headers,
        params: options.params
      })
    } catch (error: unknown) {
      const apiError = error as ApiError
      throw apiError
    }
  }

  return {
    apiCall,
    apiCallSilent
  }
}

