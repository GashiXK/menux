import { AdminService, updateUserPasswordSchema } from '~/server/services/admin.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const validatedData = updateUserPasswordSchema.parse(body)
  
  return await AdminService.updateUserPassword(event, validatedData)
})
