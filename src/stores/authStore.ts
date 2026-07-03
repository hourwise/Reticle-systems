import { create } from 'zustand'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  // Actions
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  clearError: () => void
}

// Initialize the auth listener immediately
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false })
})

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string) => {
    set({ error: null })
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account'
      set({ error: message })
      throw err
    }
  },

  signIn: async (email: string, password: string) => {
    set({ error: null })
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      set({ error: message })
      throw err
    }
  },

  logOut: async () => {
    set({ error: null })
    await signOut(auth)
  },

  clearError: () => set({ error: null }),
}))
