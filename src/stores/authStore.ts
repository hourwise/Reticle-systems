import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null

  // Actions
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  clearError: () => void
}

// Initialize the auth listener immediately
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    user: session?.user ?? null,
    session,
    loading: false,
  })
})

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string) => {
    set({ error: null })
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: error.message })
      throw error
    }
  },

  signIn: async (email: string, password: string) => {
    set({ error: null })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message })
      throw error
    }
  },

  logOut: async () => {
    set({ error: null })
    const { error } = await supabase.auth.signOut()
    if (error) {
      set({ error: error.message })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
