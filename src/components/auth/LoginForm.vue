<template>
  <v-card class="mx-auto pa-6" max-width="400">
    <v-card-title class="text-h5 mb-4">
      Login to Karirin
    </v-card-title>

    <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
        :rules="[rules.required, rules.email]"
        :error-messages="errorMessage"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        required
        :rules="[rules.required, rules.password]"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-btn
        block
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!isFormValid || loading"
        class="mt-4"
      >
        Login
      </v-btn>

      <v-divider class="my-4"></v-divider>

      <v-btn
        block
        color="error"
        variant="outlined"
        @click="signInWithGoogle"
        :loading="googleLoading"
        :disabled="loading"
      >
        <v-icon start>mdi-google</v-icon>
        Continue with Google
      </v-btn>

      <v-btn
        block
        color="secondary"
        variant="outlined"
        @click="signInWithGithub"
        :loading="githubLoading"
        :disabled="loading"
        class="mt-2"
      >
        <v-icon start>mdi-github</v-icon>
        Continue with GitHub
      </v-btn>

      <div class="mt-4 text-center">
        Don't have an account?
        <router-link to="/signup" class="text-primary">Sign up</router-link>
      </div>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const githubLoading = ref(false)
const errorMessage = ref('')
const isFormValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
  password: (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
}

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    loading.value = true
    errorMessage.value = ''
    await authStore.signIn(email.value, password.value)
    router.push('/dashboard')
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

async function signInWithGoogle() {
  try {
    googleLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) throw error
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    googleLoading.value = false
  }
}

async function signInWithGithub() {
  try {
    githubLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) throw error
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    githubLoading.value = false
  }
}
</script> 