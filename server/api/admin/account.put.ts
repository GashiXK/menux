import { AdminService, updateAccountSchema } from '~/server/services/admin.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const validatedData = updateAccountSchema.parse(body)
  
  return await AdminService.updateAccount(event, validatedData)
})

