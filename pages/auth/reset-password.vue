<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-4">
    <UCard class="w-full max-w-md">
      <UForm :schema="schema" :state="formState" @submit="handleReset" v-if="!success">
        <div class="space-y-6">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-highlighted mb-2">Reset Password</h1>
            <p class="text-muted">Enter your email to receive a reset link</p>
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
        
          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-circle"
            :title="error"
          />
        
          <UButton
            type="submit"
          label="Send Reset Link"
          :loading="loading"
            :disabled="loading"
          class="w-full"
            size="lg"
        />
        </div>
      </UForm>
      
      <div v-else class="text-center py-8">
        <UIcon name="i-heroicons-check-circle" class="w-16 h-16 text-success mx-auto mb-4" />
        <p class="text-highlighted font-medium mb-2">Check your email</p>
        <p class="text-muted text-sm">
          We've sent a password reset link to {{ email }}
        </p>
      </div>
      
      <div class="mt-6 text-center text-sm">
        <ULink to="/auth/login" class="text-primary font-medium hover:text-primary/80 transition">
          Back to login
        </ULink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  layout: false
})

const client = useSupabaseClient()
const toast = useToast()

const schema = z.object({
  email: z.string().email('Invalid email address')
})

const formState = reactive({
  email: ''
})

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleReset = async () => {
  loading.value = true
  error.value = ''
  email.value = formState.email
  
  try {
    const { error: resetError } = await client.auth.resetPasswordForEmail(formState.email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`
    })

    if (resetError) {
      throw resetError
    }

    success.value = true
    toast.add({
      title: 'Reset link sent',
      description: 'Check your email for the password reset link',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message || 'Failed to send reset email'
    toast.add({
      title: 'Error',
      description: error.value,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    loading.value = false
  }
}
</script>
