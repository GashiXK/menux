import { AdminService, updateTenantUserSchema } from '~/server/services/admin.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validatedData = updateTenantUserSchema.parse(body)

  return await AdminService.updateTenantUser(event, validatedData)
})


