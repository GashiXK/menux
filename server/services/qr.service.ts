/**
 * QR Code Service
 * Business logic for QR code generation
 */
import QRCode from 'qrcode'
import { AuthService } from './auth.service'
import * as z from 'zod'

export const generateQRSchema = z.object({
  menu_id: z.string().uuid('Invalid menu ID'),
  tenant_id: z.string().uuid('Invalid tenant ID')
})

export class QRService {
  /**
   * Generate QR code for a menu
   */
  static async generateQR(event: any, data: z.infer<typeof generateQRSchema>) {
    const { client } = await AuthService.verifyAuthenticated(event)

    // Get menu and tenant info
    const { data: menu, error: menuError } = await client
      .from('menus')
      .select('*, tenant:tenants!inner(*, domains:tenant_domains(*))')
      .eq('id', data.menu_id)
      .single()

    if (menuError || !menu) {
      throw createError({
        statusCode: 404,
        message: 'Menu not found'
      })
    }

    // Build URL
    const tenant = (menu as any).tenant
    const tenantSlug = tenant.slug

    // Get base URL from request
    const requestUrl = getRequestURL(event)
    const origin = requestUrl.origin
    const menuSlug = menu.slug || 'main' // Ensure we have a slug, default to 'main'
    
    // Check if we're in development/localhost
    const isLocalhost = origin.includes('localhost') || 
                       origin.includes('127.0.0.1') || 
                       origin.includes('0.0.0.0') ||
                       process.env.NODE_ENV !== 'production'

    // For localhost/development, use query parameter format: /menu-slug?tenant=tenant-slug
    // For production, try to use domain/subdomain first, fallback to query parameter
    let menuUrl: string
    if (isLocalhost) {
      // Development: http://localhost:3000/main?tenant=skyline
      menuUrl = `${origin}/${menuSlug}?tenant=${tenantSlug}`
    } else {
      // Production: Try to use custom domain/subdomain
      const domains = (tenant as any).domains || []
      const primaryDomain = domains.find((d: any) => d.is_primary)
      
      if (primaryDomain?.domain) {
        // Custom domain: https://customdomain.com/menu-slug
        menuUrl = `https://${primaryDomain.domain}/${menuSlug}`
      } else if (primaryDomain?.subdomain) {
        // Subdomain: https://subdomain.example.com/menu-slug
        const host = requestUrl.host
        const baseHost = host.split(':')[0] // Remove port if present
        const parts = baseHost.split('.')
        if (parts.length > 1) {
          // Replace first part with subdomain
          parts[0] = primaryDomain.subdomain
          menuUrl = `${requestUrl.protocol}//${parts.join('.')}/${menuSlug}`
        } else {
          // Fallback to query parameter
          menuUrl = `${origin}/${menuSlug}?tenant=${tenantSlug}`
        }
      } else {
        // No domain configured, use query parameter
        menuUrl = `${origin}/${menuSlug}?tenant=${tenantSlug}`
      }
    }
    
    console.log('🔗 Generated QR URL:', {
      origin,
      menuSlug,
      tenantSlug,
      isLocalhost,
      menuUrl
    })

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Check if QR code already exists
    const { data: existingQR } = await client
      .from('qr_codes')
      .select('id')
      .eq('tenant_id', data.tenant_id)
      .eq('menu_id', data.menu_id)
      .maybeSingle()

    let qrCode
    if (existingQR) {
      // Update existing QR code
      const { data: updatedQR, error: qrError } = await client
        .from('qr_codes')
        .update({
          url: menuUrl,
          image_url: qrDataUrl
        })
        .eq('id', existingQR.id)
        .select()
        .single()

      if (qrError) {
        throw createError({
          statusCode: 500,
          message: qrError.message || 'Failed to update QR code'
        })
      }
      qrCode = updatedQR
    } else {
      // Insert new QR code
      const { data: newQR, error: qrError } = await client
        .from('qr_codes')
        .insert({
        tenant_id: data.tenant_id,
        menu_id: data.menu_id,
        url: menuUrl,
        image_url: qrDataUrl
      })
      .select()
      .single()

    if (qrError) {
      throw createError({
        statusCode: 500,
        message: qrError.message || 'Failed to save QR code'
      })
      }
      qrCode = newQR
    }

    return qrCode
  }
}

