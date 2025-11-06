<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-4">
    <UCard class="w-full max-w-md">
      <UForm :schema="schema" :state="formState" @submit="handleLogin">
        <div class="space-y-6">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-highlighted mb-2">Welcome back</h1>
            <p class="text-muted">Sign in to your MenuX account</p>
      </div>

          <UFormField label="Email" name="email">
            <UInput
              v-model="formState.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="formState.password"
            type="password"
              placeholder="Enter your password"
            autocomplete="current-password"
            required
          />
            <template #hint>
              <ULink to="/auth/reset-password" class="text-sm text-primary hover:text-primary/80">
                Forgot password?
              </ULink>
            </template>
          </UFormField>
          
          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-circle"
            :title="error"
          />

          <UButton
            type="submit"
          label="Sign In"
          :loading="loading"
            :disabled="loading"
          class="w-full"
            size="lg"
          />
      </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  layout: false
})

const router = useRouter()
const client = useSupabaseClient()
const toast = useToast()

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

const formState = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data, error: authError } = await client.auth.signInWithPassword({
      email: formState.email,
      password: formState.password
    })

    if (authError || !data?.user) {
      error.value = authError?.message || 'Invalid email or password'
      loading.value = false
      return
    }

    const user = data.user

    // Set session explicitly
    if (data.session) {
      await client.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      })
    }

    // Wait for user reactive ref to update
    const userRef = useSupabaseUser()
    let attempts = 0
    const maxAttempts = 20

    while (!userRef.value && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    // Get user role
    let appRole: string | null = null
    try {
      const profile = await $fetch(`/api/auth/profile-by-id?userId=${user.id}`)
      if (profile && 'app_role' in profile) {
        appRole = (profile as { app_role: string }).app_role
      }
    } catch {
      // Profile fetch failed, continue with default redirect
    }

    // Determine redirect path based on role
    const redirectPath = appRole === 'super_admin' ? '/super' : '/dashboard'

    loading.value = false

    // Small delay to ensure session is persisted
    await new Promise(resolve => setTimeout(resolve, 200))

    // Navigate
    try {
      await router.push(redirectPath)
      toast.add({
        title: 'Welcome back!',
        description: 'You have been successfully signed in.',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    } catch (navErr: unknown) {
      console.error('Navigation error:', navErr)
      if (typeof window !== 'undefined') {
        window.location.href = redirectPath
      }
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    console.error('Login error:', e)
    error.value = err.message || 'An unexpected error occurred. Please try again.'
    loading.value = false
  }
}
</script>
