import type { Tenant, MenuWithDetails, CategoryWithItems } from './database'

export interface MenuTemplateProps {
  tenant: Tenant
  menu: MenuWithDetails
  categories: CategoryWithItems[]
  customTexts: Record<string, string>
}

