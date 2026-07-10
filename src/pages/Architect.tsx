import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Copy, CheckCircle, Download, FileText, ChevronDown, Lightbulb } from 'lucide-react'
import { useIdeaArchitect, type IdeaAnswers, type ProjectType, type SkillLevel, type Budget, type Timeline, type Monetisation, type Compliance, type DocType } from '@/hooks/useIdeaArchitect'

// ─── Step definitions ────────────────────────────────────────────

interface StepDef {
  prompt: string
  subtext?: string
  type: 'buttons' | 'text' | 'text-optional' | 'multi'
  options?: { label: string; value: string }[]
  placeholder?: string
  key: keyof IdeaAnswers
}

const STEPS: StepDef[] = [
  { prompt: "WHAT'S YOUR IDEA?", subtext: 'Describe your project in one sentence.', type: 'text', placeholder: 'e.g. A habit tracker for remote workers...', key: 'oneLiner' },
  { prompt: 'WHAT PROBLEM DOES IT SOLVE?', subtext: 'Why would someone need this?', type: 'text', placeholder: 'e.g. Remote workers struggle to maintain daily routines...', key: 'problemStatement' },
  { prompt: 'WHO IS IT FOR?', subtext: 'Describe your target audience.', type: 'text-optional', placeholder: 'e.g. Remote workers, freelancers, digital nomads...', key: 'targetAudience' },
  { prompt: 'WHAT TYPE OF PROJECT?', type: 'buttons', options: [
      { label: '[ SAAS ]', value: 'saas' }, { label: '[ MOBILE APP ]', value: 'mobile_app' },
      { label: '[ MARKETPLACE ]', value: 'marketplace' }, { label: '[ WEBSITE ]', value: 'website' },
      { label: '[ GAME ]', value: 'game' }, { label: '[ API ]', value: 'api' },
      { label: '[ AUTOMATION ]', value: 'automation' }, { label: '[ OTHER ]', value: 'other' },
    ], key: 'projectType' },
  { prompt: "WHAT'S YOUR TECHNICAL SKILL LEVEL?", type: 'buttons', options: [
      { label: '[ BEGINNER — new to coding ]', value: 'beginner' },
      { label: '[ INTERMEDIATE — can build simple apps ]', value: 'intermediate' },
      { label: '[ ADVANCED — professional developer ]', value: 'advanced' },
    ], key: 'skillLevel' },
  { prompt: "WHAT'S YOUR BUDGET?", type: 'buttons', options: [
      { label: '[ BOOTSTRAPPED — no budget ]', value: 'none' },
      { label: '[ UNDER £1,000 ]', value: 'under_1k' },
      { label: '[ £1,000 – £10,000 ]', value: '1k_10k' },
      { label: '[ OVER £10,000 ]', value: 'over_10k' },
    ], key: 'budget' },
  { prompt: "WHAT'S YOUR TIMELINE?", type: 'buttons', options: [
      { label: '[ WEEKEND PROJECT ]', value: 'weekend' },
      { label: '[ 1 MONTH ]', value: 'month' },
      { label: '[ 3 MONTHS ]', value: 'quarter' },
      { label: '[ 6–12 MONTHS ]', value: 'year' },
    ], key: 'timeline' },
  { prompt: 'DO YOU NEED USER ACCOUNTS?', subtext: 'Can users sign up and log in?', type: 'buttons', options: [
      { label: '[ YES ]', value: 'yes' }, { label: '[ NO ]', value: 'no' },
    ], key: 'needsAuth' },
  { prompt: 'DO YOU NEED PAYMENTS?', subtext: 'Will users pay for your product?', type: 'buttons', options: [
      { label: '[ YES ]', value: 'yes' }, { label: '[ NO ]', value: 'no' },
    ], key: 'needsPayments' },
  { prompt: 'DO YOU NEED A MOBILE APP?', subtext: 'Or is a responsive website enough?', type: 'buttons', options: [
      { label: '[ YES — mobile app ]', value: 'yes' }, { label: '[ NO — web only ]', value: 'no' },
    ], key: 'needsMobile' },
  { prompt: 'HOW WILL YOU MAKE MONEY?', type: 'buttons', options: [
      { label: '[ SUBSCRIPTION ]', value: 'subscription' }, { label: '[ ONE-TIME PURCHASE ]', value: 'one_time' },
      { label: '[ FREEMIUM ]', value: 'freemium' }, { label: '[ ADS ]', value: 'ads' },
      { label: '[ MARKETPLACE ]', value: 'marketplace' }, { label: '[ NOT SURE YET ]', value: 'unsure' },
    ], key: 'monetisation' },
  { prompt: 'ANY COMPLIANCE REQUIREMENTS?', subtext: 'Select all that apply.', type: 'multi', options: [
      { label: '[ GDPR ]', value: 'gdpr' }, { label: '[ HIPAA ]', value: 'hipaa' },
      { label: '[ PCI DSS ]', value: 'pci' }, { label: '[ NONE ]', value: 'none' },
    ], key: 'compliance' },
  { prompt: 'ANY COMPETITORS?', subtext: 'Who else is solving this problem?', type: 'text-optional', placeholder: 'e.g. Habitica, Streaks, Coach.me...', key: 'competitors' },
  { prompt: 'GOT A NAME?', subtext: 'What would you call your product?', type: 'text-optional', placeholder: 'e.g. Routinely...', key: 'brandName' },
  { prompt: 'ANYTHING ELSE?', subtext: 'Additional context, constraints, or ideas.', type: 'text-optional', placeholder: 'e.g. I want to target the UK market first...', key: 'extraContext' },
]

const TOTAL_STEPS = STEPS.length

// ─── Component ────────────────────────────────────────────────────

const DOC_META: Record<DocType, { icon: string; label: string }> = {
  readme: { icon: '📘', label: 'README' },
  idea_summary: { icon: '💡', label: 'Idea Summary' },
  validation_report: { icon: '🔍', label: 'Validation Report' },
  business_model: { icon: '💷', label: 'Business Model' },
  budget_plan: { icon: '💰', label: 'Budget Plan' },
  build_plan: { icon: '🛠️', label: 'Build Plan' },
  marketing_plan: { icon: '📣', label: 'Marketing Plan' },
  learning_plan: { icon: '📚', label: 'Learning Plan' },
  source_of_truth: { icon: '📋', label: 'Source of Truth' },
  agents: { icon: '🤖', label: 'Agent Instructions' },
  env_example: { icon: '🔐', label: '.env.example' },
}

export default function Architect() {
  const { documents, generating, error, generate, reset } = useIdeaArchitect()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<IdeaAnswers>>({})
  const [textValue, setTextValue] = useState('')
  const [multiSelection, setMultiSelection] = useState<string[]>([])
  const [showDoc, setShowDoc] = useState<DocType | null>(null)
  const [copiedDoc, setCopiedDoc] = useState<DocType | null>(null)
  const [done, setDone] = useState(false)

  const currentStep = STEPS[step]

  // Sync text with stored value
  useEffect(() => {
    if (!currentStep) return
    const val = answers[currentStep.key]
    if (currentStep.type === 'text' || currentStep.type === 'text-optional') {
      setTextValue(typeof val === 'string' ? val : '')
    }
    if (currentStep.type === 'multi') {
      setMultiSelection(Array.isArray(val) ? val as string[] : [])
    }
  }, [step, currentStep])

  const setAnswer = useCallback((key: keyof IdeaAnswers, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleButton = useCallback((value: string) => {
    const key = currentStep.key
    if (key === 'needsAuth' || key === 'needsPayments' || key === 'needsMobile') {
      setAnswer(key, value === 'yes')
    } else if (key === 'projectType' || key === 'skillLevel' || key === 'budget' || key === 'timeline' || key === 'monetisation') {
      setAnswer(key, value)
    } else {
      setAnswer(key, value)
    }
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1)
  }, [currentStep, step, setAnswer])

  const handleText = useCallback(() => {
    if (currentStep.type === 'text' && !textValue.trim()) return
    setAnswer(currentStep.key, textValue.trim())
    setTextValue('')
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1)
  }, [currentStep, step, textValue, setAnswer])

  const handleMulti = useCallback(() => {
    if (multiSelection.length === 0) return
    setAnswer(currentStep.key, multiSelection.includes('none') ? ['none'] : multiSelection.filter((v) => v !== 'none'))
    setMultiSelection([])
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1)
  }, [currentStep, step, multiSelection, setAnswer])

  const toggleMulti = (value: string) => {
    setMultiSelection((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleGenerate = useCallback(async () => {
    await generate(answers as IdeaAnswers)
    setDone(true)
  }, [answers, generate])

  const handleCopy = (docType: DocType, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedDoc(docType)
    setTimeout(() => setCopiedDoc(null), 2000)
  }

  const handleDownloadAll = () => {
    const allContent = documents.map((d) => `# ${d.title}\n\n${d.content}`).join('\n\n---\n\n')
    const blob = new Blob([allContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(answers.brandName || answers.oneLiner || 'project').toLowerCase().replace(/\s+/g, '-')}-blueprint.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Done screen: document viewer ──────────────────────────────

  if (done && documents.length > 0) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold hal-text tracking-widest">PROJECT BLUEPRINT</h1>
              <p className="text-xs text-muted-foreground mt-1">
                {answers.brandName || answers.oneLiner} &middot; {documents.length} documents generated
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownloadAll} className="hal-button text-xs flex items-center gap-1">
                <Download className="w-3 h-3" /> [ DOWNLOAD ALL ]
              </button>
              <button onClick={reset} className="hal-button text-xs">[ START OVER ]</button>
            </div>
          </div>

          {/* Pricing note */}
          <div className="border border-border p-3 text-xs text-muted-foreground text-center">
            This blueprint was generated using heuristic templates. AI-powered deep analysis and custom build plans will be available in a future update. You own everything generated here.
          </div>

          {/* Document list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-border p-4 hover:border-foreground/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => setShowDoc(showDoc === doc.docType ? null : doc.docType)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{DOC_META[doc.docType]?.icon || '📄'}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{DOC_META[doc.docType]?.label || doc.title}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.filename}</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleCopy(doc.docType, doc.content)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {copiedDoc === doc.docType ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* Expanded preview */}
                <AnimatePresence>
                  {showDoc === doc.docType && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-3 text-[10px] text-muted-foreground bg-muted/10 p-3 max-h-64 overflow-y-auto border-t border-border whitespace-pre-wrap font-mono">
                        {doc.content}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link to="/dashboard" className="hal-button text-sm">[ BACK TO DASHBOARD ]</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Generating screen ─────────────────────────────────────────

  if (generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div className="text-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Lightbulb className="w-12 h-12 mx-auto text-yellow-400 animate-pulse" />
          <h1 className="text-2xl font-bold hal-text tracking-widest">GENERATING BLUEPRINT...</h1>
          <p className="text-sm text-muted-foreground">O.D.I.N. is analysing your idea and creating a complete project plan.</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            {['Analysing requirements...', 'Recommending tech stack...', 'Estimating costs...', 'Creating build plan...', 'Writing documentation...', 'Packaging blueprint...'].map((m, i) => (
              <motion.p key={m} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}>{m}</motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Intake flow ───────────────────────────────────────────────

  if (step >= TOTAL_STEPS) {
    // Review & generate
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-3xl font-bold hal-text tracking-widest">READY TO GENERATE.</h1>
          <p className="text-muted-foreground">Review your answers and generate your project blueprint.</p>

          <div className="border border-border p-4 text-left text-xs space-y-1 max-h-64 overflow-y-auto">
            {Object.entries(answers).map(([k, v]) => (
              <p key={k}><span className="text-muted-foreground">{k}:</span> <span className="text-foreground">{Array.isArray(v) ? (v as string[]).join(', ') : String(v)}</span></p>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => setStep(TOTAL_STEPS - 1)} className="hal-button text-sm">[ BACK ]</button>
            <button onClick={handleGenerate} className="hal-button text-sm">[ GENERATE BLUEPRINT ]</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question screen ───────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress */}
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            {step > 0 && (
              <button onClick={() => { setStep((s) => s - 1); setTextValue(''); setMultiSelection([]) }} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <span className="text-xs text-muted-foreground tracking-widest">STEP {step + 1} OF {TOTAL_STEPS}</span>
          </div>
          <div className="h-0.5 w-full bg-border">
            <motion.div className="h-full bg-foreground" initial={{ width: `${(step / TOTAL_STEPS) * 100}%` }} animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold hal-text tracking-widest leading-relaxed">{currentStep.prompt}</h2>
            {currentStep.subtext && <p className="text-sm text-muted-foreground -mt-4">{currentStep.subtext}</p>}

            {currentStep.type === 'buttons' && currentStep.options && (
              <div className="response-grid">
                {currentStep.options.map((o) => (
                  <button key={o.value} onClick={() => handleButton(o.value)} className="hal-button text-left">{o.label}</button>
                ))}
              </div>
            )}

            {(currentStep.type === 'text' || currentStep.type === 'text-optional') && (
              <div className="flex gap-3">
                <input type="text" value={textValue} onChange={(e) => setTextValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleText()} placeholder={currentStep.placeholder} autoFocus
                  className="flex-1 bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors font-mono" />
                <button onClick={handleText} disabled={currentStep.type === 'text' && !textValue.trim()} className="hal-button disabled:opacity-30 disabled:cursor-not-allowed">
                  {currentStep.type === 'text-optional' && !textValue.trim() ? '[ SKIP ]' : '[ CONTINUE ]'}
                </button>
              </div>
            )}

            {currentStep.type === 'multi' && currentStep.options && (
              <div className="space-y-3">
                <div className="response-grid">
                  {currentStep.options.map((o) => (
                    <button key={o.value} onClick={() => toggleMulti(o.value)}
                      className={`hal-button text-left ${multiSelection.includes(o.value) ? 'bg-foreground text-background' : ''}`}>{o.label}</button>
                  ))}
                </div>
                <button onClick={handleMulti} disabled={multiSelection.length === 0} className="hal-button w-full disabled:opacity-30">[ CONFIRM SELECTION ]</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-4">
          {STEPS.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-foreground' : i < step ? 'bg-muted-foreground' : 'bg-border'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
