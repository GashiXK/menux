import type { MenuItem, ItemVariant } from '~/types/database'

export const useMenuItems = () => {
  const { client } = useSupabaseClientStrict()
  
  const listItems = async (categoryId: string) => {
    const { data, error } = await client
      .from('menu_items')
      .select('*, variants:item_variants(*)')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
      
    if (error) throw error
    return data as MenuItem[]
  }
  
  const createItem = async (item: Partial<MenuItem>) => {
    const { data, error } = await client
      .from('menu_items')
      .insert(item)
      .select()
      .single()
      
    if (error) throw error
    return data as MenuItem
  }
  
  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    const { data, error } = await client
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw error
    return data as MenuItem
  }
  
  const deleteItem = async (id: string) => {
    const { error } = await client
      .from('menu_items')
      .delete()
      .eq('id', id)
      
    if (error) throw error
  }
  
  const addVariant = async (variant: Partial<ItemVariant>) => {
    const { data, error } = await client
      .from('item_variants')
      .insert(variant)
      .select()
      .single()
      
    if (error) throw error
    return data as ItemVariant
  }
  
  const removeVariant = async (id: string) => {
    const { error } = await client
      .from('item_variants')
      .delete()
      .eq('id', id)
      
    if (error) throw error
  }
  
  return {
    listItems,
    createItem,
    updateItem,
    deleteItem,
    addVariant,
    removeVariant
  }
}

