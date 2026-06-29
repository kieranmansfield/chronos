import { test, expect } from '@playwright/test'

test('homepage loads with correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/kmcom/)
})

test('homepage has no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('/')
  expect(errors).toHaveLength(0)
})
