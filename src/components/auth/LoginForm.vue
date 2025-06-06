<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title class="text-center pt-4 text-h5">
      Yuk, Masuk! 👋
    </v-card-title>
    
    <v-card-text>
      <v-form @submit.prevent="handleSubmit" v-model="isValid">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email kamu"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          required
          :loading="loading"
          :disabled="loading"
          class="mb-3"
        />

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          required
          :loading="loading"
          :disabled="loading"
          class="mb-4"
        />

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
        >
          {{ error }}
        </v-alert>

        <v-btn
          block
          color="primary"
          size="large"
          type="submit"
          :loading="loading"
          :disabled="!isValid || loading"
          class="mb-6"
        >
          Masuk
        </v-btn>

        <div class="text-center mb-4">
          <div class="text-body-2 text-medium-emphasis mb-2">atau masuk dengan</div>
          <div class="d-flex justify-center gap-3">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-google"
              @click="handleGoogleLogin"
              :loading="loading"
              :disabled="loading"
              density="comfortable"
              class="flex-grow-0"
              min-width="120"
            >
              Google
            </v-btn>
            <v-btn
              variant="outlined"
              prepend-icon="mdi-github"
              @click="handleGithubLogin"
              :loading="loading"
              :disabled="loading"
              density="comfortable"
              class="flex-grow-0"
              min-width="120"
            >
              GitHub
            </v-btn>
          </div>
        </div>

        <div class="text-center text-body-2">
          <span class="text-medium-emphasis">Belum punya akun? </span>
          <router-link to="/signup" class="text-decoration-none font-weight-medium">
            Daftar di sini
          </router-link>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const isValid = ref(false)

const emailRules = [
  (v: string) => !!v || 'Email harus diisi',
  (v: string) => /.+@.+\..+/.test(v) || 'Email tidak valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password harus diisi',
  (v: string) => v.length >= 6 || 'Password minimal 6 karakter'
]

async function handleSubmit() {
  if (!isValid.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    await authStore.signInWithEmail(email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Waduh, ada masalah nih. Coba lagi ya!'
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.signInWithGoogle()
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Gagal masuk dengan Google. Coba lagi ya!'
  } finally {
    loading.value = false
  }
}

async function handleGithubLogin() {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.signInWithGithub()
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Gagal masuk dengan GitHub. Coba lagi ya!'
  } finally {
    loading.value = false
  }
}
</script> 