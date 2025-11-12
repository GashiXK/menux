<template>
  <div class="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white text-ink-900 dark:from-ink-950 dark:via-ink-900 dark:to-ink-900 dark:text-white">
    <div class="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[0.95fr_1fr]">
      <section class="relative hidden overflow-hidden rounded-br-[3rem] bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 px-12 pb-16 pt-14 text-white shadow-2xl lg:flex lg:flex-col">
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <div class="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
          <div class="absolute right-[-20%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div class="absolute bottom-[-25%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-300/30 blur-3xl" />
        </div>
        <div class="relative flex flex-1 flex-col justify-between">
          <header>
            <NuxtLink to="/" class="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold tracking-[0.2em] text-white/90 ring-1 ring-white/20 backdrop-blur">
              <UIcon name="i-heroicons-rocket-launch" class="h-5 w-5" />
              MenuPika Platform
            </NuxtLink>
            <h1 class="mt-12 text-4xl font-semibold leading-tight">Design menus that feel personal, perform globally.</h1>
            <p class="mt-4 max-w-lg text-base text-white/80">MenuPika empowers hospitality teams to launch menu experiences that reinforce brand trust, convert upsells, and deliver insights to every location.</p>
          </header>
          <dl class="mt-12 grid gap-6 sm:grid-cols-2">
            <div class="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <dt class="text-sm font-medium uppercase tracking-widest text-white/70">Average upsell uplift</dt>
              <dd class="mt-3 text-3xl font-semibold text-white">+27%</dd>
              <p class="mt-2 text-sm text-white/70">Teams who automate specials and merchandising see stronger add-on performance.</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <dt class="text-sm font-medium uppercase tracking-widest text-white/70">Global coverage</dt>
              <dd class="mt-3 text-3xl font-semibold text-white">52 countries</dd>
              <p class="mt-2 text-sm text-white/70">Compliant with multilingual, multi-currency, and accessibility standards worldwide.</p>
            </div>
          </dl>
        </div>
        <footer class="relative mt-12 space-y-4 text-sm text-white/80">
          <div class="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <UIcon name="i-heroicons-shield-check" class="h-5 w-5" />
            Enterprise-grade security and data residency controls with 24/7 monitoring.
          </div>
          <div class="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <UIcon name="i-heroicons-sparkles" class="h-5 w-5" />
            Guided onboarding and white-glove template rollout from MenuPika specialists.
          </div>
        </footer>
      </section>

      <section class="flex items-center justify-center px-6 py-12 lg:px-12">
        <div class="w-full max-w-md">
          <div class="mb-10 flex items-center gap-3 lg:hidden">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-600/20">
              <UIcon name="i-heroicons-rocket-launch" class="h-6 w-6 text-white" />
            </span>
            <div>
              <p class="text-lg font-semibold text-ink-900 dark:text-white">MenuPika</p>
              <p class="text-xs font-medium uppercase tracking-[0.32em] text-brand-600 dark:text-brand-300">Digital Menu Platform</p>
            </div>
          </div>

          <UCard :ui="{ body: { padding: 'p-8 md:p-10' }, rounded: 'rounded-3xl', shadow: 'shadow-xl shadow-brand-950/5 dark:shadow-black/40' }">
            <template #header>
              <div class="space-y-2 text-left">
                <h2 class="text-3xl font-semibold text-ink-900 dark:text-white">Welcome back</h2>
                <p class="text-sm text-ink-500 dark:text-ink-300">Sign in to orchestrate branded menu experiences across your locations.</p>
              </div>
            </template>

            <div class="space-y-6">
              <UAlert
                v-if="error"
                color="red"
                variant="soft"
                icon="i-heroicons-exclamation-circle"
                :title="error"
              />

              <UForm :schema="schema" :state="formState" class="space-y-6" @submit="handleLogin">
                <div class="flex flex-col gap-4">
              <UFormField label="Email" name="email">
                <template #description>
                  <p id="login-email-description" class="text-sm text-ink-500 dark:text-ink-400">
                    Enter the work email connected to your MenuPika account.
                  </p>
                </template>
                    <UInput
                      v-model="formState.email"
                      type="email"
                  placeholder="you@restaurant.com"
                      autocomplete="email"
                      size="lg"
                      inputmode="email"
                  spellcheck="false"
                  icon="i-heroicons-envelope"
                  aria-describedby="login-email-description"
                      required
                    />
                  </UFormField>

                  <UFormField label="Password" name="password">
                <template #description>
                  <p id="login-password-description" class="text-sm text-ink-500 dark:text-ink-400">
                    Use the secure password provided by your MenuPika administrator.
                  </p>
                </template>
                    <UInput
                      v-model="formState.password"
                      type="password"
                      placeholder="Enter your secure passphrase"
                      autocomplete="current-password"
                      size="lg"
                  icon="i-heroicons-lock-closed"
                  aria-describedby="login-password-description"
                      required
                    />
                    <template #hint>
                      <ULink to="/auth/reset-password" class="text-sm font-medium text-brand-600 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-900">
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
                Need access? Contact your MenuPika admin or reach our team at
                <ULink to="mailto:hello@MenuPika.io" class="font-medium text-brand-600 hover:text-brand-500">hello@MenuPika.io</ULink>
              </p>
            </div>
          </UCard>
        </div>
      </section>
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
