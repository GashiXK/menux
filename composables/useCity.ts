import type { City } from '~/types/database'

export const useCity = () => {
  const { client } = useSupabaseClientStrict()
  
  const listCities = async () => {
    const { data, error } = await client
      .from('cities')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as City[]
  }
  
  const getCity = async (id: number) => {
    const { data, error } = await client
      .from('cities')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as City
  }
  
  const createCity = async (city: Omit<City, 'id' | 'created_at'>) => {
    const { data, error } = await client
      .from('cities')
      .insert(city)
      .select()
      .single()
    
    if (error) throw error
    return data as City
  }
  
  const updateCity = async (id: number, updates: Partial<City>) => {
    const { data, error } = await client
      .from('cities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as City
  }
  
  const deleteCity = async (id: number) => {
    const { error } = await client
      .from('cities')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
  
  return {
    listCities,
    getCity,
    createCity,
    updateCity,
    deleteCity
  }
}

