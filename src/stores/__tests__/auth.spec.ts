import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

// Mock the axios module
vi.mock('@/plugins/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn()
  }
}))

// Import the mocked module
import api from '@/plugins/axios'

interface User {
  firstName: string
  lastName: string
}

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('State', () => {
    it('initializes with correct default state', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.userFullName).toBe('')
    })
  })

  describe('Actions', () => {
    describe('login', () => {
      it('successfully logs in user', async () => {
        const store = useAuthStore()
        const mockToken = 'mock-token'
        const mockUser: User = { firstName: 'John', lastName: 'Doe' }
        
        vi.mocked(api.post).mockResolvedValueOnce({ data: { token: mockToken } })
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser })

        const result = await store.login({ email: 'test@example.com', password: 'password' })

        expect(result.success).toBe(true)
        expect(store.token).toBe(mockToken)
        expect(store.user).toEqual(mockUser)
        expect(store.isAuthenticated).toBe(true)
        expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
      })

      it('handles login failure', async () => {
        const store = useAuthStore()
        const errorMessage = 'Invalid credentials'
        
        vi.mocked(api.post).mockRejectedValueOnce({
          response: { data: { message: errorMessage } }
        })

        const result = await store.login({ email: 'test@example.com', password: 'wrong' })

        expect(result.success).toBe(false)
        expect(result.error).toBe(errorMessage)
        expect(store.token).toBeNull()
        expect(store.user).toBeNull()
        expect(store.isAuthenticated).toBe(false)
      })
    })

    describe('logout', () => {
      it('successfully logs out user', async () => {
        const store = useAuthStore()
        store.token = 'test-token'
        ;(store.user as User) = { firstName: 'John', lastName: 'Doe' }

        await store.logout()

        expect(store.token).toBeNull()
        expect(store.user).toBeNull()
        expect(store.isAuthenticated).toBe(false)
        expect(localStorage.removeItem).toHaveBeenCalledWith('token')
      })
    })

    describe('fetchUserProfile', () => {
      it('successfully fetches user profile', async () => {
        const store = useAuthStore()
        const mockUser: User = { firstName: 'John', lastName: 'Doe' }
        
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser })

        const result = await store.fetchUserProfile()

        expect(result.success).toBe(true)
        expect(store.user).toEqual(mockUser)
        expect(store.userFullName).toBe('John Doe')
      })

      it('handles fetch profile failure', async () => {
        const store = useAuthStore()
        const errorMessage = 'Failed to fetch profile'
        
        vi.mocked(api.get).mockRejectedValueOnce({
          response: { data: { message: errorMessage } }
        })

        const result = await store.fetchUserProfile()

        expect(result.success).toBe(false)
        expect(result.error).toBe(errorMessage)
        expect(store.user).toBeNull()
      })
    })

    describe('updateProfile', () => {
      it('successfully updates user profile', async () => {
        const store = useAuthStore()
        const updatedUser: User = { firstName: 'Jane', lastName: 'Doe' }
        
        vi.mocked(api.put).mockResolvedValueOnce({ data: updatedUser })

        const result = await store.updateProfile(updatedUser)

        expect(result.success).toBe(true)
        expect(store.user).toEqual(updatedUser)
        expect(store.userFullName).toBe('Jane Doe')
      })

      it('handles update profile failure', async () => {
        const store = useAuthStore()
        const errorMessage = 'Failed to update profile'
        
        vi.mocked(api.put).mockRejectedValueOnce({
          response: { data: { message: errorMessage } }
        })

        const result = await store.updateProfile({ firstName: 'Jane' } as User)

        expect(result.success).toBe(false)
        expect(result.error).toBe(errorMessage)
      })
    })
  })
}) 