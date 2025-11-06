import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const userId = query.userId as string
  
  console.log('=== PROFILE BY ID API ===')
  console.log('User ID:', userId)
  
  if (!userId) {
    console.error('No user ID provided')
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }
  
  // Always use service role to bypass RLS
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('Service role key not configured')
    throw createError({
      statusCode: 500,
      statusMessage: 'Service role key not configured'
    })
  }
  
  const supabaseUrl = config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || ''
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('Service key:', serviceKey ? 'Set (length: ' + serviceKey.length + ')' : 'Missing')
  
  // Use service role client to bypass RLS
  const adminClient = createClient(
    supabaseUrl,
    serviceKey
  )
  
  console.log('Querying profiles table for user:', userId)
  const { data: profile, error } = await adminClient
    .from('profiles')
    .select('app_role')
    .eq('id', userId)
    .maybeSingle() // Use maybeSingle to handle cases where profile doesn't exist
  
  if (error) {
    console.error('Error loading profile with service role:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    // Return 406 Not Acceptable if it's a constraint error, otherwise 500
    const statusCode = error.code === 'PGRST116' ? 406 : 500
    throw createError({
      statusCode,
      statusMessage: `Failed to load profile: ${error.message}`
    })
  }
  
  if (!profile) {
    console.error('Profile not found for user:', userId)
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile not found'
    })
  }
  
  console.log('Profile found:', profile)
  return profile
})

