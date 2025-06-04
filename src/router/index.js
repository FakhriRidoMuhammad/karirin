import { createRouter, createWebHistory } from 'vue-router'

// Lazy load components for better performance
const HomeView = () => import('../views/HomeView.vue')
const AboutView = () => import('../views/AboutView.vue')
const LoginView = () => import('../views/LoginView.vue')
const SignupView = () => import('../views/SignupView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

// Auth middleware
const requireAuth = async (to, from, next) => {
  const auth = localStorage.getItem('auth')
  if (auth) {
    next()
  } else {
    next('/login')
  }
}

const requireGuest = async (to, from, next) => {
  const auth = localStorage.getItem('auth')
  if (!auth) {
    next()
  } else {
    next('/dashboard')
  }
}

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
    // Handle /karirin/ paths
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

// Navigation guard to handle auth state changes
router.beforeEach((to, from, next) => {
  // You can add global navigation guards here if needed
  next()
})

export default router 