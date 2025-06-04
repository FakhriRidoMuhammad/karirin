import { createApp } from 'vue'
<<<<<<< HEAD
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './style.css'

// Create the app instance
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app') 
=======
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
>>>>>>> origin/main
