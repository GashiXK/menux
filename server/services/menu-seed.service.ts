import * as z from 'zod'
import { AuthService } from './auth.service'

const menuSeedItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative('Price must be positive or zero'),
  currency: z.string().min(1, 'Currency is required').default('EUR'),
  tags: z.array(z.string()).optional(),
  image_url: z.string().url().nullable().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
  attributes: z.record(z.any()).optional()
})

const menuSeedCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().nullable().optional(),
  sort_order: z.number().int().nonnegative().optional(),
  is_special: z.boolean().optional(),
  visible: z.boolean().optional(),
  items: z.array(menuSeedItemSchema).optional()
})

export const tenantMenuSeedSchema = z.object({
  tenantId: z.string().uuid('Invalid tenant ID'),
  payload: z.object({
    categories: z.array(menuSeedCategorySchema).min(1, 'Provide at least one category')
  })
})

type SeedPayload = z.infer<typeof tenantMenuSeedSchema>['payload']

export class MenuSeedService {
  static async seedTenantMenu(event: any, tenantId: string, payload: SeedPayload) {
    const { adminClient } = await AuthService.verifySuperAdmin(event)

    const { data: menu, error: menuError } = await adminClient
      .from('menus')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (menuError) {
      throw createError({
        statusCode: 400,
        statusMessage: menuError.message || 'Failed to load tenant menu'
      })
    }

    if (!menu) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No menu found for this tenant. Create a menu before seeding.'
      })
    }

    let createdCategories = 0
    let createdItems = 0

    for (const [categoryIndex, category] of payload.categories.entries()) {
      const { data: createdCategory, error: categoryError } = await adminClient
        .from('categories')
        .insert({
          tenant_id: tenantId,
          menu_id: menu.id,
          name: category.name,
          description: category.description ?? null,
          sort_order: category.sort_order ?? categoryIndex + 1,
          is_special: category.is_special ?? false,
          visible: category.visible ?? true
        })
        .select()
        .single()

      if (categoryError || !createdCategory) {
        throw createError({
          statusCode: 400,
          statusMessage: categoryError?.message || `Failed to create category ${category.name}`
        })
      }

      createdCategories += 1

      if (category.items && category.items.length > 0) {
        const itemsPayload = category.items.map((item, itemIndex) => ({
          tenant_id: tenantId,
          category_id: createdCategory.id,
          name: item.name,
          description: item.description ?? null,
          price: item.price,
          currency: item.currency ?? 'EUR',
          tags: item.tags ?? null,
          image_url: item.image_url ?? null,
          is_active: item.is_active ?? true,
          sort_order: item.sort_order ?? itemIndex + 1,
          attributes: item.attributes ?? {}
        }))

        const { data: insertedItems, error: itemsError } = await adminClient
          .from('menu_items')
          .insert(itemsPayload)
          .select('id')

        if (itemsError) {
          throw createError({
            statusCode: 400,
            statusMessage: itemsError.message || `Failed to create items for category ${category.name}`
          })
        }

        createdItems += insertedItems?.length ?? 0
      }
    }

    return {
      success: true,
      createdCategories,
      createdItems
    }
  }
}


