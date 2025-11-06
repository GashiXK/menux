/**
 * Authentication Service
 * Handles all authentication-related operations following Single Responsibility Principle
 */
import type { User } from '@supabase/supabase-js'

export interface AuthService {
  signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }>
  signOut(): Promise<{ error: Error | null }>
  getCurrentUser(): Promise<User | null>
  getSession(): Promise<{ access_token: string | null; refresh_token: string | null } | null>
  refreshSession(): Promise<{ error: Error | null }>
}

export const useAuthService = (): AuthService => {
  const client = useSupabaseClient()

  return {
    async signIn(email: string, password: string) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          return { user: null, error: new Error(error.message) }
        }

        if (data?.session) {
          await client.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          })
        }

        return { user: data?.user || null, error: null }
      } catch (error: any) {
        return { user: null, error: error instanceof Error ? error : new Error(String(error)) }
      }
    },

    async signOut() {
      try {
        const { error } = await client.auth.signOut()
        return { error: error ? new Error(error.message) : null }
      } catch (error: any) {
        return { error: error instanceof Error ? error : new Error(String(error)) }
      }
    },

    async getCurrentUser() {
      try {
        const { data: { user } } = await client.auth.getUser()
        return user
      } catch {
        return null
      }
    },

    async getSession() {
      try {
        const { data: { session } } = await client.auth.getSession()
        if (!session) return null
        return {
          access_token: session.access_token,
          refresh_token: session.refresh_token
        }
      } catch {
        return null
      }
    },

    async refreshSession() {
      try {
        const { error } = await client.auth.refreshSession()
        return { error: error ? new Error(error.message) : null }
      } catch (error: any) {
        return { error: error instanceof Error ? error : new Error(String(error)) }
      }
    }
  }
}

