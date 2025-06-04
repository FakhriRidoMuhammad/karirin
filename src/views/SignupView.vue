<template>
  <div class="fill-height bg-grey-lighten-4">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <signup-form />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import SignupForm from '@/components/auth/SignupForm.vue'
</script> 