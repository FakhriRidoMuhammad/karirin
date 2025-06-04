import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from '@/middleware/auth'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Base routes
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: requireGuest
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      beforeEnter: requireGuest
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: requireAuth
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: requireAuth
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      beforeEnter: requireAuth
    },
    // Karirin prefixed routes
    {
      path: '/karirin',
      redirect: '/'
    },
    {
      path: '/karirin/login',
      redirect: '/login'
    },
    {
      path: '/karirin/signup',
      redirect: '/signup'
    },
    {
      path: '/karirin/about',
      redirect: '/about'
    },
    {
      path: '/karirin/dashboard',
      redirect: '/dashboard'
    },
    {
      path: '/karirin/profile',
      redirect: '/profile'
    },
    {
      path: '/karirin/settings',
      redirect: '/settings'
    },
    // Catch-all route for /karirin/* that hasn't been explicitly handled
    {
      path: '/karirin/:pathMatch(.*)*',
      redirect: to => {
        const path = to.path.replace('/karirin', '') || '/'
        return path.startsWith('/') ? path : '/' + path
      }
    },
    // 404 route must be last
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router 