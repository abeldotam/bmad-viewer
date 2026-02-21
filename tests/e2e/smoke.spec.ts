import { test, expect } from '../support/merged-fixtures'

test.describe('Smoke Tests', () => {
  test('app mode endpoint responds with valid mode', async ({ apiRequest }) => {
    // Given the app is running
    // When we request the config endpoint
    const { status, body } = await apiRequest({
      method: 'GET',
      path: '/api/_config'
    })

    // Then it returns a valid app mode
    expect(status).toBe(200)
    expect(body).toHaveProperty('appMode')
    expect(['personal', 'multiuser', 'unconfigured']).toContain(body.appMode)
  })

  test('landing page loads successfully', async ({ page }) => {
    // Given I navigate to the root URL
    await page.goto('/')

    // Then the page should load without errors
    await expect(page).toHaveTitle(/BMAD/)
  })
})
