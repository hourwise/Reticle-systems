import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, Shield, Globe, TrendingUp, Rocket, Copy, ArrowLeft } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import type { StoredProject } from '@/lib/storage'

// ─── Pre-audit analysis ──────────────────────────────────────────

interface Finding {
  category: 'security' | 'launch' | 'seo' | 'growth'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  detail: string
  fix: string
}

function generateFindings(project: StoredProject): Finding[] {
  const findings: Finding[] = []

  // ── Security ──
  if (project.hasAuth === 'no' && project.storesUserData === 'yes') {
    findings.push({
      category: 'security',
      severity: 'critical',
      title: 'User data stored without authentication',
      detail: 'Your project stores user data but has no authentication. Anyone can potentially access or modify stored data. This is a serious privacy and security risk.',
      fix: 'Add Firebase Auth or Supabase Auth. Require login before any data read/write. Never expose database access to unauthenticated users.',
    })
  }

  if (project.hasAuth === 'unsure') {
    findings.push({
      category: 'security',
      severity: 'high',
      title: 'Authentication status unknown',
      detail: 'You indicated you are unsure whether your project uses authentication. This must be verified — unauthenticated access to user data is a critical vulnerability.',
      fix: 'Check your project for sign-up/login pages. Look for Firebase Auth, Supabase Auth, NextAuth, or Clerk in your code. If auth is missing, add it before storing any user data.',
    })
  }

  if (project.acceptsPayments && project.acceptsPayments !== 'none' && project.acceptsPayments !== 'unsure') {
    findings.push({
      category: 'security',
      severity: 'high',
      title: `Payment processing via ${project.acceptsPayments} requires server verification`,
      detail: `Your project accepts payments through ${project.acceptsPayments}. Frontend-only payment confirmation is easily bypassed. You must verify every transaction server-side via webhooks.`,
      fix: `Set up ${project.acceptsPayments} webhooks in a backend function. Never trust client-side payment success. Always verify the webhook signature before granting access or credits.`,
    })
  }

  if (project.backendUsed === 'Firebase') {
    findings.push({
      category: 'security',
      severity: 'high',
      title: 'Firebase Security Rules must be locked down',
      detail: 'Firestore databases with weak security rules allow anyone to read or write your data. Many AI builders leave rules in test mode, which is dangerous.',
      fix: 'Deploy Firebase Security Rules that enforce user ownership. Every document must have a userId field checked against request.auth.uid. Never use allow read, write: if true in production.',
    })
  }

  if (project.backendUsed === 'Supabase') {
    findings.push({
      category: 'security',
      severity: 'high',
      title: 'Supabase Row Level Security must be enabled',
      detail: 'Supabase tables without Row Level Security (RLS) expose all data to any authenticated user. Many builders forget to enable RLS and write ownership policies.',
      fix: 'Enable RLS on every table that stores user data. Add policies that restrict access to rows where user_id = auth.uid(). Never use the service-role key in frontend code.',
    })
  }

  if (project.backendUsed === 'unsure' || project.backendUsed === 'none') {
    findings.push({
      category: 'security',
      severity: 'medium',
      title: 'Backend infrastructure unknown',
      detail: 'You are unsure about your backend setup. Without understanding your data layer, you cannot assess where vulnerabilities might exist.',
      fix: 'Identify your backend: check for Firebase config, Supabase client, or custom API calls in your code. Document where data is stored and how it is accessed.',
    })
  }

  // ── Launch ──
  if (project.status === 'launched' && !project.websiteUrl) {
    findings.push({
      category: 'launch',
      severity: 'high',
      title: 'Launched project has no verified URL',
      detail: 'Your project is already launched but no website URL was provided. We cannot verify the live deployment or check for common launch issues.',
      fix: 'Provide your live URL so O.D.I.N. can scan for HTTPS, metadata, and SEO issues.',
    })
  }

  if (project.status === 'launched' || project.status === 'pre_launch') {
    findings.push({
      category: 'launch',
      severity: 'medium',
      title: 'Pre-launch checklist recommended',
      detail: 'Before launch, verify: HTTPS is enforced, environment variables are set, API keys are not in client code, error pages are customised, and analytics are tracking.',
      fix: 'Run through the launch checklist. Enable HTTPS (automatic on Vercel/Netlify). Verify your .gitignore excludes .env files. Add Google Analytics or Plausible.',
    })
  }

  if (project.status === 'idea') {
    findings.push({
      category: 'launch',
      severity: 'info',
      title: 'Project is still in the idea phase',
      detail: 'Your project has not been built yet. This is the ideal time to plan security, architecture, and growth from the start rather than retrofitting later.',
      fix: 'Use a builder (Lovable, Bolt, etc.) to create an MVP. Plan auth, database, and hosting before you start. Return for a full scan once you have a live URL.',
    })
  }

  // ── SEO ──
  if (!project.websiteUrl) {
    findings.push({
      category: 'seo',
      severity: 'info',
      title: 'No live URL to scan for SEO',
      detail: 'SEO checks require a live website. Without a URL, O.D.I.N. cannot check your meta tags, headings, robots.txt, sitemap, or Open Graph tags.',
      fix: 'Deploy your project and provide the URL. Even a Vercel or Netlify preview URL works for initial checks.',
    })
  } else {
    findings.push({
      category: 'seo',
      severity: 'medium',
      title: 'Live SEO audit pending',
      detail: `Your website (${project.websiteUrl}) is ready for a live SEO scan. O.D.I.N. will check title tags, meta descriptions, heading structure, Open Graph tags, and more.`,
      fix: 'Run a full URL audit to get detailed SEO recommendations. Ensure your page has a descriptive title, meta description, and OG tags.',
    })
  }

  // ── Growth ──
  if (!project.targetAudience) {
    findings.push({
      category: 'growth',
      severity: 'medium',
      title: 'Target audience not defined',
      detail: 'Without a clear target audience, your marketing and growth efforts will lack direction. Knowing who you are building for shapes every decision from features to messaging.',
      fix: 'Define 1-3 target user personas. Where do they hang out? What problem do they have? Write a one-sentence value proposition aimed at them.',
    })
  } else {
    findings.push({
      category: 'growth',
      severity: 'info',
      title: `Target audience: ${project.targetAudience}`,
      detail: 'You have defined your target audience. Next steps: validate demand, create a landing page aimed at this audience, and plan your launch channels.',
      fix: 'Create a simple landing page with a clear CTA. Post about your project in communities where your target audience spends time. Collect emails before launch.',
    })
  }

  if (project.builderUsed === 'Lovable' || project.builderUsed === 'Bolt') {
    findings.push({
      category: 'launch',
      severity: 'info',
      title: `${project.builderUsed}-built projects benefit from code export`,
      detail: `${project.builderUsed} is great for rapid prototyping, but the generated code may contain common patterns that need review: hardcoded URLs, missing env vars, or loose security rules.`,
      fix: 'Export your code from the builder and run a full repo scan. Move to GitHub for version control. This unlocks automatic scans and professional tooling.',
    })
  }

  return findings
}

function computeScores(project: StoredProject, findings: Finding[]) {
  let security = 70
  let launch = project.websiteUrl ? 65 : 35
  let seo = project.websiteUrl ? 40 : 10
  let growth = project.targetAudience ? 50 : 20

  for (const f of findings) {
    const penalties: Record<string, number> = { critical: 25, high: 15, medium: 8, low: 3, info: 0 }
    const penalty = penalties[f.severity] || 0
    if (f.category === 'security') security -= penalty
    if (f.category === 'launch') launch -= penalty
    if (f.category === 'seo') seo -= penalty
    if (f.category === 'growth') growth -= penalty
  }

  return {
    security: Math.max(0, Math.min(100, security)),
    launchReadiness: Math.max(0, Math.min(100, launch)),
    seo: Math.max(0, Math.min(100, seo)),
    growth: Math.max(0, Math.min(100, growth)),
  }
}

function scoreColor(s: number) {
  if (s >= 70) return 'text-green-400'
  if (s >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

function severityBadge(s: string) {
  const map: Record<string, string> = {
    critical: 'border-red-500/50 text-red-400',
    high: 'border-orange-500/50 text-orange-400',
    medium: 'border-yellow-500/50 text-yellow-400',
    low: 'border-blue-500/50 text-blue-400',
    info: 'border-muted-foreground/30 text-muted-foreground',
  }
  return map[s] || map.info
}

function catIcon(c: string) {
  switch (c) {
    case 'security': return <Shield className="w-4 h-4" />
    case 'launch': return <Rocket className="w-4 h-4" />
    case 'seo': return <Globe className="w-4 h-4" />
    case 'growth': return <TrendingUp className="w-4 h-4" />
    default: return <Info className="w-4 h-4" />
  }
}

// ─── Component ────────────────────────────────────────────────────

export default function Report() {
  const { projectId } = useParams<{ projectId: string }>()
  const { projects, loading, error } = useProjects()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const project = projects.find((p) => p.id === projectId) ?? null
  const findings = project ? generateFindings(project) : []
  const scores = project ? computeScores(project, findings) : null

  const critical = findings.filter((f) => f.severity === 'critical')
  const high = findings.filter((f) => f.severity === 'high')
  const other = findings.filter((f) => f.severity !== 'critical' && f.severity !== 'high')

  const copyPrompt = (f: Finding) => {
    const text = `You are working on my existing project. Do not rebuild the app from scratch.

Task:
${f.fix}

Issue:
${f.detail}

Rules:
- Do not place secret keys in frontend code.
- Move privileged API calls to a server-side function.
- Use environment variables for secrets.
- Do not disable authentication or weaken security rules.
- Do not change unrelated UI.
- Add a short explanation of what changed.`

    navigator.clipboard.writeText(text)
    setCopiedId(f.title)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="hal-text tracking-widest text-muted-foreground animate-pulse">LOADING REPORT...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-destructive">{error}</p>
        <Link to="/dashboard" className="hal-button">[ BACK TO DASHBOARD ]</Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <h1 className="text-3xl font-bold hal-text tracking-widest">REPORT NOT FOUND.</h1>
        <p className="text-muted-foreground">The requested project could not be located.</p>
        <Link to="/dashboard" className="hal-button">[ BACK TO DASHBOARD ]</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold hal-text tracking-widest">ASSESSMENT REPORT</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {project.name} &middot; PRE-AUDIT ASSESSMENT &middot; {new Date(project.updatedAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Scores */}
        {scores && (
          <motion.div className="report-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="report-section-title">SCORES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['security', 'launchReadiness', 'seo', 'growth'] as const).map((k) => {
                const labels = { security: 'SECURITY', launchReadiness: 'LAUNCH', seo: 'SEO', growth: 'GROWTH' }
                return (
                  <div key={k} className="text-center">
                    <div className={`text-3xl font-bold ${scoreColor(scores[k])}`}>{scores[k]}</div>
                    <div className="text-xs text-muted-foreground mt-1">{labels[k]}</div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Based on intake answers. Scores improve after a live URL or repo scan.
            </p>
          </motion.div>
        )}

        {/* Critical */}
        {critical.length > 0 && (
          <div className="report-card border-red-500/30">
            <h2 className="report-section-title text-red-400">
              <AlertTriangle className="w-4 h-4 inline mr-2" />CRITICAL BLOCKERS ({critical.length})
            </h2>
            <div className="space-y-4">
              {critical.map((f) => <FindingCard key={f.title} f={f} copiedId={copiedId} onCopy={copyPrompt} />)}
            </div>
          </div>
        )}

        {/* High */}
        {high.length > 0 && (
          <div className="report-card">
            <h2 className="report-section-title">
              <AlertTriangle className="w-4 h-4 inline mr-2 text-orange-400" />REQUIRES ATTENTION ({high.length})
            </h2>
            <div className="space-y-4">
              {high.map((f) => <FindingCard key={f.title} f={f} copiedId={copiedId} onCopy={copyPrompt} />)}
            </div>
          </div>
        )}

        {/* Other */}
        {other.length > 0 && (
          <div className="report-card">
            <h2 className="report-section-title">
              <Info className="w-4 h-4 inline mr-2" />FINDINGS &amp; RECOMMENDATIONS ({other.length})
            </h2>
            <div className="space-y-4">
              {other.map((f) => <FindingCard key={f.title} f={f} copiedId={copiedId} onCopy={copyPrompt} />)}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="report-card">
          <h2 className="report-section-title">EXECUTIVE SUMMARY</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {critical.length > 0
              ? `O.D.I.N. has identified ${critical.length} critical blocker${critical.length > 1 ? 's' : ''} that should be resolved before launch. `
              : 'No critical blockers were detected based on your intake answers. '}
            {high.length > 0
              ? `${high.length} high-severity finding${high.length > 1 ? 's' : ''} require${high.length === 1 ? 's' : ''} attention. `
              : ''}
            {project.websiteUrl
              ? 'A live URL audit will provide more detailed security and SEO analysis. '
              : 'Provide a live URL for a full automated scan covering HTTPS, meta tags, and SEO. '}
            This is a pre-audit assessment based on your intake questionnaire. A repository scan will
            detect exposed secrets, vulnerable dependencies, and misconfigurations in your actual code.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground border-t border-border pt-8 space-y-2">
          <p>
            <strong>O.D.I.N.</strong> (Optical Diagnostic &amp; Inspection Network) by Reticle Systems provides
            automated risk assessment and remediation guidance. It does not guarantee that your
            product is secure and is not a substitute for professional penetration testing, legal
            advice, or compliance review.
          </p>
          <p>
            This pre-audit is based solely on your intake answers. A live scan of your website or
            repository will produce more accurate and detailed findings.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Finding Card ─────────────────────────────────────────────────

function FindingCard({ f, copiedId, onCopy }: { f: Finding; copiedId: string | null; onCopy: (f: Finding) => void }) {
  return (
    <div className="border border-border p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {catIcon(f.category)}
          <span className={`text-xs border px-1.5 py-0.5 ${severityBadge(f.severity)}`}>{f.severity.toUpperCase()}</span>
        </div>
        <button
          onClick={() => onCopy(f)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 flex-shrink-0"
        >
          <Copy className="w-3 h-3" />
          {copiedId === f.title ? 'COPIED' : 'COPY PROMPT'}
        </button>
      </div>
      <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{f.detail}</p>
      <details className="text-xs">
        <summary className="text-muted-foreground hover:text-foreground cursor-pointer tracking-wider">[ SHOW FIX ]</summary>
        <p className="text-foreground mt-2 p-2 border border-border bg-card/50 leading-relaxed">{f.fix}</p>
      </details>
    </div>
  )
}

