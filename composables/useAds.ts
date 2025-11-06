import type { Ad, AdTarget, AdWithTargets, AdScope } from '~/types/database'

interface AdContext {
  tenant_id?: string
  city_id?: number
  scope?: AdScope
  page_path?: string
}

export const useAds = () => {
  const { client } = useSupabaseClientStrict()
  
  const getActiveAd = async (context: AdContext): Promise<AdWithTargets | null> => {
    const now = new Date().toISOString()
    
    // Build query for active ads with time constraints
    let query = client
      .from('ads')
      .select('*, targets:ad_targets(*)')
      .eq('active', true)
      
    // First try: ads within time window
    const { data: timedAds } = await query
      .lte('start_time', now)
      .gte('end_time', now)
      
    // Filter by targets
    const matchedTimedAds = filterAdsByTargets(timedAds || [], context)
    if (matchedTimedAds.length > 0) {
      return matchedTimedAds[0]
    }
    
    // Second try: immediate ads (no time constraints or null times)
    const { data: immediateAds } = await client
      .from('ads')
      .select('*, targets:ad_targets(*)')
      .eq('active', true)
      .or('start_time.is.null,end_time.is.null')
      
    const matchedImmediateAds = filterAdsByTargets(immediateAds || [], context)
    return matchedImmediateAds.length > 0 ? matchedImmediateAds[0] : null
  }
  
  const filterAdsByTargets = (ads: AdWithTargets[], context: AdContext): AdWithTargets[] => {
    return ads
      .filter(ad => {
        if (!ad.targets || ad.targets.length === 0) return true // No targeting = show everywhere
        
        return ad.targets.some(target => {
          // Check tenant match
          if (target.tenant_id && context.tenant_id && target.tenant_id !== context.tenant_id) {
            return false
          }
          
          // Check city match
          if (target.city_id && context.city_id && target.city_id !== context.city_id) {
            return false
          }
          
          // Check scope match
          if (context.scope && target.scope !== 'all_pages' && target.scope !== context.scope) {
            return false
          }
          
          return true
        })
      })
      .sort((a, b) => {
        // Sort by priority desc, then created_at desc
        if (a.priority !== b.priority) {
          return b.priority - a.priority
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }
  
  return {
    getActiveAd
  }
}

