<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from './plugins/supabase'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Test Supabase connection on component mount
onMounted(async () => {
  try {
    // Simple health check
    const { data, error } = await supabase.rpc('get_service_status')
    if (error) {
      console.log('Connected to Supabase, but need to set up database functions')
    } else {
      console.log('Successfully connected to Supabase!')
    }
    
    // Test auth connection
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Auth status:', session ? 'Authenticated' : 'Not authenticated')
    
    authStore.initializeAuth()
  } catch (err) {
    console.error('Error testing Supabase connection:', err.message)
  }
})
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

header {
  line-height: 1.5;
}

h1 {
  font-size: 2.6rem;
  font-weight: 700;
  color: #42b883;
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.description {
  max-width: 760px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
}
</style>
