/**
 * Tenant Repository
 * Handles all data access operations for tenants following Repository Pattern
 */
import type { Database } from '~/types/database'

type Tenant = Database['public']['Tables']['tenants']['Row'] & {
  city?: Database['public']['Tables']['cities']['Row']
}

export interface TenantRepository {
  getById(tenantId: string): Promise<Tenant | null>
  getBySlug(slug: string): Promise<Tenant | null>
  getByDomain(domain: string): Promise<Tenant | null>
  getAll(): Promise<Tenant[]>
  create(data: Partial<Tenant>): Promise<Tenant>
  update(id: string, data: Partial<Tenant>): Promise<Tenant>
  delete(id: string): Promise<void>
}

export const useTenantRepository = (): TenantRepository => {
  const { client } = useSupabaseClientStrict()

  return {
    async getById(tenantId: string) {
      const { data, error } = await client
        .from('tenants')
        .select('*, city:cities(*)')
        .eq('id', tenantId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching tenant by ID:', error)
        return null
      }

      return data as Tenant | null
    },

    async getBySlug(slug: string) {
      const { data, error } = await client
        .from('tenants')
        .select('*, city:cities(*)')
        .eq('slug', slug)
        .maybeSingle()

      if (error) {
        console.error('Error fetching tenant by slug:', error)
        return null
      }

      return data as Tenant | null
    },

    async getByDomain(domain: string) {
      const { data: domainData, error } = await client
        .from('tenant_domains')
        .select('*, tenant:tenants!inner(*, city:cities(*))')
        .or(`domain.eq.${domain},subdomain.eq.${domain}`)
        .maybeSingle()

      if (error) {
        console.error('Error fetching tenant by domain:', error)
        return null
      }

      return (domainData as any)?.tenant as Tenant | null
    },

    async getAll() {
      const { data, error } = await client
        .from('tenants')
        .select('*, city:cities(*)')
        .order('name')

      if (error) {
        console.error('Error fetching all tenants:', error)
        return []
      }

      return (data || []) as Tenant[]
    },

    async create(data: Partial<Tenant>) {
      const { data: created, error } = await client
        .from('tenants')
        .insert(data)
        .select('*, city:cities(*)')
        .single()

      if (error) {
        throw new Error(`Failed to create tenant: ${error.message}`)
      }

      return created as Tenant
    },

    async update(id: string, data: Partial<Tenant>) {
      const { data: updated, error } = await client
        .from('tenants')
        .update(data)
        .eq('id', id)
        .select('*, city:cities(*)')
        .single()

      if (error) {
        throw new Error(`Failed to update tenant: ${error.message}`)
      }

      return updated as Tenant
    },

    async delete(id: string) {
      const { error } = await client
        .from('tenants')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete tenant: ${error.message}`)
      }
    }
  }
}

