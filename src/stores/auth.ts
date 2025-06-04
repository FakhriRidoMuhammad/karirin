import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async signUp(email: string, password: string) {
      try {
        this.loading = true
        this.error = null
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        return data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signIn(email: string, password: string) {
      try {
        this.loading = true
        this.error = null
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        this.user = data.user
        return data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        this.loading = true
        this.error = null
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        this.user = null
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        this.user = session?.user ?? null
        
        supabase.auth.onAuthStateChange((_event, session) => {
          this.user = session?.user ?? null
        })
      } catch (error: any) {
        this.error = error.message
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email,
  }
}) 