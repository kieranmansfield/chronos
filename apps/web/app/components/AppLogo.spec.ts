import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppLogo from './AppLogo.vue'

describe('AppLogo', () => {
  it('renders an svg element', async () => {
    const wrapper = await mountSuspended(AppLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('contains logo paths', async () => {
    const wrapper = await mountSuspended(AppLogo)
    expect(wrapper.findAll('path').length).toBeGreaterThan(0)
  })
})
