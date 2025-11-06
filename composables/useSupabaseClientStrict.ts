import type { SupabaseClient } from '@supabase/supabase-js'
import type { PostgrestError } from '@supabase/supabase-js'

export interface SupabaseError extends PostgrestError {
  message: string
  code?: string
  details?: string
  hint?: string
}

export const useSupabaseClientStrict = () => {
  const client = useSupabaseClient()
  
  const handleError = (error: unknown, context: string): never => {
    const supabaseError = error as SupabaseError
    console.error(`[${context}]`, supabaseError)
    throw new Error(`${context}: ${supabaseError.message || 'Unknown error'}`)
  }

  return {
    client: client as SupabaseClient,
    handleError
  }
}

