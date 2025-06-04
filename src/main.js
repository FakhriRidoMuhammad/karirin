import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './style.css'

// Create the app instance
const app = createApp(App)

// Initialize Pinia store
app.use(createPinia())

// Initialize router
app.use(router)

// Initialize Vuetify
app.use(vuetify)

// Mount the app
app.mount('#app')
