import { create } from 'zustand'

export type AuditType = 'launch' | 'security' | 'seo' | 'growth' | 'full'
export type BuilderUsed =
  | 'Lovable'
  | 'Bolt'
  | 'Replit'
  | 'Cursor'
  | 'Codex'
  | 'Claude'
  | 'v0'
  | 'Other'
export type YesNoUnsure = 'yes' | 'no' | 'unsure'
export type PaymentProvider = 'Stripe' | 'PayPal' | 'RevenueCat' | 'none' | 'unsure'
export type BackendUsed = 'Firebase' | 'Supabase' | 'Custom' | 'Other' | 'none' | 'unsure'
export type ProjectStatus = 'idea' | 'pre_launch' | 'launched' | 'unsure'

export interface IntakeAnswers {
  auditType: AuditType | null
  projectName: string
  websiteUrl: string
  builderUsed: BuilderUsed | null
  hasAuth: YesNoUnsure | null
  storesUserData: YesNoUnsure | null
  acceptsPayments: PaymentProvider | null
  backendUsed: BackendUsed | null
  projectStatus: ProjectStatus | null
  targetAudience: string
}

export interface IntakeState {
  step: number
  answers: IntakeAnswers
  isComplete: boolean
  setAnswer: <K extends keyof IntakeAnswers>(key: K, value: IntakeAnswers[K]) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const initialAnswers: IntakeAnswers = {
  auditType: null,
  projectName: '',
  websiteUrl: '',
  builderUsed: null,
  hasAuth: null,
  storesUserData: null,
  acceptsPayments: null,
  backendUsed: null,
  projectStatus: null,
  targetAudience: '',
}

export const useIntakeStore = create<IntakeState>((set) => ({
  step: 0,
  answers: { ...initialAnswers },
  isComplete: false,

  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),

  nextStep: () =>
    set((state) => {
      const totalSteps = 9
      const next = state.step + 1
      return {
        step: next,
        isComplete: next > totalSteps,
      }
    }),

  prevStep: () =>
    set((state) => ({
      step: Math.max(0, state.step - 1),
      isComplete: false,
    })),

  reset: () =>
    set({
      step: 0,
      answers: { ...initialAnswers },
      isComplete: false,
    }),
}))
