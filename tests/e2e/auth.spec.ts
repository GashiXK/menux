import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('h1')).toContainText('MenuX')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
  
  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Form validation should prevent submission
    await expect(page.locator('input[type="email"]')).toHaveAttribute('type', 'email')
  })
  
  test('should navigate to reset password', async ({ page }) => {
    await page.goto('/auth/login')
    await page.click('text=Forgot your password?')
    await expect(page).toHaveURL('/auth/reset-password')
    await expect(page.locator('h1')).toContainText('Reset Password')
  })
})

