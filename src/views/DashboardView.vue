<template>
  <div class="pa-6">
    <h1>Dashboard Kamu</h1>
    <v-card class="mt-4 pa-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <p class="text-h6">Halo, {{ userEmail }}! 👋</p>
          <p class="text-subtitle-1">Selamat datang kembali!</p>
        </div>
        <v-btn color="error" @click="handleLogout" :loading="loading">
          Keluar
        </v-btn>
      </div>
    </v-card>

    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Progress Kamu</v-card-title>
          <v-card-text>
            <p>Yuk, pantau perkembangan karier kamu di sini!</p>
            <v-progress-linear
              model-value="30"
              color="primary"
              height="25"
              striped
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Mentor Aktif</v-card-title>
          <v-card-text>
            <p>Belum ada mentor aktif nih. Yuk, cari mentor yang cocok buat kamu!</p>
            <v-btn
              color="primary"
              block
              class="mt-4"
              to="/mentors"
            >
              Cari Mentor
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Pencapaian</v-card-title>
          <v-card-text>
            <p>Kamu udah dapet {{ achievements.length }} badge nih!</p>
            <v-chip-group>
              <v-chip
                v-for="achievement in achievements"
                :key="achievement.id"
                color="primary"
              >
                {{ achievement.name }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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

// Dummy achievements data - replace with real data later
const achievements = ref([
  { id: 1, name: '🌟 Pendatang Baru' },
  { id: 2, name: '📝 Profil Lengkap' }
])

async function handleLogout() {
  try {
    loading.value = true
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Gagal keluar:', error)
  } finally {
    loading.value = false
  }
}
</script> 