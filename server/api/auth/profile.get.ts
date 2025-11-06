import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Use serverSupabaseClient which should handle cookies automatically
  const supabaseClient = await serverSupabaseClient(event)
  
  console.log('=== PROFILE API DEBUG ===')
  
  // Get user from serverSupabaseClient
  let user = null
  try {
    const { data: { user: clientUser }, error: userError } = await supabaseClient.auth.getUser()
    if (userError) {
      console.warn('serverSupabaseClient.getUser() error:', userError.message)
    } else if (clientUser) {
      user = clientUser
      console.log('Got user from serverSupabaseClient:', user.id)
    }
  } catch (e: any) {
    console.warn('serverSupabaseClient.getUser() exception:', e.message)
  }
  
  // If serverSupabaseClient doesn't work, try alternative methods
  if (!user) {
    const cookies = parseCookies(event)
    const allHeaders = getHeaders(event)
    const authHeader = getRequestHeader(event, 'authorization') || allHeaders.authorization || allHeaders.Authorization
    
    console.log('Auth header present?', !!authHeader)
    console.log('Cookies count:', Object.keys(cookies).length)
    console.log('Cookie names:', Object.keys(cookies).filter(k => k.includes('auth') || k.includes('supabase')).join(', ') || 'none')
    
    let token: string | null = null
    
    if (authHeader) {
      token = authHeader.replace(/^Bearer\s+/i, '').trim()
      console.log('Got token from Authorization header')
    } else {
      // Try to get from cookies - @nuxtjs/supabase uses specific cookie format
      const supabaseUrl = config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || ''
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'sswvvikmpsawhreuzczg'
      
      // @nuxtjs/supabase cookie format: sb-{projectRef}-auth-token
      // Also try alternative formats
      const possibleCookieNames = [
        `sb-${projectRef}-auth-token`,
        `sb-${projectRef}-auth-token.0`,
        `sb-${projectRef}-auth-token.1`,
        'sb-access-token',
        'sb-refresh-token',
        'supabase-auth-token'
      ]
      
      for (const cookieName of possibleCookieNames) {
        const cookieValue = cookies[cookieName]
        if (cookieValue) {
          console.log(`Found cookie: ${cookieName}`)
          try {
            const parsed = typeof cookieValue === 'string' && cookieValue.startsWith('{') 
              ? JSON.parse(cookieValue) 
              : cookieValue
            token = parsed?.access_token || parsed?.session?.access_token || parsed || cookieValue
            if (token) {
              console.log('Got token from cookie:', cookieName)
              break
            }
          } catch (e) {
            // If not JSON, use as-is
            token = cookieValue
            if (token) {
              console.log('Got token from cookie (raw):', cookieName)
              break
            }
          }
        }
      }
      
      // Also check if there's a session cookie that contains the full session
      if (!token) {
        for (const [key, value] of Object.entries(cookies)) {
          if (key.includes('auth') || key.includes('session')) {
            try {
              const parsed = JSON.parse(value)
              token = parsed?.access_token || parsed?.session?.access_token
              if (token) {
                console.log('Got token from session cookie:', key)
                break
              }
            } catch (e) {
              // Not JSON, skip
            }
          }
        }
      }
    }
    
    if (token) {
      const supabase = createClient(
        config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
        config.public.supabaseAnonKey || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser(token)
      
      if (userError) {
        console.error('Error verifying token:', userError.message)
      } else if (userData) {
        user = userData
        console.log('Got user from token verification:', user.id)
      }
    } else {
      console.warn('No token found in headers or cookies')
    }
  }
  
  if (!user) {
    console.error('=== PROFILE API: NO USER FOUND ===')
    console.error('Cookies:', Object.keys(parseCookies(event)).filter(k => k.includes('auth') || k.includes('supabase')).join(', ') || 'none')
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
  
  console.log('User found:', user.id)
  
  // Always use service role to bypass RLS for this check
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Service role key not configured'
    })
  }
  
  // Use service role client to bypass RLS
  const adminClient = createClient(
    config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
    serviceKey
  )
  
  const { data: profile, error } = await adminClient
    .from('profiles')
    .select('app_role')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error loading profile with service role:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to load profile: ${error.message}`
    })
  }
  
  if (!profile) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile not found'
    })
  }
  
  return profile
})

