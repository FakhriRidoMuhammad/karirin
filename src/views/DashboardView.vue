<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Your Career Dashboard</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Progress Overview</v-card-title>
          <v-card-text>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :model-value="75"
              color="primary"
            >
              75%
            </v-progress-circular>
            <div class="mt-4">Current Level: Professional</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Recent Achievements</v-card-title>
          <v-list>
            <v-list-item v-for="achievement in recentAchievements" :key="achievement.id">
              <v-list-item-icon>
                <v-icon :color="achievement.color">{{ achievement.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ achievement.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ achievement.date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Upcoming Goals</v-card-title>
          <v-list>
            <v-list-item v-for="goal in upcomingGoals" :key="goal.id">
              <v-list-item-icon>
                <v-icon>mdi-flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ goal.title }}</v-list-item-title>
                <v-list-item-subtitle>Due: {{ goal.dueDate }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const recentAchievements = ref([
  {
    id: 1,
    title: 'Completed Profile',
    date: '2024-06-01',
    icon: 'mdi-account-check',
    color: 'success'
  },
  {
    id: 2,
    title: 'First Mentor Connection',
    date: '2024-06-02',
    icon: 'mdi-account-multiple',
    color: 'info'
  }
])

const upcomingGoals = ref([
  {
    id: 1,
    title: 'Complete Skill Assessment',
    dueDate: '2024-06-10'
  },
  {
    id: 2,
    title: 'Schedule Mentor Meeting',
    dueDate: '2024-06-15'
  }
])
</script> 