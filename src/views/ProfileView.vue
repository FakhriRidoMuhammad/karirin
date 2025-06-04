<template>
  <div class="pa-6">
    <h1>Profil Kamu</h1>
    <v-card class="mt-4 pa-4">
      <v-form @submit.prevent="updateProfile" v-model="isFormValid">
        <v-text-field
          v-model="profile.username"
          label="Username kamu"
          required
          :rules="[rules.required, rules.username]"
          :loading="loading"
          :disabled="loading"
        ></v-text-field>

        <v-text-field
          v-model="profile.full_name"
          label="Nama Lengkap"
          :loading="loading"
          :disabled="loading"
        ></v-text-field>

        <v-text-field
          v-model="profile.career_title"
          label="Posisi/Jabatan"
          :loading="loading"
          :disabled="loading"
        ></v-text-field>

        <v-text-field
          v-model="profile.company"
          label="Perusahaan/Kampus"
          :loading="loading"
          :disabled="loading"
        ></v-text-field>

        <v-textarea
          v-model="profile.bio"
          label="Bio Singkat"
          hint="Ceritain dikit tentang kamu"
          :loading="loading"
          :disabled="loading"
        ></v-textarea>

        <v-select
          v-model="profile.career_level"
          :items="careerLevels"
          label="Level Karier"
          :loading="loading"
          :disabled="loading"
        ></v-select>

        <v-combobox
          v-model="profile.skills"
          :items="availableSkills"
          label="Skills"
          multiple
          chips
          hint="Tambahin skill yang kamu kuasai"
          :loading="loading"
          :disabled="loading"
        ></v-combobox>

        <div class="d-flex gap-4 mt-4">
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!isFormValid || loading"
          >
            Simpan Perubahan
          </v-btn>

          <v-btn
            color="error"
            variant="outlined"
            @click="resetForm"
            :disabled="loading"
          >
            Batal
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'

const authStore = useAuthStore()
const loading = ref(false)
const isFormValid = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const careerLevels = [
  'Mahasiswa',
  'Fresh Graduate',
  'Junior (1-3 tahun)',
  'Mid-Level (3-5 tahun)',
  'Senior (5+ tahun)',
  'Lead/Manager'
]

const availableSkills = [
  'JavaScript',
  'TypeScript',
  'Vue.js',
  'React',
  'Node.js',
  'Python',
  'Java',
  'SQL',
  'UI/UX Design',
  'Project Management'
]

const profile = ref({
  username: '',
  full_name: '',
  career_title: '',
  company: '',
  bio: '',
  career_level: '',
  skills: [] as string[]
})

const rules = {
  required: (v: string) => !!v || 'Wajib diisi ya!',
  username: (v: string) => /^[a-zA-Z0-9_]{3,20}$/.test(v) || 'Username harus 3-20 karakter dan cuma boleh huruf, angka, atau underscore ya'
}

onMounted(async () => {
  await fetchProfile()
})

async function fetchProfile() {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authStore.user?.id)
      .single()

    if (error) throw error
    if (data) {
      profile.value = {
        ...profile.value,
        ...data
      }
    }
  } catch (error) {
    showError('Gagal ambil data profil nih. Coba refresh ya!')
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  if (!isFormValid.value) return

  try {
    loading.value = true
    const { error } = await supabase
      .from('profiles')
      .update(profile.value)
      .eq('id', authStore.user?.id)

    if (error) throw error
    showSuccess('Profil kamu berhasil diupdate!')
  } catch (error) {
    showError('Gagal update profil nih. Coba lagi ya!')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  fetchProfile()
}

function showSuccess(message: string) {
  snackbarText.value = message
  snackbarColor.value = 'success'
  showSnackbar.value = true
}

function showError(message: string) {
  snackbarText.value = message
  snackbarColor.value = 'error'
  showSnackbar.value = true
}
</script> 