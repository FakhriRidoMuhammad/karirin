import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  // Computed
  const isAuthenticated = computed(() => !!token.value)
  const userFullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '')

  // Actions
  async function login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      await fetchUserProfile()
      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  async function fetchUserProfile() {
    try {
      const response = await api.get('/auth/profile')
      user.value = response.data
      return { success: true }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      }
    }
  }

  async function updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData)
      user.value = response.data
      return { success: true }
    } catch (error) {
      console.error('Failed to update profile:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      }
    }
  }

  // Initialize
  if (token.value) {
    fetchUserProfile()
  }

  return {
    // State
    user,
    token,
    // Computed
    isAuthenticated,
    userFullName,
    // Actions
    login,
    logout,
    fetchUserProfile,
    updateProfile
  }
}) 