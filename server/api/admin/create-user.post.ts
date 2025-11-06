import { AdminService, createUserSchema } from '~/server/services/admin.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const validatedData = createUserSchema.parse(body)
  
  return await AdminService.createUser(event, validatedData)
})

