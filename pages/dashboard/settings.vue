<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p class="text-ink-600 dark:text-ink-300 text-lg">
          Manage your profile information and security settings
        </p>
      </div>
      
      <div class="max-w-2xl space-y-6">
        <!-- Profile Information Card -->
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-8 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-brand-500" />
            </div>
            <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Profile Information</h2>
          </div>
          
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                Full Name
              </label>
              <input
                v-model="profileForm.full_name"
                type="text"
                placeholder="Your name"
                class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                Email
              </label>
              <input
                v-model="profileForm.email"
                type="email"
                placeholder="your@email.com"
                disabled
                class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-400 opacity-50 cursor-not-allowed"
              />
              <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">Email cannot be changed</p>
            </div>
            
            <div class="flex justify-end pt-4 border-t border-ink-100 dark:border-ink-800">
              <button
                type="submit"
                :disabled="savingProfile"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="savingProfile" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                Update Profile
              </button>
            </div>
          </form>
        </div>
        
        <!-- Change Password Card -->
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-8 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-brand-500" />
            </div>
            <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Change Password</h2>
          </div>
          
          <form @submit.prevent="handleUpdatePassword" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                New Password <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.password"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                required
                minlength="8"
                class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">Password must be at least 8 characters</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                required
                minlength="8"
                class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                :class="passwordForm.password && passwordForm.confirmPassword && passwordForm.password !== passwordForm.confirmPassword ? 'border-red-500 dark:border-red-500' : ''"
              />
              <p
                v-if="passwordForm.password && passwordForm.confirmPassword && passwordForm.password !== passwordForm.confirmPassword"
                class="text-xs text-red-500 dark:text-red-400 mt-2"
              >
                Passwords don't match
              </p>
            </div>
            
            <div class="flex justify-end pt-4 border-t border-ink-100 dark:border-ink-800">
              <button
                type="submit"
                :disabled="savingPassword || (passwordForm.password && passwordForm.confirmPassword && passwordForm.password !== passwordForm.confirmPassword) || !passwordForm.password || !passwordForm.confirmPassword"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="savingPassword" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['tenant-admin']
})

const user = useSupabaseUser()
const { client } = useSupabaseClientStrict()
const toast = useToast()

const profileForm = reactive({
  full_name: '',
  email: ''
})

const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

const savingProfile = ref(false)
const savingPassword = ref(false)

onMounted(async () => {
  if (!user.value) return
  
  try {
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()
    
    if (profileError) {
      console.error('Error loading profile:', profileError)
    }
  
    if (profile) {
      profileForm.full_name = profile.full_name || ''
    }
  
    profileForm.email = user.value.email || ''
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load profile',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
})

const handleUpdateProfile = async () => {
  savingProfile.value = true
  try {
    const { data: { session } } = await client.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No active session')
    }
    
    await $fetch('/api/admin/account', {
      method: 'PUT',
      body: {
        email: profileForm.email,
        full_name: profileForm.full_name
      },
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })
    
    toast.add({
      title: 'Success',
      description: 'Profile updated successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update profile',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    savingProfile.value = false
  }
}

const handleUpdatePassword = async () => {
  if (passwordForm.password !== passwordForm.confirmPassword) {
    toast.add({
      title: 'Validation Error',
      description: "Passwords don't match",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  if (passwordForm.password.length < 8) {
    toast.add({
      title: 'Validation Error',
      description: 'Password must be at least 8 characters',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  savingPassword.value = true
  try {
    const { data: { session } } = await client.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No active session')
    }
    
    await $fetch('/api/admin/account', {
      method: 'PUT',
      body: {
        password: passwordForm.password
      },
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })
    
    toast.add({
      title: 'Success',
      description: 'Password updated successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
    
    passwordForm.password = ''
    passwordForm.confirmPassword = ''
  } catch (e: unknown) {
    const err = e as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update password',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    savingPassword.value = false
  }
}
</script>
