import { AdminService, removeTenantUserSchema } from '~/server/services/admin.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validatedData = removeTenantUserSchema.parse(body)

  return await AdminService.removeTenantUser(event, validatedData)
})


