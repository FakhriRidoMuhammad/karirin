import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { supabase } from './plugins/supabase'
import './style.css'

// Create the app instance
const app = createApp(App)

// Test Supabase connection
console.log('Testing Supabase connection...')
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth Event:', event)
  if (session) {
    console.log('Connected to Supabase')
  }
})

// Use plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app')
