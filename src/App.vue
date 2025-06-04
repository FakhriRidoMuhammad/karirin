<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import AppNavigation from '@/components/layout/AppNavigation.vue'

const authStore = useAuthStore()

// Test Supabase connection on component mount
onMounted(async () => {
  try {
    // Initialize auth state
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      authStore.user = session.user
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      authStore.user = session?.user ?? null
    })
  } catch (error: any) {
    console.error('Error initializing auth:', error.message)
  }
})
</script>

<template>
  <v-app>
    <app-navigation />
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
