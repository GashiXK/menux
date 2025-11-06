import { AdminService } from '~/server/services/admin.service'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenantId = query.tenant_id as string | undefined
  
  return await AdminService.getUsers(event, tenantId)
})

