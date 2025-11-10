<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-950 via-ink-950 to-slate-900 text-white">
    <div class="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.1fr_0.9fr]">
      <div class="relative hidden bg-gradient-to-br from-brand-600 via-brand-500 to-secondary lg:flex lg:flex-col lg:justify-between lg:p-16">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div class="absolute bottom-[-20%] right-0 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        </div>
        <div class="relative">
          <NuxtLink to="/" class="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white/90 ring-1 ring-white/20 backdrop-blur">
            <UIcon name="i-heroicons-rocket-launch" class="h-5 w-5" />
            MenuX Platform
          </NuxtLink>
          <h1 class="mt-10 text-4xl font-bold leading-tight">Beautiful menus, intelligent upsells, delighted guests.</h1>
          <p class="mt-6 max-w-lg text-sm text-white/80">Join hospitality teams that build brand-consistent digital experiences with MenuX. Manage templates, publish changes in seconds, and unlock data-driven storytelling.</p>
        </div>
        <div class="relative space-y-6">
          <div class="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white/80">
            <UIcon name="i-heroicons-shield-check" class="h-5 w-5" />
            SOC2-ready infrastructure, security-first by design
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              <p class="text-2xl font-semibold text-white">45%</p>
              <p class="mt-2">Increase in premium dish conversion after rolling out MenuX across locations.</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              <p class="text-2xl font-semibold text-white">24/7</p>
              <p class="mt-2">Support from product specialists ready to assist culinary teams globally.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center bg-white px-6 py-12 dark:bg-ink-950">
        <div class="w-full max-w-md space-y-10">
          <div class="flex items-center gap-3 lg:hidden">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
              <UIcon name="i-heroicons-rocket-launch" class="h-6 w-6 text-white" />
            </span>
            <div>
              <p class="text-lg font-semibold text-ink-900 dark:text-white">MenuX</p>
              <p class="text-xs font-medium uppercase tracking-widest text-brand-600 dark:text-brand-300">Digital Menu Platform</p>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-ink-900 dark:text-white">Welcome back</h2>
            <p class="mt-2 text-sm text-ink-500 dark:text-ink-400">Sign in to craft your next unforgettable guest experience.</p>
          </div>

          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-circle"
            :title="error"
          />

          <UForm :schema="schema" :state="formState" class="space-y-6" @submit="handleLogin">
            <div class="space-y-4">
              <UFormField label="Email" name="email">
                <UInput
                  v-model="formState.email"
                  type="email"
                  placeholder="name@restaurant.com"
                  autocomplete="email"
                  size="lg"
                  required
                />
              </UFormField>

              <UFormField label="Password" name="password">
                <UInput
                  v-model="formState.password"
                  type="password"
                  placeholder="Your secure passphrase"
                  autocomplete="current-password"
                  size="lg"
                  required
                />
                <template #hint>
                  <ULink to="/auth/reset-password" class="text-sm font-medium text-brand-600 hover:text-brand-500">
                    Forgot your password?
                  </ULink>
                </template>
              </UFormField>
            </div>

            <div class="space-y-3">
              <UButton
                type="submit"
                label="Sign in"
                :loading="loading"
                :disabled="loading"
                size="lg"
                class="w-full"
              />
              <UButton
                to="/demo"
                variant="outline"
                label="Preview a live menu"
                size="lg"
                class="w-full"
              />
            </div>
          </UForm>

          <p class="text-xs text-ink-400 dark:text-ink-500">
            Need access? Contact your MenuX admin or reach our team at
            <ULink to="mailto:hello@menux.io" class="font-medium text-brand-600 hover:text-brand-500">hello@menux.io</ULink>
          </p>
        </div>
      </div>
    </div>
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
