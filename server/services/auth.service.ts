/**
 * Authentication Service
 * Handles authentication logic for API endpoints
 */
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export interface AuthContext {
  user: User
  adminClient: ReturnType<typeof createClient>
}

export class AuthService {
  private static getAdminClient() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Service role key not configured'
      })
    }

    const config = useRuntimeConfig()
    return createClient(
      config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      serviceKey
    )
  }

  /**
   * Authenticate user from event (cookie or Authorization header)
   */
  static async authenticate(event: any): Promise<User> {
    // Try to get user from serverSupabaseUser (handles cookies automatically)
    let user = await serverSupabaseUser(event)

    // If that fails, try to get from Authorization header
    if (!user) {
      const authHeader = getRequestHeader(event, 'authorization')
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim()
        if (token) {
          const config = useRuntimeConfig()
          const supabaseUrl = config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || ''
          const supabaseAnonKey = config.public.supabaseAnonKey || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''

          const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          })

          const { data: { user: userData }, error } = await supabase.auth.getUser(token)
          if (!error && userData) {
            user = userData
          }
        }
      }
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Auth session missing! Please login again.'
      })
    }

    return user
  }

  /**
   * Verify user is super admin and return admin client
   */
  static async verifySuperAdmin(event: any): Promise<AuthContext> {
    const user = await this.authenticate(event)
    const adminClient = this.getAdminClient()

    // Verify user is super admin
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('app_role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile error:', profileError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to verify user profile'
      })
    }

    if (!profile || profile.app_role !== 'super_admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only super admins can perform this action'
      })
    }

    return { user, adminClient }
  }

  /**
   * Verify user is authenticated (tenant user or super admin)
   */
  static async verifyAuthenticated(event: any): Promise<{ user: User; client: ReturnType<typeof createClient> }> {
    const user = await this.authenticate(event)
    const config = useRuntimeConfig()
    
    const client = createClient(
      config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      config.public.supabaseAnonKey || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    return { user, client }
  }
}

