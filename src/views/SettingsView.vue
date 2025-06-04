<template>
  <div class="pa-6">
    <h1>Pengaturan</h1>

    <v-card class="mt-4">
      <v-tabs v-model="activeTab">
        <v-tab value="account">Akun</v-tab>
        <v-tab value="notifications">Notifikasi</v-tab>
        <v-tab value="privacy">Privasi</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeTab">
          <!-- Account Settings -->
          <v-window-item value="account">
            <h2 class="text-h6 mb-4">Pengaturan Akun</h2>

            <v-form @submit.prevent="updateAccountSettings">
              <v-text-field
                v-model="settings.email"
                label="Email kamu"
                type="email"
                readonly
                disabled
              ></v-text-field>

              <v-btn
                color="primary"
                variant="outlined"
                @click="showChangePasswordDialog = true"
                class="mb-4"
              >
                Ganti Password
              </v-btn>

              <v-divider class="mb-4"></v-divider>

              <v-switch
                v-model="settings.twoFactorEnabled"
                label="Aktifin verifikasi 2 langkah"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-btn
                color="error"
                variant="outlined"
                @click="showDeleteDialog = true"
              >
                Hapus Akun
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Notification Settings -->
          <v-window-item value="notifications">
            <h2 class="text-h6 mb-4">Pengaturan Notifikasi</h2>

            <v-form @submit.prevent="updateNotificationSettings">
              <v-switch
                v-model="settings.emailNotifications"
                label="Kirim notifikasi ke email"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.mentorMessages"
                label="Pesan dari mentor"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.newAchievements"
                label="Badge & pencapaian baru"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.communityUpdates"
                label="Update dari komunitas"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
              >
                Simpan Pengaturan
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Privacy Settings -->
          <v-window-item value="privacy">
            <h2 class="text-h6 mb-4">Pengaturan Privasi</h2>

            <v-form @submit.prevent="updatePrivacySettings">
              <v-select
                v-model="settings.profileVisibility"
                :items="visibilityOptions"
                label="Siapa yang bisa liat profil kamu?"
                class="mb-4"
              ></v-select>

              <v-switch
                v-model="settings.showEmail"
                label="Tampilin email di profil"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.showAchievements"
                label="Tampilin pencapaian di profil"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
              >
                Simpan Pengaturan
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- Change Password Dialog -->
    <v-dialog v-model="showChangePasswordDialog" max-width="500">
      <v-card>
        <v-card-title>Ganti Password</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="changePassword" v-model="isPasswordFormValid">
            <v-text-field
              v-model="passwordForm.current"
              label="Password Sekarang"
              type="password"
              required
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="passwordForm.new"
              label="Password Baru"
              type="password"
              required
              :rules="[rules.required, rules.password]"
            ></v-text-field>

            <v-text-field
              v-model="passwordForm.confirm"
              label="Konfirmasi Password Baru"
              type="password"
              required
              :rules="[rules.required, rules.confirmPassword]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="showChangePasswordDialog = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="primary"
            @click="changePassword"
            :disabled="!isPasswordFormValid"
            :loading="loading"
          >
            Simpan Password Baru
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Account Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Yakin Mau Hapus Akun?</v-card-title>
        <v-card-text>
          <p class="mb-4">Kalau kamu hapus akun:</p>
          <ul class="mb-4">
            <li>Semua data kamu bakal dihapus</li>
            <li>Progress belajar hilang</li>
            <li>Nggak bisa diakses lagi</li>
          </ul>
          <p>Tindakan ini nggak bisa dibatalin ya!</p>

          <v-text-field
            v-model="deleteConfirmation"
            label="Ketik 'HAPUS' untuk konfirmasi"
            :rules="[rules.deleteConfirmation]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="error"
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'HAPUS'"
            :loading="loading"
          >
            Hapus Akun
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('account')
const loading = ref(false)
const showChangePasswordDialog = ref(false)
const showDeleteDialog = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const isPasswordFormValid = ref(false)
const deleteConfirmation = ref('')

const settings = ref({
  email: authStore.userEmail,
  twoFactorEnabled: false,
  emailNotifications: true,
  mentorMessages: true,
  newAchievements: true,
  communityUpdates: true,
  profileVisibility: 'public',
  showEmail: false,
  showAchievements: true
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const visibilityOptions = [
  { title: 'Semua orang', value: 'public' },
  { title: 'Cuma mentor', value: 'mentors' },
  { title: 'Privat', value: 'private' }
]

const rules = {
  required: (v: string) => !!v || 'Wajib diisi ya!',
  password: (v: string) => v.length >= 6 || 'Password minimal 6 karakter ya',
  confirmPassword: (v: string) => v === passwordForm.value.new || 'Password nggak sama nih',
  deleteConfirmation: (v: string) => v === 'HAPUS' || 'Ketik HAPUS untuk konfirmasi'
}

async function updateAccountSettings() {
  try {
    loading.value = true
    // Implement account settings update logic
    showSuccess('Pengaturan akun berhasil disimpan!')
  } catch (error) {
    showError('Gagal simpan pengaturan akun nih')
  } finally {
    loading.value = false
  }
}

async function updateNotificationSettings() {
  try {
    loading.value = true
    // Implement notification settings update logic
    showSuccess('Pengaturan notifikasi berhasil disimpan!')
  } catch (error) {
    showError('Gagal simpan pengaturan notifikasi nih')
  } finally {
    loading.value = false
  }
}

async function updatePrivacySettings() {
  try {
    loading.value = true
    // Implement privacy settings update logic
    showSuccess('Pengaturan privasi berhasil disimpan!')
  } catch (error) {
    showError('Gagal simpan pengaturan privasi nih')
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  if (!isPasswordFormValid.value) return

  try {
    loading.value = true
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    })

    if (error) throw error

    showChangePasswordDialog.value = false
    showSuccess('Password kamu berhasil diganti!')
    passwordForm.value = { current: '', new: '', confirm: '' }
  } catch (error) {
    showError('Gagal ganti password nih')
  } finally {
    loading.value = false
  }
}

async function deleteAccount() {
  if (deleteConfirmation.value !== 'HAPUS') return

  try {
    loading.value = true
    // Implement account deletion logic
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    showError('Gagal hapus akun nih')
  } finally {
    loading.value = false
  }
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