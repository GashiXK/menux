/**
 * Centralized type exports for the application
 * Import from here for better organization and tree-shaking
 */

// Database types
export type {
  AppRole,
  TenantRole,
  AdScope,
  City,
  Tenant,
  TenantDomain,
  Profile,
  TenantUser,
  MenuTemplate,
  Menu,
  Category,
  MenuItem,
  ItemVariant,
  CustomText,
  QRCode,
  Ad,
  AdTarget
} from './database'

// Common types
export type {
  ApiError,
  ToastNotification,
  TableRow,
  TenantUserWithProfile,
  TenantUserWithDetails,
  FormState,
  PaginationParams,
  SortParams
} from './common'

// Re-export for convenience
export type { Database } from './database'

