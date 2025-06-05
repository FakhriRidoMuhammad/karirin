<template>
  <div>
    <v-card v-for="post in posts" :key="post.id" class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-avatar size="40" class="mr-3">
          <v-img :src="post.author.avatar" />
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-medium">{{ post.author.name }}</div>
          <div class="text-caption text-grey">{{ post.createdAt }}</div>
        </div>
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-2">{{ post.content }}</p>
        <v-img
          v-if="post.image"
          :src="post.image"
          :aspect-ratio="16/9"
          cover
          class="rounded-lg"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          :color="post.liked ? 'primary' : undefined"
          @click="toggleLike(post)"
          :loading="post.likeLoading"
        >
          <v-icon :icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'" class="mr-2" />
          {{ post.likes }}
        </v-btn>
        <v-btn variant="text" @click="showComments(post)">
          <v-icon icon="mdi-comment-outline" class="mr-2" />
          {{ post.comments }}
        </v-btn>
        <v-btn variant="text">
          <v-icon icon="mdi-share-variant-outline" class="mr-2" />
          Share
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="loading" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate />
    </div>

    <div v-if="!loading && posts.length === 0" class="text-center my-4">
      <v-icon icon="mdi-post-outline" size="64" color="grey-lighten-1" />
      <div class="text-h6 mt-2">No posts yet</div>
      <div class="text-body-2 text-grey">Be the first to post something!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const posts = ref([
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: 'Just completed my first project using Vue.js! 🎉',
    image: 'https://picsum.photos/seed/1/800/400',
    createdAt: '2 hours ago',
    likes: 12,
    comments: 3,
    liked: false,
    likeLoading: false
  },
  {
    id: 2,
    author: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    content: 'Looking for a frontend developer position. Open to opportunities! 💼',
    createdAt: '5 hours ago',
    likes: 8,
    comments: 4,
    liked: true,
    likeLoading: false
  }
])

const toggleLike = async (post: any) => {
  post.likeLoading = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    post.liked = !post.liked
    post.likes += post.liked ? 1 : -1
  } finally {
    post.likeLoading = false
  }
}

const showComments = (post: any) => {
  // Implement comments display logic
  console.log('Show comments for post:', post.id)
}
</script> 