<template>
  <div class="pa-6">
    <v-container class="text-center">
      <v-row class="align-center" style="min-height: 80vh;">
        <v-col cols="12">
          <v-icon
            size="100"
            color="primary"
            class="mb-6"
          >
            mdi-map-marker-question
          </v-icon>
          
          <h1 class="text-h3 mb-4">Waduh, Nyasar! 😅</h1>
          
          <p class="text-h6 mb-8">
            Halaman yang kamu cari nggak ketemu nih. Yuk, balik ke jalan yang bener!
          </p>

          <v-btn
            color="primary"
            size="x-large"
            to="/"
          >
            Balik ke Beranda
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// No additional logic needed
</script> 