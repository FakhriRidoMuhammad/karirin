import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Vuetify components globally
config.global.components = {
  'v-card': { template: '<div><slot /></div>' },
  'v-btn': { template: '<button><slot /></button>' },
  'v-icon': { template: '<i><slot /></i>' },
  'v-text-field': { template: '<input />' },
  'v-container': { template: '<div><slot /></div>' },
  'v-row': { template: '<div><slot /></div>' },
  'v-col': { template: '<div><slot /></div>' }
}

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {}
  })
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
}) 