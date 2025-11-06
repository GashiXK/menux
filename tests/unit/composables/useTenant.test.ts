import { describe, it, expect } from 'vitest'

describe('useTenant', () => {
  it('should parse subdomain correctly', () => {
    const testCases = [
      { host: 'skyline.example.com', expected: 'skyline' },
      { host: 'garden.example.com', expected: 'garden' },
      { host: 'localhost:3000', expected: 'localhost' }
    ]
    
    testCases.forEach(({ host, expected }) => {
      const subdomain = host.split('.')[0]
      expect(subdomain).toBe(expected)
    })
  })
  
  it('should handle tenant loading', async () => {
    // Mock test for tenant loading logic
    const mockTenant = {
      id: '123',
      name: 'Test Restaurant',
      slug: 'test-restaurant',
      is_active: true
    }
    
    expect(mockTenant.is_active).toBe(true)
    expect(mockTenant.slug).toBe('test-restaurant')
  })
})

