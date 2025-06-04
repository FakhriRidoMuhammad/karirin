<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="text-h2 font-weight-bold mb-4">
          Karirin 🚀
        </h1>
        <p class="text-h5 mb-8">
          Platform pengembangan karir yang bikin kamu makin jago! ✨
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn
            color="primary"
            size="x-large"
            @click="handleGetStarted"
            :loading="loading"
          >
            Mulai sekarang
          </v-btn>
          <v-btn
            variant="outlined"
            size="x-large"
            to="/about"
            :disabled="loading"
          >
            Pelajari lebih lanjut
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

async function handleGetStarted() {
  loading.value = true
  
  try {
    if (authStore.isAuthenticated) {
      await router.push('/dashboard')
    } else {
      await router.push('/signup')
    }
  } finally {
    loading.value = false
  }
}
</script> 