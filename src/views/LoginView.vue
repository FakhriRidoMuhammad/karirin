<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="handleSubmit">
              Login
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <router-link to="/register">Don't have an account? Register here</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    
    // Store the token
    localStorage.setItem('token', response.data.token)
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    // Handle error (you might want to show a notification here)
  }
}
</script> 