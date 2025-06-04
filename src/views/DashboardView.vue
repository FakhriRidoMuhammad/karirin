<template>
  <div class="pa-6">
    <h1>Dashboard</h1>
    <v-card class="mt-4 pa-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <p class="text-h6">Welcome, {{ userEmail }}</p>
          <p class="text-subtitle-1">You are logged in!</p>
        </div>
        <v-btn color="error" @click="handleLogout" :loading="loading">
          Logout
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const userEmail = authStore.userEmail

async function handleLogout() {
  try {
    loading.value = true
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    loading.value = false
  }
}
</script> 