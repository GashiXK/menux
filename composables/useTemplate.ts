import type { MenuTemplate } from '~/types/database'

export const useTemplate = () => {
  const { client } = useSupabaseClientStrict()
  
  const listTemplates = async () => {
    const { data, error } = await client
      .from('menu_templates')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as MenuTemplate[]
  }
  
  const getTemplate = async (key: string) => {
    const { data, error } = await client
      .from('menu_templates')
      .select('*')
      .eq('key', key)
      .single()
    
    if (error) throw error
    return data as MenuTemplate
  }
  
  const createTemplate = async (template: Omit<MenuTemplate, 'id'>) => {
    const { data, error } = await client
      .from('menu_templates')
      .insert(template)
      .select()
      .single()
    
    if (error) throw error
    return data as MenuTemplate
  }
  
  const updateTemplate = async (key: string, updates: Partial<MenuTemplate>) => {
    const { data, error } = await client
      .from('menu_templates')
      .update(updates)
      .eq('key', key)
      .select()
      .single()
    
    if (error) throw error
    return data as MenuTemplate
  }
  
  const deleteTemplate = async (key: string) => {
    const { error } = await client
      .from('menu_templates')
      .delete()
      .eq('key', key)
    
    if (error) throw error
  }
  
  return {
    listTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
  }
}

