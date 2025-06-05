<template>
  <v-card>
    <v-card-title class="text-h6">
      Suggested Connections
    </v-card-title>
    <v-card-text class="pa-0">
      <v-list>
        <v-list-item
          v-for="user in suggestions"
          :key="user.id"
          :title="user.name"
          :subtitle="user.title"
        >
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img :src="user.avatar" />
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn
              variant="text"
              color="primary"
              :loading="user.loading"
              @click="followUser(user)"
            >
              {{ user.following ? 'Following' : 'Follow' }}
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <div v-if="loading" class="d-flex justify-center py-4">
        <v-progress-circular indeterminate />
      </div>

      <div v-if="!loading && suggestions.length === 0" class="text-center py-4">
        <v-icon icon="mdi-account-group-outline" size="48" color="grey-lighten-1" />
        <div class="text-body-2 text-grey mt-2">No suggestions available</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const suggestions = ref([
  {
    id: 1,
    name: 'Sarah Wilson',
    title: 'Frontend Developer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    following: false,
    loading: false
  },
  {
    id: 2,
    name: 'Mike Johnson',
    title: 'UI/UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=4',
    following: false,
    loading: false
  },
  {
    id: 3,
    name: 'Emily Brown',
    title: 'Full Stack Developer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    following: false,
    loading: false
  }
])

const followUser = async (user: any) => {
  user.loading = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    user.following = !user.following
  } finally {
    user.loading = false
  }
}
</script> 