<template>
  <v-card class="mb-4">
    <v-card-title class="text-h6">
      Statistik Aktivitas
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <div class="text-h4 mb-1">{{ stats.posts }}</div>
              <div class="text-body-2">Total Post</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <div class="text-h4 mb-1">{{ stats.followers }}</div>
              <div class="text-body-2">Followers</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <div class="text-h4 mb-1">{{ stats.following }}</div>
              <div class="text-body-2">Following</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <div class="text-h4 mb-1">{{ stats.likes }}</div>
              <div class="text-body-2">Total Likes</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock data - replace with real data from API
const stats = ref({
  posts: 42,
  followers: 128,
  following: 97,
  likes: 356
})
</script> 