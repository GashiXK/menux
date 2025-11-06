import { createClient } from '@supabase/supabase-js'
import type { AdScope } from '~/types/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Use public Supabase client (no auth required for viewing ads)
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
    config.public.supabaseAnonKey || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  
  const tenant_id = query.tenant_id as string | undefined
  const city_id = query.city_id ? Number(query.city_id) : undefined
  const scope = (query.scope as AdScope) || 'all_pages'
  const page_path = query.page_path as string | undefined
  
  const now = new Date().toISOString()
  
  // First try: ads within time window
  const { data: timedAds } = await supabase
    .from('ads')
    .select('*, targets:ad_targets(*)')
    .eq('active', true)
    .lte('start_time', now)
    .gte('end_time', now)
  
  // Filter by targets
  const matchedTimedAds = filterAdsByTargets(timedAds || [], {
    tenant_id,
    city_id,
    scope,
    page_path
  })
  
  if (matchedTimedAds.length > 0) {
    return matchedTimedAds[0]
  }
  
  // Second try: immediate ads (no time constraints)
  const { data: immediateAds } = await supabase
    .from('ads')
    .select('*, targets:ad_targets(*)')
    .eq('active', true)
    .or('start_time.is.null,end_time.is.null')
  
  const matchedImmediateAds = filterAdsByTargets(immediateAds || [], {
    tenant_id,
    city_id,
    scope,
    page_path
  })
  
  return matchedImmediateAds.length > 0 ? matchedImmediateAds[0] : null
})

function filterAdsByTargets(ads: any[], context: any) {
  return ads
    .filter(ad => {
      if (!ad.targets || ad.targets.length === 0) return true
      
      return ad.targets.some((target: any) => {
        if (target.tenant_id && context.tenant_id && target.tenant_id !== context.tenant_id) {
          return false
        }
        if (target.city_id && context.city_id && target.city_id !== context.city_id) {
          return false
        }
        if (context.scope && target.scope !== 'all_pages' && target.scope !== context.scope) {
          return false
        }
        return true
      })
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
}

