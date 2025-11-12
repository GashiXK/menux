import { MenuSeedService, tenantMenuSeedSchema } from '~/server/services/menu-seed.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = tenantMenuSeedSchema.parse(body)

  return await MenuSeedService.seedTenantMenu(event, parsed.tenantId, parsed.payload)
})


