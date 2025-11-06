import { QRService, generateQRSchema } from '~/server/services/qr.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const validatedData = generateQRSchema.parse(body)
  
  return await QRService.generateQR(event, validatedData)
})
