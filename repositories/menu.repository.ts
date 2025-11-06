/**
 * Menu Repository
 * Handles all data access operations for menus following Repository Pattern
 */
import type { Database } from '~/types/database'

type Menu = Database['public']['Tables']['menus']['Row']
type MenuTemplate = Database['public']['Tables']['menu_templates']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type MenuItem = Database['public']['Tables']['menu_items']['Row']
type CustomText = Database['public']['Tables']['custom_texts']['Row']

export interface MenuWithDetails extends Menu {
  template?: MenuTemplate
}

export interface CategoryWithItems extends Category {
  items?: MenuItem[]
}

export interface MenuRepository {
  getById(menuId: string): Promise<Menu | null>
  getBySlug(tenantId: string, slug: string): Promise<MenuWithDetails | null>
  getByTenant(tenantId: string): Promise<Menu[]>
  getCategories(menuId: string): Promise<Category[]>
  getMenuItems(categoryIds: string[]): Promise<MenuItem[]>
  getCustomTexts(tenantId: string): Promise<Record<string, string>>
  create(data: Partial<Menu>): Promise<Menu>
  update(id: string, data: Partial<Menu>): Promise<Menu>
  delete(id: string): Promise<void>
}

export const useMenuRepository = (): MenuRepository => {
  const { client } = useSupabaseClientStrict()

  return {
    async getById(menuId: string) {
      const { data, error } = await client
        .from('menus')
        .select('*')
        .eq('id', menuId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching menu by ID:', error)
        return null
      }

      return data as Menu | null
    },

    async getBySlug(tenantId: string, slug: string) {
      const { data, error } = await client
        .from('menus')
        .select('*, template:menu_templates(*)')
        .eq('tenant_id', tenantId)
        .eq('slug', slug)
        .maybeSingle()

      if (error) {
        console.error('Error fetching menu by slug:', error)
        return null
      }

      return data as MenuWithDetails | null
    },

    async getByTenant(tenantId: string) {
      const { data, error } = await client
        .from('menus')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching menus by tenant:', error)
        return []
      }

      return (data || []) as Menu[]
    },

    async getCategories(menuId: string) {
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('menu_id', menuId)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }

      return (data || []) as Category[]
    },

    async getMenuItems(categoryIds: string[]) {
      if (categoryIds.length === 0) return []

      const { data, error } = await client
        .from('menu_items')
        .select('*')
        .in('category_id', categoryIds)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching menu items:', error)
        return []
      }

      return (data || []) as MenuItem[]
    },

    async getCustomTexts(tenantId: string) {
      const { data, error } = await client
        .from('custom_texts')
        .select('*')
        .eq('tenant_id', tenantId)

      if (error) {
        console.error('Error fetching custom texts:', error)
        return {}
      }

      return (data || []).reduce((acc, text) => {
        acc[text.key] = text.value
        return acc
      }, {} as Record<string, string>)
    },

    async create(data: Partial<Menu>) {
      const { data: created, error } = await client
        .from('menus')
        .insert(data)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create menu: ${error.message}`)
      }

      return created as Menu
    },

    async update(id: string, data: Partial<Menu>) {
      const { data: updated, error } = await client
        .from('menus')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update menu: ${error.message}`)
      }

      return updated as Menu
    },

    async delete(id: string) {
      const { error } = await client
        .from('menus')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete menu: ${error.message}`)
      }
    }
  }
}

