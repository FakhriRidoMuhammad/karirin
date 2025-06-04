<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title>
      <router-link to="/" class="text-white text-decoration-none">
        Karirin
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template v-if="isAuthenticated">
      <v-btn icon class="mr-2" to="/notifications">
        <v-badge
          :content="unreadNotifications"
          :value="unreadNotifications"
          color="error"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          v-bind="props"
        >
          <v-avatar color="grey" size="32">
            <v-icon>mdi-account</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <template v-if="isAuthenticated">
          <v-list-item to="/profile">
            <template v-slot:prepend>
              <v-icon>mdi-account-edit</v-icon>
            </template>
            <v-list-item-title>Edit Profil</v-list-item-title>
          </v-list-item>

          <v-list-item to="/settings">
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>Pengaturan</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout" :disabled="loading">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Keluar</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item to="/login">
            <template v-slot:prepend>
              <v-icon>mdi-login</v-icon>
            </template>
            <v-list-item-title>Masuk</v-list-item-title>
          </v-list-item>

          <v-list-item to="/signup">
            <template v-slot:prepend>
              <v-icon>mdi-account-plus</v-icon>
            </template>
            <v-list-item-title>Daftar</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    temporary
  >
    <v-list>
      <v-list-item
        to="/"
        :title="'Beranda'"
        prepend-icon="mdi-home"
      ></v-list-item>

      <template v-if="isAuthenticated">
        <v-list-item
          to="/dashboard"
          :title="'Dashboard Kamu'"
          prepend-icon="mdi-view-dashboard"
        ></v-list-item>

        <v-list-item
          to="/mentors"
          :title="'Cari Mentor'"
          prepend-icon="mdi-account-supervisor"
        ></v-list-item>

        <v-list-item
          to="/learning-paths"
          :title="'Jalur Belajar'"
          prepend-icon="mdi-road-variant"
        ></v-list-item>

        <v-list-item
          to="/achievements"
          :title="'Pencapaian Kamu'"
          prepend-icon="mdi-trophy"
        ></v-list-item>

        <v-list-item
          to="/community"
          :title="'Komunitas'"
          prepend-icon="mdi-account-group"
        ></v-list-item>
      </template>

      <v-list-item
        to="/about"
        :title="'Tentang Karirin'"
        prepend-icon="mdi-information"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(false)
const loading = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
// Dummy data - replace with real notifications count
const unreadNotifications = ref(3)

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