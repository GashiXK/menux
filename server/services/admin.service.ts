/**
 * Admin Service
 * Business logic for admin operations
 */
import type { AuthContext } from './auth.service'
import { AuthService } from './auth.service'
import * as z from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().optional(),
  tenant_id: z.string().uuid('Invalid tenant ID'),
  role: z.enum(['admin', 'editor', 'viewer']).default('admin')
})

export const updateUserPasswordSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const updateAccountSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  full_name: z.string().optional()
}).refine(data => data.email || data.password || data.full_name, {
  message: 'At least one field must be provided'
})

export class AdminService {
  /**
   * Get all tenant users with optional filtering
   */
  static async getUsers(event: any, tenantId?: string) {
    const { adminClient } = await AuthService.verifySuperAdmin(event)

    // Get tenant users with profile
    let tenantUsersQuery = adminClient
      .from('tenant_users')
      .select('*, user:profiles!inner(*), tenant:tenants(*)')
      .order('created_at', { ascending: false })

    if (tenantId) {
      tenantUsersQuery = tenantUsersQuery.eq('tenant_id', tenantId)
    }

    const { data: tenantUsers, error: tenantUsersError } = await tenantUsersQuery

    if (tenantUsersError) {
      throw createError({
        statusCode: 400,
        message: tenantUsersError.message
      })
    }

    // Get all users to match emails
    const { data: allUsers } = await adminClient.auth.admin.listUsers()
    const userEmailMap = new Map(allUsers?.users?.map(u => [u.id, u.email]) || [])

    // Map emails to tenant users
    return tenantUsers.map((tu: any) => ({
      ...tu,
      email: userEmailMap.get(tu.user_id) || tu.user?.email || 'N/A',
      full_name: tu.user?.full_name || tu.user?.email?.split('@')[0] || 'No name',
      tenant: tu.tenant || null
    }))
  }

  /**
   * Create a new user and link to tenant
   */
  static async createUser(event: any, data: z.infer<typeof createUserSchema>) {
    const { adminClient } = await AuthService.verifySuperAdmin(event)

    // Check if user already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === data.email)

    let userId: string

    if (existingUser) {
      userId = existingUser.id
      console.log(`User ${data.email} already exists, using existing user`)
    } else {
      // Create new user
      const { data: newUser, error: adminCreateError } = await adminClient.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
        password: data.password
      })

      if (adminCreateError || !newUser?.user) {
        throw createError({
          statusCode: 400,
          message: adminCreateError?.message || 'Failed to create user'
        })
      }

      userId = newUser.user.id
    }

    // Create/update profile
    const { error: profileUpsertError } = await adminClient
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.full_name || data.email.split('@')[0],
        app_role: 'tenant_user'
      }, { onConflict: 'id' })

    if (profileUpsertError) {
      throw createError({
        statusCode: 400,
        message: `Failed to create profile: ${profileUpsertError.message}`
      })
    }

    // Link user to tenant
    const { error: tenantUserError } = await adminClient
      .from('tenant_users')
      .upsert({
        tenant_id: data.tenant_id,
        user_id: userId,
        role: data.role,
        is_owner: false
      }, { onConflict: 'tenant_id,user_id' })

    if (tenantUserError) {
      throw createError({
        statusCode: 400,
        message: `Failed to link user to tenant: ${tenantUserError.message}`
      })
    }

    return {
      success: true,
      user_id: userId,
      email: data.email,
      message: existingUser ? 'User linked to tenant' : 'User created and linked to tenant'
    }
  }

  /**
   * Update user password
   */
  static async updateUserPassword(event: any, data: z.infer<typeof updateUserPasswordSchema>) {
    const { adminClient } = await AuthService.verifySuperAdmin(event)

    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      data.user_id,
      { password: data.password }
    )

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: updateError.message || 'Failed to update user password'
      })
    }

    return { status: 'Password updated successfully' }
  }

  /**
   * Update account (profile or auth)
   */
  static async updateAccount(event: any, data: z.infer<typeof updateAccountSchema>) {
    const { user, client } = await AuthService.verifyAuthenticated(event)

    const updates: Record<string, unknown> = {}
    if (data.email) updates.email = data.email
    if (data.password) updates.password = data.password

    // Update auth user if needed
    if (Object.keys(updates).length > 0) {
      const { error: authError } = await client.auth.updateUser(updates)
      if (authError) {
        throw createError({
          statusCode: 400,
          message: authError.message
        })
      }
    }

    // Update profile if needed
    if (data.full_name) {
      const { error: profileError } = await client
        .from('profiles')
        .update({ full_name: data.full_name })
        .eq('id', user.id)

      if (profileError) {
        throw createError({
          statusCode: 400,
          message: profileError.message
        })
      }
    }

    return { success: true }
  }
}

