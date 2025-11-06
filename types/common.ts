/**
 * Common TypeScript types and interfaces for the application
 */

export interface ApiError {
  message: string
  statusCode?: number
  statusMessage?: string
  data?: unknown
}

export interface ToastNotification {
  title: string
  description?: string
  color?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'neutral'
  icon?: string
}

export interface TableRow {
  [key: string]: unknown
}

export interface TenantUserWithProfile extends TenantUser {
  email?: string
  full_name?: string
  tenant?: Tenant
  user?: Profile
}

export interface TenantUserWithDetails {
  user_id: string
  tenant_id: string
  role: TenantRole
  is_owner: boolean
  email: string
  full_name: string
  tenant?: Tenant
  created_at: string
}

export interface FormState<T> {
  [key: string]: T | null | undefined
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

// Re-export commonly used types
export type { Tenant, City, Menu, MenuItem, Category, Profile, TenantUser } from './database'
export type { AppRole, TenantRole } from './database'

