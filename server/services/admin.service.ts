/**
 * Admin Service
 * Business logic for admin operations
 */
import type { AuthContext } from './auth.service'
import { AuthService } from './auth.service'
import * as z from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  full_name: z.string().optional(),
  tenant_id: z.string().uuid('Invalid tenant ID'),
  role: z.enum(['admin', 'editor', 'viewer']).default('admin'),
  is_owner: z.boolean().optional()
})

export const updateUserPasswordSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const updateTenantUserSchema = z.object({
  tenant_id: z.string().uuid('Invalid tenant ID'),
  user_id: z.string().uuid('Invalid user ID'),
  role: z.enum(['admin', 'editor', 'viewer']),
  is_owner: z.boolean().optional()
})

export const removeTenantUserSchema = z.object({
  tenant_id: z.string().uuid('Invalid tenant ID'),
  user_id: z.string().uuid('Invalid user ID'),
  delete_account: z.boolean().optional()
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
    const { data: existingUsers, error: existingUsersError } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      email: data.email
    } as { page?: number; perPage?: number; email?: string })

    if (existingUsersError) {
      throw createError({
        statusCode: 400,
        message: existingUsersError.message || 'Unable to check existing user'
      })
    }

    const existingUser = existingUsers?.users?.[0] ?? null

    let userId: string
    let accountAction: 'existing' | 'created' | 'invited' = 'existing'

    if (existingUser?.id) {
      userId = existingUser.id

      if (data.password) {
        const { error: passwordUpdateError } = await adminClient.auth.admin.updateUserById(userId, {
          password: data.password
        })

        if (passwordUpdateError) {
          throw createError({
            statusCode: 400,
            message: passwordUpdateError.message || 'Failed to update existing user password'
          })
        }
      }
    } else {
      if (data.password) {
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
        accountAction = 'created'
      } else {
        const { data: invitedUser, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(data.email)

        if (inviteError || !invitedUser?.user) {
          throw createError({
            statusCode: 400,
            message: inviteError?.message || 'Failed to invite user'
          })
        }

        userId = invitedUser.user.id
        accountAction = 'invited'
      }
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
        is_owner: Boolean(data.is_owner)
      }, { onConflict: 'tenant_id,user_id' })

    if (tenantUserError) {
      throw createError({
        statusCode: 400,
        message: `Failed to link user to tenant: ${tenantUserError.message}`
      })
    }

    const existingAccount = Boolean(existingUser?.id)

    return {
      success: true,
      user_id: userId,
      email: data.email,
      message: existingAccount
        ? 'User linked to tenant'
        : accountAction === 'created'
          ? 'User created and linked to tenant'
          : 'Invitation sent and user linked to tenant'
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

  /**
   * Update tenant user role or ownership
   */
  static async updateTenantUser(event: any, data: z.infer<typeof updateTenantUserSchema>) {
    const { adminClient } = await AuthService.verifySuperAdmin(event)

    const { data: existingTenantUser, error: existingError } = await adminClient
      .from('tenant_users')
      .select('tenant_id, user_id')
      .eq('tenant_id', data.tenant_id)
      .eq('user_id', data.user_id)
      .maybeSingle()

    if (existingError) {
      throw createError({
        statusCode: 400,
        message: existingError.message || 'Failed to load tenant user'
      })
    }

    if (!existingTenantUser) {
      throw createError({
        statusCode: 404,
        message: 'Tenant user not found'
      })
    }

    const { error: updateError } = await adminClient
      .from('tenant_users')
      .update({
        role: data.role,
        is_owner: Boolean(data.is_owner)
      })
      .eq('tenant_id', data.tenant_id)
      .eq('user_id', data.user_id)

    if (updateError) {
      throw createError({
        statusCode: 400,
        message: updateError.message || 'Failed to update tenant user'
      })
    }

    return {
      success: true
    }
  }

  /**
   * Remove tenant user or delete account completely
   */
  static async removeTenantUser(event: any, data: z.infer<typeof removeTenantUserSchema>) {
    const { adminClient } = await AuthService.verifySuperAdmin(event)

    const { error: deleteLinkError } = await adminClient
      .from('tenant_users')
      .delete()
      .eq('tenant_id', data.tenant_id)
      .eq('user_id', data.user_id)

    if (deleteLinkError) {
      throw createError({
        statusCode: 400,
        message: deleteLinkError.message || 'Failed to remove tenant user'
      })
    }

    if (data.delete_account) {
      const { error: deleteAccountError } = await adminClient.auth.admin.deleteUser(data.user_id)

      if (deleteAccountError) {
        throw createError({
          statusCode: 400,
          message: deleteAccountError.message || 'Tenant link removed but failed to delete auth user'
        })
      }
    }

    return {
      success: true
    }
  }
}

