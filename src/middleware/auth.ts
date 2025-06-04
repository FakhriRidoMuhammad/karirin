import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export async function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Save the intended destination for post-login redirect
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

export async function requireGuest(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
} 