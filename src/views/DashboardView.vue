<template>
  <v-container>
    <dashboard-stats />
    
    <v-row>
      <v-col cols="12" md="8">
        <post-list />
      </v-col>
      <v-col cols="12" md="4">
        <user-suggestions />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import PostList from '@/components/posts/PostList.vue'
import UserSuggestions from '@/components/users/UserSuggestions.vue'
</script> 