/**
 * User Repository
 * Handles all data access operations for users following Repository Pattern
 */
import type { Database } from '~/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type TenantUser = Database['public']['Tables']['tenant_users']['Row']

export interface UserRepository {
  getProfile(userId: string): Promise<Profile | null>
  getTenantUsers(tenantId: string): Promise<TenantUser[]>
  getUserByEmail(email: string): Promise<{ id: string; email: string } | null>
}

export const useUserRepository = (): UserRepository => {
  const { client } = useSupabaseClientStrict()

  return {
    async getProfile(userId: string) {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as Profile | null
    },

    async getTenantUsers(tenantId: string) {
      const { data, error } = await client
        .from('tenant_users')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tenant users:', error)
        return []
      }

      return (data || []) as TenantUser[]
    },

    async getUserByEmail(email: string) {
      // This would typically use the admin API
      // For now, we'll return null as this requires service role
      return null
    }
  }
}

