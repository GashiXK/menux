import type { Category } from '~/types/database'

export const useCategories = () => {
  const { client } = useSupabaseClientStrict()
  
  const listCategories = async (menuId: string) => {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('menu_id', menuId)
      .order('sort_order', { ascending: true })
      
    if (error) throw error
    return data as Category[]
  }
  
  const createCategory = async (category: Partial<Category>) => {
    const { data, error } = await client
      .from('categories')
      .insert(category)
      .select()
      .single()
      
    if (error) throw error
    return data as Category
  }
  
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { data, error } = await client
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw error
    return data as Category
  }
  
  const deleteCategory = async (id: string) => {
    const { error } = await client
      .from('categories')
      .delete()
      .eq('id', id)
      
    if (error) throw error
  }
  
  const reorderCategories = async (categories: { id: string; sort_order: number }[]) => {
    const updates = categories.map(cat => 
      client.from('categories').update({ sort_order: cat.sort_order }).eq('id', cat.id)
    )
    await Promise.all(updates)
  }
  
  return {
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
  }
}

