<template>
  <div class="pa-6">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h1 class="text-h3 mb-6">Tentang Karirin</h1>
          <p class="text-h6 mb-12">
            Platform yang bikin kamu makin percaya diri dalam ngejar karier impian! 🚀
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon size="32" color="primary" class="mr-2">mdi-account-supervisor</v-icon>
              Mentoring yang Seru
            </v-card-title>
            <v-card-text>
              <p>
                Di Karirin, kamu bisa:
              </p>
              <ul class="mt-2">
                <li>Pilih mentor yang cocok sama kamu</li>
                <li>Belajar dari yang udah berpengalaman</li>
                <li>Dapet insight berharga buat kariermu</li>
                <li>Bikin jadwal mentoring yang fleksibel</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon size="32" color="primary" class="mr-2">mdi-school</v-icon>
              Belajar Sambil Main
            </v-card-title>
            <v-card-text>
              <p>
                Karirin bikin belajar jadi asik dengan:
              </p>
              <ul class="mt-2">
                <li>Sistem level yang bikin semangat</li>
                <li>Badge keren buat pencapaianmu</li>
                <li>Tantangan mingguan yang menarik</li>
                <li>Tracking progress yang gampang</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon size="32" color="primary" class="mr-2">mdi-account-group</v-icon>
              Komunitas Seru
            </v-card-title>
            <v-card-text>
              <p>
                Gabung komunitas kita dan dapetin:
              </p>
              <ul class="mt-2">
                <li>Temen-temen baru yang asik</li>
                <li>Info lowongan kerja terbaru</li>
                <li>Tips dan trik dari sesama member</li>
                <li>Event-event menarik tiap bulan</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-12">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 mb-6">Mulai Perjalanan Kariermu!</h2>
          <v-btn
            color="primary"
            size="x-large"
            to="/signup"
            v-if="!isAuthenticated"
          >
            Gabung Sekarang, Gratis! ✨
          </v-btn>
          <v-btn
            color="primary"
            size="x-large"
            to="/dashboard"
            v-else
          >
            Lanjut ke Dashboard
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style> 