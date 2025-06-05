<script setup>
// Import Vuetify components
import { ref } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const title = ref('Karirin App')
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Welcome to Karirin</v-card-title>
              <v-card-text>
                Your application content goes here.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Add your custom styles here */
</style>
