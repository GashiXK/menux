<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-default to-secondary/10 flex items-center justify-center px-4">
    <div class="text-center max-w-3xl">
      <h1 class="text-6xl font-bold text-primary mb-4">MenuX</h1>
      <p class="text-2xl text-highlighted mb-6">
        Modern Digital Menu Platform
      </p>
      <p class="text-lg text-muted mb-12 max-w-xl mx-auto">
        Beautiful, responsive menus for restaurants and cafés. Create stunning digital menus that your customers will love.
      </p>
      
      <div class="flex justify-center gap-4 flex-wrap">
        <UButton
          to="/auth/login"
          size="lg"
          label="Sign In"
          icon="i-heroicons-arrow-right-on-rectangle"
        />
        <UButton
          to="/demo"
          size="lg"
          variant="outline"
          label="View Demo"
          icon="i-heroicons-eye"
        />
      </div>
      
      <div class="mt-16 grid md:grid-cols-3 gap-6 text-left">
        <UCard variant="soft" class="hover:bg-elevated/75 transition">
          <div class="flex items-start gap-4">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 class="font-semibold text-highlighted mb-2">Beautiful Templates</h3>
              <p class="text-sm text-muted">Choose from multiple stunning menu templates</p>
            </div>
          </div>
        </UCard>
        
        <UCard variant="soft" class="hover:bg-elevated/75 transition">
          <div class="flex items-start gap-4">
            <UIcon name="i-heroicons-device-phone-mobile" class="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 class="font-semibold text-highlighted mb-2">Mobile First</h3>
              <p class="text-sm text-muted">Fully responsive design for all devices</p>
            </div>
          </div>
        </UCard>
        
        <UCard variant="soft" class="hover:bg-elevated/75 transition">
          <div class="flex items-start gap-4">
            <UIcon name="i-heroicons-qr-code" class="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 class="font-semibold text-highlighted mb-2">QR Codes</h3>
              <p class="text-sm text-muted">Generate QR codes for instant access</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false // Client-only to avoid hydration issues
})
</script>
