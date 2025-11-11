<template>
  <Transition name="ad-banner-fade">
    <div
      v-if="ad"
      class="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-700 via-brand-600 to-secondary/50 text-white shadow-lg shadow-brand-500/20"
      role="region"
      aria-live="polite"
    >
      <div class="absolute inset-0 opacity-25">
        <div class="absolute -left-10 top-0 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
        <div class="absolute right-[-10%] bottom-[-30%] h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
      </div>
      <div class="relative grid gap-6 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <UIcon name="i-heroicons-megaphone" class="h-4 w-4" />
            </span>
            <span>{{ badgeLabel }}</span>
            <span v-if="ad.end_time" class="rounded-full border border-white/20 px-2 py-0.5 text-[10px] tracking-widest text-white/80">
              Ends {{ formattedEndTime }}
            </span>
          </div>
          <div class="space-y-1.5">
            <h3 class="text-xl font-semibold leading-snug sm:text-2xl">{{ ad.title }}</h3>
            <p v-if="ad.body" class="text-sm text-white/80">
              {{ ad.body }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs text-white/80">
            <div v-if="countdown" class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              <UIcon name="i-heroicons-clock" class="h-4 w-4" />
              <span>Expires in {{ countdown }}</span>
            </div>
            <button
              v-if="ad.link_url"
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-600 shadow-md transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              @click="openAdLink"
            >
              Explore offer
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div v-if="ad.media_url" class="relative self-stretch">
          <div class="absolute inset-0 rounded-2xl bg-white/15 blur-xl" />
          <img
            :src="ad.media_url"
            alt="Promoted visual"
            class="relative h-28 w-28 rounded-2xl object-cover shadow-lg sm:h-28 sm:w-28"
          />
        </div>
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          @click="dismissAd"
        >
          <span class="sr-only">Dismiss promotion</span>
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
        </button>
      </div>
      <div class="absolute inset-x-0 bottom-0 h-1.5 bg-white/20">
        <div
          v-if="progress !== null"
          class="h-full bg-white/80 transition-[width]"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { AdWithTargets, AdScope } from '~/types/database'

interface Props {
  tenantId?: string
  cityId?: number
  scope?: AdScope
  pagePath?: string
}

const props = defineProps<Props>()

const ad = ref<AdWithTargets | null>(null)
const countdown = ref<string | null>(null)
const progress = ref<number | null>(null)

const DISMISS_STORAGE_KEY = 'menux.dismissedAds'
const DISMISS_DURATION_MS = 1000 * 60 * 60 * 12 // 12 hours
let refreshIntervalId: number | null = null
let expiryTimeoutId: number | null = null
let countdownIntervalId: number | null = null

const loadDismissedAds = () => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(DISMISS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, number>
    const now = Date.now()
    return Object.fromEntries(
      Object.entries(parsed).filter(([, expiry]) => expiry > now)
    )
  } catch {
    return {}
  }
}

const storeDismissedAd = (adId: string) => {
  if (typeof window === 'undefined') return
  const dismissed = loadDismissedAds()
  dismissed[adId] = Date.now() + DISMISS_DURATION_MS
  window.localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(dismissed))
}

const isAdDismissed = (adId: string) => {
  const dismissed = loadDismissedAds()
  return Boolean(dismissed[adId] && dismissed[adId] > Date.now())
}

const fetchAd = async () => {
  const result = await $fetch<AdWithTargets | null>('/api/ads/active', {
    query: {
      tenant_id: props.tenantId,
      city_id: props.cityId,
      scope: props.scope || 'all_pages',
      page_path: props.pagePath
    }
  })

  if (result && !isAdDismissed(result.id)) {
    ad.value = result
    scheduleExpiryChecks()
  } else {
    clearAdState()
  }
}

const clearTimers = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
  }
  if (expiryTimeoutId) {
    clearTimeout(expiryTimeoutId)
    expiryTimeoutId = null
  }
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId)
    countdownIntervalId = null
  }
}

const clearAdState = () => {
  clearTimers()
  ad.value = null
  countdown.value = null
  progress.value = null
}

const scheduleExpiryChecks = () => {
  clearTimers()
  if (!ad.value) return

  if (ad.value.end_time) {
    updateCountdown()
    countdownIntervalId = window.setInterval(updateCountdown, 1000)
    const endTime = new Date(ad.value.end_time).getTime()
    const diff = endTime - Date.now()
    if (diff <= 0) {
      handleAdExpired()
    } else {
      expiryTimeoutId = window.setTimeout(handleAdExpired, diff)
      updateProgress()
    }
  } else {
    countdown.value = null
    progress.value = null
  }

  refreshIntervalId = window.setInterval(fetchAd, 1000 * 60 * 5) // refresh every 5 minutes
}

const updateCountdown = () => {
  if (!ad.value?.end_time) {
    countdown.value = null
    return
  }
  const endDate = new Date(ad.value.end_time)
  if (endDate.getTime() <= Date.now()) {
    countdown.value = null
    handleAdExpired()
    return
  }
  countdown.value = formatDuration(endDate.getTime() - Date.now())
  updateProgress()
}

const updateProgress = () => {
  if (!ad.value?.start_time || !ad.value.end_time) {
    progress.value = null
    return
  }
  const start = new Date(ad.value.start_time).getTime()
  const end = new Date(ad.value.end_time).getTime()
  const now = Date.now()
  if (end <= start || now <= start) {
    progress.value = 0
    return
  }
  const elapsed = Math.min(Math.max(now - start, 0), end - start)
  progress.value = Number(((elapsed / (end - start)) * 100).toFixed(2))
}

const handleAdExpired = () => {
  clearTimers()
  ad.value = null
  countdown.value = null
  progress.value = null
  fetchAd()
}

const dismissAd = () => {
  if (!ad.value) return
  storeDismissedAd(ad.value.id)
  clearAdState()
  fetchAd()
}

const openAdLink = () => {
  if (!ad.value?.link_url) return
  window.open(ad.value.link_url, '_blank', 'noopener')
}

const badgeLabel = computed(() => {
  if (!ad.value) return 'Promotion'
  if (ad.value.start_time && ad.value.end_time) {
    return 'Limited window offer'
  }
  return 'Featured promotion'
})

const formattedEndTime = computed(() => {
  if (!ad.value?.end_time) return null
  const diff = new Date(ad.value.end_time).getTime() - Date.now()
  if (diff <= 0) return 'expired'
  return `in ${formatDuration(diff)}`
})

onMounted(() => {
  fetchAd()
})

onBeforeUnmount(() => {
  clearTimers()
})

watch(
  () => [props.tenantId, props.cityId, props.scope, props.pagePath],
  () => {
    fetchAd()
  }
)

const startTime = computed(() => ad.value?.start_time ?? null)

watch(startTime, () => {
  scheduleExpiryChecks()
})

const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0)
  const units = [
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]

  const parts: string[] = []
  let remainder = totalSeconds

  for (const unit of units) {
    if (remainder >= unit.seconds) {
      const value = Math.floor(remainder / unit.seconds)
      remainder -= value * unit.seconds
      parts.push(`${value} ${unit.label}${value > 1 ? 's' : ''}`)
      if (parts.length === 2) break
    }
  }

  return parts.length > 0 ? parts.join(' ') : 'few seconds'
}
</script>

<style scoped>
.ad-banner-fade-enter-active,
.ad-banner-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.ad-banner-fade-enter-from,
.ad-banner-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

