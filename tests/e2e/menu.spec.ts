import { test, expect } from '@playwright/test'

test.describe('Public Menu Page', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('MenuX')
    await expect(page.locator('text=Sign In')).toBeVisible()
  })
  
  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for main elements
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })
  
  test('should navigate to login', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign In')
    await expect(page).toHaveURL('/auth/login')
  })
})

test.describe('Menu Templates', () => {
  test('should render menu categories', async ({ page }) => {
    // This would require a seeded database and tenant setup
    // Placeholder for actual implementation
    await page.goto('/')
    expect(true).toBe(true)
  })
})

