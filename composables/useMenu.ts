import type { Menu, Category, MenuItem, MenuWithDetails, CategoryWithItems } from '~/types/database'

export const useMenu = () => {
  const { client } = useSupabaseClientStrict()
  const { currentTenantId } = useTenant()
  
  const loadPublishedMenu = async (tenantId: string, menuSlug = 'main') => {
    // Load menu with template
    const { data: menu, error: menuError } = await client
      .from('menus')
      .select('*, template:menu_templates(*)')
      .eq('tenant_id', tenantId)
      .eq('slug', menuSlug)
      .eq('is_published', true)
      .single()
      
    if (menuError) throw menuError
    
    // Load categories with items
    const { data: categories, error: catError } = await client
      .from('categories')
      .select('*, items:menu_items(*)')
      .eq('menu_id', menu.id)
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      
    if (catError) throw catError
    
    // Load custom texts
    const { data: customTexts } = await client
      .from('custom_texts')
      .select('*')
      .eq('tenant_id', tenantId)
    
    const textsMap = (customTexts || []).reduce((acc, text) => {
      acc[text.key] = text.value
      return acc
    }, {} as Record<string, string>)
    
    return {
      menu: menu as MenuWithDetails,
      categories: categories as CategoryWithItems[],
      customTexts: textsMap
    }
  }
  
  const loadMenuForEdit = async (menuId: string) => {
    const { data: menu, error: menuError } = await client
      .from('menus')
      .select('*')
      .eq('id', menuId)
      .single()
      
    if (menuError) throw menuError
    return menu as Menu
  }
  
  const listMenusByTenant = async (tenantId: string) => {
    const { data, error } = await client
      .from('menus')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data as Menu[]
  }
  
  const updateMenu = async (menuId: string, updates: Partial<Menu>) => {
    const { data, error } = await client
      .from('menus')
      .update(updates)
      .eq('id', menuId)
      .select()
      .single()
      
    if (error) throw error
    return data as Menu
  }
  
  return {
    loadPublishedMenu,
    loadMenuForEdit,
    listMenusByTenant,
    updateMenu
  }
}

