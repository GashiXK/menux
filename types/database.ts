export type AppRole = 'super_admin' | 'tenant_user'
export type TenantRole = 'admin' | 'editor' | 'viewer'
export type AdScope = 'all_pages' | 'menu' | 'category' | 'item'

export interface City {
  id: number
  name: string
  country_code: string | null
  region: string | null
  slug: string
  created_at: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  city_id: number | null
  logo_url: string | null
  is_active: boolean
  created_at: string
}

export interface TenantDomain {
  id: number
  tenant_id: string
  domain: string | null
  subdomain: string | null
  is_primary: boolean
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  app_role: AppRole
  created_at: string
}

export interface TenantUser {
  tenant_id: string
  user_id: string
  role: TenantRole
  is_owner: boolean
  created_at: string
}

export interface MenuTemplate {
  id: number
  key: string
  name: string
  preview_image_url: string | null
  base_config: Record<string, any>
}

export interface Menu {
  id: string
  tenant_id: string
  name: string
  slug: string
  template_key: string | null
  design_config: Record<string, any>
  is_published: boolean
  is_default: boolean
  created_at: string
}

export interface Category {
  id: string
  menu_id: string
  tenant_id: string
  name: string
  description: string | null
  sort_order: number
  is_special: boolean
  visible: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  tenant_id: string
  name: string
  description: string | null
  price: number
  currency: string
  tags: string[] | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  attributes: Record<string, any>
  created_at: string
}

export interface ItemVariant {
  id: string
  item_id: string
  name: string
  price_delta: number
  attributes: Record<string, any>
}

export interface CustomText {
  id: string
  tenant_id: string
  key: string
  value: string
  locale: string
}

export interface QRCode {
  id: string
  tenant_id: string
  menu_id: string
  url: string
  image_url: string | null
  created_at: string
}

export interface Ad {
  id: string
  title: string
  body: string | null
  media_url: string | null
  link_url: string | null
  created_by: string | null
  start_time: string | null
  end_time: string | null
  priority: number
  active: boolean
  created_at: string
}

export interface AdTarget {
  id: string
  ad_id: string
  tenant_id: string | null
  city_id: number | null
  scope: AdScope
  page_path: string | null
}

// Extended types with relations
export interface MenuWithDetails extends Menu {
  tenant?: Tenant
  template?: MenuTemplate
}

export interface CategoryWithItems extends Category {
  items?: MenuItem[]
}

export interface MenuItemWithVariants extends MenuItem {
  variants?: ItemVariant[]
}

export interface TenantWithDomains extends Tenant {
  domains?: TenantDomain[]
  city?: City
}

export interface AdWithTargets extends Ad {
  targets?: AdTarget[]
}

