import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'

type Mode = 'signin' | 'signup'

export default function Auth() {
  const navigate = useNavigate()
  const { signIn, signUp, error, clearError } = useAuthStore()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
    clearError()
  }, [clearError])

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!email.trim() || !password.trim()) return

      setSubmitting(true)
      try {
        if (mode === 'signin') {
          await signIn(email, password)
        } else {
          await signUp(email, password)
        }
        navigate('/dashboard')
      } catch {
        // Error is already set in the store
      } finally {
        setSubmitting(false)
      }
    },
    [email, password, mode, signIn, signUp, navigate],
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold hal-text tracking-widest text-center">
          {mode === 'signin' ? 'WELCOME BACK.' : 'CREATE ACCOUNT.'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs text-muted-foreground tracking-widest mb-1">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors font-mono"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-muted-foreground tracking-widest mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors font-mono"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-destructive border border-destructive/30 p-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !email.trim() || !password.trim()}
            className="hal-button w-full disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitting
              ? '[ PROCESSING... ]'
              : mode === 'signin'
                ? '[ SIGN IN ]'
                : '[ CREATE ACCOUNT ]'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="text-center">
          <button
            onClick={toggleMode}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
          >
            {mode === 'signin'
              ? 'NO ACCOUNT? CREATE ONE.'
              : 'ALREADY HAVE AN ACCOUNT? SIGN IN.'}
          </button>
        </div>

        {/* Skip for demo */}
        <div className="text-center pt-4 border-t border-border">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors tracking-wider"
          >
            [ SKIP FOR NOW ]
          </button>
        </div>
      </motion.div>
    </div>
  )
}
