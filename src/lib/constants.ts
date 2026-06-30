// Builder options
export const BUILDERS = [
  'Lovable',
  'Bolt',
  'Replit',
  'Cursor',
  'Codex',
  'Claude',
  'v0',
  'Other',
] as const

// Payment tiers
export const PRICING = {
  FREE: {
    name: 'Free teaser',
    price: 0,
    credits: 1,
    description: 'Limited URL-only scan',
  },
  BASIC: {
    name: 'Basic launch readiness',
    price: 9.99,
    credits: 10,
    description: 'Full launch readiness report',
  },
  DEEPER: {
    name: 'Deeper code audit',
    price: 29.99,
    credits: 30,
    description: 'Code and repo audit',
  },
  FULL: {
    name: 'Full launch and growth',
    price: 79.99,
    credits: 100,
    description: 'Complete audit + growth plan',
  },
} as const

// Severity levels
export const SEVERITY_LEVELS = {
  info: 'info',
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const

// Categories
export const FINDING_CATEGORIES = {
  SECRETS: 'secrets',
  ENV: 'environment',
  SUPABASE: 'supabase',
  FIREBASE: 'firebase',
  AUTH: 'authentication',
  PAYMENTS: 'payments',
  AI: 'ai',
  SEO: 'seo',
  GROWTH: 'growth',
} as const

// Feature flags
export const FEATURES = {
  PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  AI_FEATURES: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  REPO_SCAN: import.meta.env.VITE_ENABLE_REPO_SCAN === 'true',
} as const

