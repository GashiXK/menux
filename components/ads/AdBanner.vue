<template>
  <Transition name="ad-banner-fade">
    <aside
      v-if="ad"
      class="relative overflow-hidden rounded-2xl border border-brand-500/25 bg-gradient-to-r from-brand-950 via-brand-800 to-brand-600 text-white shadow-lg shadow-brand-900/30"
      role="region"
      aria-live="polite"
    >
      <div class="absolute inset-y-0 right-[-60px] hidden h-[180px] w-[180px] rounded-full bg-white/15 blur-3xl md:block" aria-hidden="true" />
      <button
        type="button"
        class="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        @click="dismissAd"
      >
        <span class="sr-only">Dismiss promotion</span>
        <UIcon name="i-heroicons-x-mark" class="h-4.5 w-4.5" />
      </button>

      <div class="relative flex items-center gap-4 px-4 py-4 md:px-6 md:py-5">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner shadow-brand-600/40">
          <UIcon name="i-heroicons-megaphone" class="h-6 w-6" />
        </div>

        <div class="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              <span>{{ badgeLabel }}</span>
              <span
                v-if="ad.end_time"
                class="inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-0.5 text-[10px] tracking-[0.25em] text-white/80"
              >
                <UIcon name="i-heroicons-clock" class="h-3.5 w-3.5" />
                {{ formattedEndTime }}
              </span>
            </div>
            <div class="space-y-1 md:max-w-xl">
              <h3 class="text-base font-semibold leading-snug md:text-lg">{{ ad.title }}</h3>
              <p v-if="ad.body" class="text-sm text-white/80">
                {{ ad.body }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-[11px] text-white/75">
              <span
                v-if="countdown"
                class="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1"
              >
                <UIcon name="i-heroicons-bolt" class="h-4 w-4" />
                Ends in {{ countdown }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                <UIcon name="i-heroicons-fire" class="h-4 w-4" />
                Spotlight this week
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-3">
            <button
              v-if="ad.link_url"
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-brand-700 shadow-lg shadow-white/30 transition hover:shadow-brand-200/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              @click="openAdLink"
            >
              Discover
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
            </button>
            <div v-if="progress !== null" class="flex w-32 items-center gap-2 text-[11px] text-white/70">
              <div class="h-1.5 flex-1 rounded-full bg-white/20">
                <div class="h-full rounded-full bg-white/80 transition-[width]" :style="{ width: `${progress}%` }" />
              </div>
              <span>{{ Math.max(0, Math.min(100, Math.round(progress))) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
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
const dismissedAds = ref<Map<string, number>>(new Map())

const DISMISS_STORAGE_KEY = 'menux.dismissedAds'
const DEFAULT_DISMISS_MS = 1000 * 60 * 60 * 12
let refreshIntervalId: number | null = null
let expiryTimeoutId: number | null = null
let countdownIntervalId: number | null = null

const loadDismissedAds = () => {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(DISMISS_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Record<string, number>
    dismissedAds.value = new Map(
      Object.entries(parsed).filter(([, expiry]) => expiry > Date.now())
    )
  } catch {
    dismissedAds.value = new Map()
  }
}

const persistDismissedAds = () => {
  if (typeof window === 'undefined') return
  const serialized = Object.fromEntries(dismissedAds.value.entries())
  window.localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(serialized))
}

const fetchAd = async () => {
  if (refreshIntervalId === null && typeof window !== 'undefined') {
    refreshIntervalId = window.setInterval(fetchAd, 1000 * 60 * 5)
  }

  const result = await $fetch<AdWithTargets | null>('/api/ads/active', {
    query: {
      tenant_id: props.tenantId,
      city_id: props.cityId,
      scope: props.scope || 'all_pages',
      page_path: props.pagePath
    }
  })

  if (!result) {
    clearAdState(false)
    return
  }

  const dismissalExpiry = dismissedAds.value.get(result.id)
  if (dismissalExpiry && dismissalExpiry > Date.now()) {
    clearAdState(false)
    return
  }

  if (dismissalExpiry && dismissalExpiry <= Date.now()) {
    dismissedAds.value.delete(result.id)
    persistDismissedAds()
  }

  const hasChanged = ad.value?.id !== result.id
  ad.value = result
  scheduleExpiryChecks(hasChanged)
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

const clearAdState = (resetIntervals = true) => {
  if (resetIntervals) {
    clearTimers()
  } else {
    if (expiryTimeoutId) {
      clearTimeout(expiryTimeoutId)
      expiryTimeoutId = null
    }
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId)
      countdownIntervalId = null
    }
  }
  ad.value = null
  countdown.value = null
  progress.value = null
}

const scheduleExpiryChecks = (resetRefresh = false) => {
  if (resetRefresh) {
    clearTimers()
  } else {
    if (expiryTimeoutId) {
      clearTimeout(expiryTimeoutId)
      expiryTimeoutId = null
    }
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId)
      countdownIntervalId = null
    }
  }

  if (!ad.value) {
    return
  }

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

  if (resetRefresh || refreshIntervalId === null) {
    refreshIntervalId = window.setInterval(fetchAd, 1000 * 60 * 5)
  }
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
  fetchAd().catch(() => {})
}

const dismissAd = () => {
  if (!ad.value) return
  const expiry = ad.value.end_time ? new Date(ad.value.end_time).getTime() : Date.now() + DEFAULT_DISMISS_MS
  dismissedAds.value.set(ad.value.id, expiry)
  persistDismissedAds()
  clearAdState()
  fetchAd().catch(() => {})
}

const openAdLink = () => {
  if (!ad.value?.link_url) return
  window.open(ad.value.link_url, '_blank', 'noopener')
}

const badgeLabel = computed(() => {
  if (!ad.value) return 'Promotion'
  if (ad.value.start_time && ad.value.end_time) {
    return 'Limited-time offer'
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
  loadDismissedAds()
  fetchAd().catch(() => {})
})

onBeforeUnmount(() => {
  clearTimers()
})

watch(
  () => [props.tenantId, props.cityId, props.scope, props.pagePath],
  () => {
    fetchAd().catch(() => {})
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

