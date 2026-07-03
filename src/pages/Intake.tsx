import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useIntakeStore } from '@/stores/intakeStore'
import { useAuthStore } from '@/stores/authStore'
import { useProjects } from '@/hooks/useProjects'

// ─── Step definitions ────────────────────────────────────────────

interface StepDefinition {
  prompt: string
  subtext?: string
  type: 'buttons' | 'text' | 'text-optional'
  options?: { label: string; value: string }[]
  placeholder?: string
}

const STEPS: StepDefinition[] = [
  {
    prompt: 'WHAT WOULD YOU LIKE TO CHECK?',
    type: 'buttons',
    options: [
      { label: '[ LAUNCH READINESS ]', value: 'launch' },
      { label: '[ SECURITY RISKS ]', value: 'security' },
      { label: '[ SEO VISIBILITY ]', value: 'seo' },
      { label: '[ GROWTH PLAN ]', value: 'growth' },
      { label: '[ FULL REPORT ]', value: 'full' },
    ],
  },
  {
    prompt: 'WHAT IS YOUR PROJECT CALLED?',
    type: 'text',
    placeholder: 'Enter project name...',
  },
  {
    prompt: 'DOES YOUR PROJECT HAVE A LIVE WEBSITE?',
    subtext: 'Leave blank if not yet live.',
    type: 'text-optional',
    placeholder: 'https://...',
  },
  {
    prompt: 'WHAT BUILDER DID YOU USE?',
    type: 'buttons',
    options: [
      { label: 'Lovable', value: 'Lovable' },
      { label: 'Bolt', value: 'Bolt' },
      { label: 'Replit', value: 'Replit' },
      { label: 'Cursor', value: 'Cursor' },
      { label: 'Codex', value: 'Codex' },
      { label: 'Claude', value: 'Claude' },
      { label: 'v0', value: 'v0' },
      { label: 'Other', value: 'Other' },
    ],
  },
  {
    prompt: 'DOES YOUR PROJECT USE AUTHENTICATION?',
    subtext: 'Can users sign up or log in?',
    type: 'buttons',
    options: [
      { label: '[ YES ]', value: 'yes' },
      { label: '[ NO ]', value: 'no' },
      { label: '[ NOT SURE ]', value: 'unsure' },
    ],
  },
  {
    prompt: 'DOES YOUR PROJECT STORE USER DATA?',
    subtext: 'Profiles, posts, uploads, preferences, etc.',
    type: 'buttons',
    options: [
      { label: '[ YES ]', value: 'yes' },
      { label: '[ NO ]', value: 'no' },
      { label: '[ NOT SURE ]', value: 'unsure' },
    ],
  },
  {
    prompt: 'DOES YOUR PROJECT ACCEPT PAYMENTS?',
    type: 'buttons',
    options: [
      { label: '[ STRIPE ]', value: 'Stripe' },
      { label: '[ PAYPAL ]', value: 'PayPal' },
      { label: '[ REVENUECAT ]', value: 'RevenueCat' },
      { label: '[ NO PAYMENTS ]', value: 'none' },
      { label: '[ NOT SURE ]', value: 'unsure' },
    ],
  },
  {
    prompt: 'WHAT BACKEND DOES YOUR PROJECT USE?',
    type: 'buttons',
    options: [
      { label: '[ FIREBASE ]', value: 'Firebase' },
      { label: '[ SUPABASE ]', value: 'Supabase' },
      { label: '[ CUSTOM BACKEND ]', value: 'Custom' },
      { label: '[ OTHER ]', value: 'Other' },
      { label: '[ NONE ]', value: 'none' },
      { label: '[ NOT SURE ]', value: 'unsure' },
    ],
  },
  {
    prompt: "WHAT IS YOUR PROJECT'S STATUS?",
    type: 'buttons',
    options: [
      { label: '[ JUST AN IDEA ]', value: 'idea' },
      { label: '[ PRE-LAUNCH ]', value: 'pre_launch' },
      { label: '[ ALREADY LAUNCHED ]', value: 'launched' },
      { label: '[ NOT SURE ]', value: 'unsure' },
    ],
  },
  {
    prompt: 'WHO IS YOUR TARGET AUDIENCE?',
    subtext: 'Describe who will use your product.',
    type: 'text-optional',
    placeholder: 'e.g. Small business owners, indie hackers...',
  },
]

// ─── Answer key mapping to store ─────────────────────────────────

type AnswerKey =
  | 'auditType'
  | 'projectName'
  | 'websiteUrl'
  | 'builderUsed'
  | 'hasAuth'
  | 'storesUserData'
  | 'acceptsPayments'
  | 'backendUsed'
  | 'projectStatus'
  | 'targetAudience'

const ANSWER_KEYS: AnswerKey[] = [
  'auditType',
  'projectName',
  'websiteUrl',
  'builderUsed',
  'hasAuth',
  'storesUserData',
  'acceptsPayments',
  'backendUsed',
  'projectStatus',
  'targetAudience',
]

// ─── Component ────────────────────────────────────────────────────

export default function Intake() {
  const navigate = useNavigate()
  const { step, answers, setAnswer, nextStep, prevStep, isComplete, reset } =
    useIntakeStore()
  const { user } = useAuthStore()
  const { saveProject } = useProjects()

  const currentStep = STEPS[step]
  const answerKey = ANSWER_KEYS[step]
  const currentValue = answers[answerKey]

  // Text input state
  const [textValue, setTextValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null)

  // Sync text input with stored value when step changes
  useEffect(() => {
    if (!currentStep) return
    if (currentStep.type === 'text' || currentStep.type === 'text-optional') {
      setTextValue(typeof currentValue === 'string' ? currentValue : '')
    }
  }, [step, currentStep?.type, currentValue])

  // Auto-save project when intake completes
  useEffect(() => {
    if (!isComplete || !answers.projectName || savedProjectId) return

    const save = async () => {
      setSaving(true)
      try {
        const project = await saveProject({
          name: answers.projectName,
          websiteUrl: answers.websiteUrl,
          builderUsed: answers.builderUsed,
          backendUsed: answers.backendUsed,
          status: answers.projectStatus,
          auditType: answers.auditType,
          hasAuth: answers.hasAuth,
          storesUserData: answers.storesUserData,
          acceptsPayments: answers.acceptsPayments,
          targetAudience: answers.targetAudience,
        })
        setSavedProjectId(project.id)
      } catch {
        // Error surfaced via useProjects hook
      } finally {
        setSaving(false)
      }
    }

    save()
  }, [isComplete, answers, savedProjectId, saveProject])

  // ── Handlers ──────────────────────────────────────────────────

  const handleSelect = useCallback(
    (value: string) => {
      setAnswer(answerKey, value as never)
      nextStep()
    },
    [answerKey, setAnswer, nextStep],
  )

  const handleTextSubmit = useCallback(() => {
    if (currentStep.type === 'text' && !textValue.trim()) return
    setAnswer(answerKey, textValue.trim() as never)
    nextStep()
  }, [currentStep?.type, textValue, answerKey, setAnswer, nextStep])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleTextSubmit()
    },
    [handleTextSubmit],
  )

  const handleReset = useCallback(() => {
    reset()
    setTextValue('')
  }, [reset])

  const handleViewDashboard = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  // ── Completion screen ─────────────────────────────────────────

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="max-w-2xl text-center space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold hal-text tracking-widest">
            {saving ? 'SAVING...' : savedProjectId ? 'PROJECT SAVED.' : 'INTAKE COMPLETE.'}
          </h1>

          <p className="text-lg text-muted-foreground">
            {saving
              ? 'PERSISTING YOUR PROJECT DATA.'
              : 'YOUR PROJECT IS READY FOR ASSESSMENT.'}
          </p>

          {/* Summary */}
          <div className="border border-border p-6 text-left space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">NAME:</span>
              <span className="text-foreground">{answers.projectName || '\u2014'}</span>

              <span className="text-muted-foreground">CHECK TYPE:</span>
              <span className="text-foreground">{answers.auditType || '\u2014'}</span>

              <span className="text-muted-foreground">BUILDER:</span>
              <span className="text-foreground">{answers.builderUsed || '\u2014'}</span>

              <span className="text-muted-foreground">AUTH:</span>
              <span className="text-foreground">{answers.hasAuth || '\u2014'}</span>

              <span className="text-muted-foreground">USER DATA:</span>
              <span className="text-foreground">{answers.storesUserData || '\u2014'}</span>

              <span className="text-muted-foreground">PAYMENTS:</span>
              <span className="text-foreground">{answers.acceptsPayments || '\u2014'}</span>

              <span className="text-muted-foreground">BACKEND:</span>
              <span className="text-foreground">{answers.backendUsed || '\u2014'}</span>

              <span className="text-muted-foreground">STATUS:</span>
              <span className="text-foreground">{answers.projectStatus || '\u2014'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={handleViewDashboard} className="hal-button">
              [ VIEW DASHBOARD ]
            </button>
            <button onClick={handleReset} className="hal-button">
              [ START OVER ]
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Question screen ───────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress bar */}
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <span className="text-xs text-muted-foreground tracking-widest">
              STEP {step + 1} OF {STEPS.length}
            </span>
          </div>
          <div className="h-0.5 w-full bg-border">
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: `${((step) / STEPS.length) * 100}%` }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold hal-text tracking-widest leading-relaxed">
              {currentStep.prompt}
            </h2>

            {currentStep.subtext && (
              <p className="text-sm text-muted-foreground -mt-4">
                {currentStep.subtext}
              </p>
            )}

            {/* Button options */}
            {currentStep.type === 'buttons' && currentStep.options && (
              <div className="response-grid">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="hal-button text-left"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Text input */}
            {(currentStep.type === 'text' || currentStep.type === 'text-optional') && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentStep.placeholder}
                  autoFocus
                  className="flex-1 bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors font-mono"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={currentStep.type === 'text' && !textValue.trim()}
                  className="hal-button disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {currentStep.type === 'text-optional' && !textValue.trim()
                    ? '[ SKIP ]'
                    : '[ CONTINUE ]'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === step
                  ? 'bg-foreground'
                  : i < step
                    ? 'bg-muted-foreground'
                    : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


