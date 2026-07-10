import { useState, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'

// ─── Types ───────────────────────────────────────────────────────

export type ProjectType = 'saas' | 'mobile_app' | 'marketplace' | 'website' | 'game' | 'api' | 'automation' | 'other'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'
export type Budget = 'none' | 'under_1k' | '1k_10k' | 'over_10k'
export type Timeline = 'weekend' | 'month' | 'quarter' | 'year'
export type Monetisation = 'subscription' | 'one_time' | 'freemium' | 'ads' | 'marketplace' | 'unsure'
export type Compliance = 'gdpr' | 'hipaa' | 'pci' | 'none'
export type DocType = 'readme' | 'idea_summary' | 'validation_report' | 'business_model' | 'budget_plan' | 'build_plan' | 'marketing_plan' | 'learning_plan' | 'source_of_truth' | 'agents' | 'env_example'

export interface IdeaAnswers {
  ideaName: string
  oneLiner: string
  problemStatement: string
  targetAudience: string
  projectType: ProjectType
  skillLevel: SkillLevel
  budget: Budget
  timeline: Timeline
  needsAuth: boolean
  needsPayments: boolean
  needsMobile: boolean
  compliance: Compliance[]
  competitors: string
  monetisation: Monetisation
  brandName: string
  extraContext: string
}

export interface GeneratedDocument {
  id: string
  docType: DocType
  filename: string
  title: string
  content: string
}

export interface ArchitectureBlueprint {
  sessionId: string
  documents: GeneratedDocument[]
}

// ─── Label maps ──────────────────────────────────────────────────

const PROJECT_LABELS: Record<ProjectType, string> = {
  saas: 'SaaS (Software as a Service)', mobile_app: 'Mobile App', marketplace: 'Marketplace',
  website: 'Website / Landing Page', game: 'Game', api: 'API / Backend Service',
  automation: 'Automation / Workflow', other: 'Other',
}
const SKILL_LABELS: Record<SkillLevel, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const BUDGET_LABELS: Record<Budget, string> = { none: 'Bootstrapped (no budget)', under_1k: 'Under £1,000', '1k_10k': '£1,000 – £10,000', over_10k: 'Over £10,000' }
const TIMELINE_LABELS: Record<Timeline, string> = { weekend: 'Weekend project', month: '1 month', quarter: '3 months', year: '6–12 months' }
const MONETISATION_LABELS: Record<Monetisation, string> = { subscription: 'Subscription (recurring)', one_time: 'One-time purchase', freemium: 'Freemium (free + paid tiers)', ads: 'Advertising', marketplace: 'Marketplace commission', unsure: 'Not yet decided' }

// ─── Stack recommender ───────────────────────────────────────────

function recommendStack(a: IdeaAnswers): string[] {
  const stack: string[] = []

  if (a.projectType === 'mobile_app' && !a.needsMobile) {
    // Just mobile
  }

  if (a.projectType === 'mobile_app') {
    stack.push('React Native + Expo')
  } else {
    stack.push('Next.js')
  }

  stack.push('TypeScript')
  stack.push('Tailwind CSS')
  stack.push('shadcn/ui')

  if (a.needsAuth || a.needsPayments) {
    stack.push('Supabase (Auth + Database + Storage)')
  } else {
    stack.push('Supabase (Database)')
  }

  if (a.needsPayments) {
    stack.push('Stripe (Payments)')
  }

  if (a.projectType === 'mobile_app') {
    stack.push('Expo EAS (Build & Deploy)')
  } else {
    stack.push('Vercel (Hosting)')
  }

  if (a.skillLevel === 'advanced' || a.budget === 'over_10k') {
    stack.push('GitHub Actions (CI/CD)')
    stack.push('Sentry (Error monitoring)')
    stack.push('PostHog (Analytics)')
  }

  return stack
}

function estimateCost(a: IdeaAnswers): { monthly: number; setup: number; breakdown: { item: string; cost: string }[] } {
  const breakdown: { item: string; cost: string }[] = []
  let monthly = 0
  let setup = 0

  // Domain
  breakdown.push({ item: 'Domain name (annual)', cost: '£10–15/year' })

  // Hosting
  if (a.projectType === 'mobile_app') {
    breakdown.push({ item: 'Expo EAS (build service)', cost: 'Free tier — $99/month for production' })
  } else {
    breakdown.push({ item: 'Vercel hosting', cost: 'Free tier — $20/month for Pro' })
  }

  // Supabase
  if (a.budget === 'none') {
    breakdown.push({ item: 'Supabase', cost: 'Free tier (500MB DB, 50,000 users)' })
  } else {
    breakdown.push({ item: 'Supabase Pro', cost: '$25/month' })
    monthly += 25
  }

  // Payments
  if (a.needsPayments) {
    breakdown.push({ item: 'Stripe fees', cost: '1.4–2.9% + 20p per transaction' })
  }

  // Monitoring (advanced)
  if (a.skillLevel === 'advanced' || a.budget === 'over_10k') {
    breakdown.push({ item: 'Sentry (error tracking)', cost: 'Free tier — $26/month for Team' })
    breakdown.push({ item: 'PostHog (analytics)', cost: 'Free tier (1M events/month)' })
  }

  // Email service
  if (a.monetisation !== 'unsure') {
    breakdown.push({ item: 'Resend / Loops (email)', cost: 'Free tier — $20/month for scale' })
  }

  if (a.budget === 'none') {
    setup = 15
    monthly = 0
  } else if (a.budget === 'under_1k') {
    setup = 15
    monthly = 25
  } else if (a.budget === '1k_10k') {
    setup = 15
    monthly = 75
  } else {
    setup = 15
    monthly = 150
  }

  return { monthly, setup, breakdown }
}

// ─── Document generators ─────────────────────────────────────────

function generateDoc(docType: DocType, filename: string, title: string, content: string): GeneratedDocument {
  return { id: crypto.randomUUID(), docType, filename, title, content }
}

function g(name: string) { return (a: IdeaAnswers) => a[name as keyof IdeaAnswers]?.toString() || '' }
function gl<K extends keyof IdeaAnswers>(map: Record<string, string>, key: K) { return (a: IdeaAnswers) => map[a[key] as string] || a[key]?.toString() || '' }

function generateReadme(a: IdeaAnswers): GeneratedDocument {
  const stack = recommendStack(a)
  const cost = estimateCost(a)
  const name = a.brandName || a.ideaName || 'my-project'

  return generateDoc('readme', 'README.md', 'README',
`# ${name}

> ${a.oneLiner}

## 🎯 What It Does

${a.problemStatement}

Built for **${a.targetAudience || 'your target audience'}**.

## 🛠️ Tech Stack

${stack.map((s) => `- **${s}**`).join('\n')}

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd ${name.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe keys

# Run locally
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
src/
  app/          # Next.js app router
  components/   # Reusable UI components
  lib/          # Utilities and config
  hooks/        # Custom React hooks
  types/        # TypeScript types
\`\`\`

## 💰 Running Costs (Estimated)

| Item | Cost |
|------|------|
${cost.breakdown.map((b) => `| ${b.item} | ${b.cost} |`).join('\n')}

**Monthly:** ~£${cost.monthly} | **Setup:** ~£${cost.setup}

## 📄 License

This project is owned by you. See LICENSE for details.

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateIdeaSummary(a: IdeaAnswers): GeneratedDocument {
  return generateDoc('idea_summary', 'idea-summary.md', 'Idea Summary',
`# ${a.brandName || a.ideaName || 'Project Idea'}

## One-Liner
> ${a.oneLiner}

## Problem
${a.problemStatement}

## Target Audience
${a.targetAudience || 'To be defined'}

## Project Type
${PROJECT_LABELS[a.projectType]}

## Key Features (Suggested)
${a.needsAuth ? '- **User accounts & authentication** — sign up, log in, profile management\n' : ''}${a.needsPayments ? '- **Payments** — ${MONETISATION_LABELS[a.monetisation]} via Stripe\n' : ''}${a.needsMobile ? '- **Mobile app** — iOS and Android via React Native\n' : '- **Web app** — responsive, works on all devices\n'}- **Core functionality** — ${a.oneLiner.split('.')[0]}

## Competitive Landscape
${a.competitors || 'No competitors identified yet — this may indicate a blue ocean or a need for more research.'}

## Monetisation
${MONETISATION_LABELS[a.monetisation]}

## Compliance Needs
${a.compliance.length === 0 || a.compliance.includes('none') ? 'No specific compliance requirements identified.' : a.compliance.map((c) => `- ${c.toUpperCase()}`).join('\n')}

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateValidationReport(a: IdeaAnswers): GeneratedDocument {
  const concerns: string[] = []
  const strengths: string[] = []

  if (!a.targetAudience) concerns.push('Target audience is not defined — this makes validation difficult.')
  if (!a.competitors) concerns.push('No competitor analysis — research competitors before building.')
  if (a.monetisation === 'unsure') concerns.push('Monetisation model is undecided — validate willingness to pay early.')
  if (a.budget === 'none') strengths.push('Bootstrapped approach keeps risk low — validate before spending.')
  if (a.targetAudience) strengths.push('Target audience is defined — you know who to talk to for validation.')
  if (a.competitors) strengths.push('Competitor awareness — you can learn from their mistakes.')

  return generateDoc('validation_report', 'validation-report.md', 'Validation Report',
`# Validation Report: ${a.brandName || a.ideaName}

## Feasibility Score: ${strengths.length >= 3 ? 'Promising' : strengths.length >= 1 ? 'Needs Validation' : 'Early Stage'}

## Strengths
${strengths.map((s) => `- ✅ ${s}`).join('\n')}

## Concerns
${concerns.map((c) => `- ⚠️ ${c}`).join('\n')}

## Recommended Validation Steps

1. **Talk to 10 potential users.** Find people in "${a.targetAudience || 'your target market'}" and ask about their problems. Do not mention your solution — just listen.
2. **Build a landing page.** A single page describing the problem and your proposed solution. Collect email signups as a signal of interest.
3. **Research competitors.** ${a.competitors ? `Analyse ${a.competitors} — what do they do well? What do users complain about?` : 'Find 3-5 competitors or alternatives. What do users currently do to solve this problem?'}
4. **Create a simple prototype.** Use Lovable, Bolt, or Replit to build a clickable prototype in a weekend. Show it to potential users for feedback.
5. **Define success metrics.** What does "validated" look like? 50 email signups? 5 paying customers? Be specific.

## Risk Profile

| Risk | Level | Mitigation |
|------|-------|------------|
| Market risk (no demand) | ${a.targetAudience ? 'Medium' : 'High'} | Talk to users before building |
| Technical risk (can not build) | ${a.skillLevel === 'beginner' ? 'Medium' : 'Low'} | Use AI builders + no-code tools |
| Financial risk (run out of money) | ${a.budget === 'none' ? 'Low' : 'Medium'} | Start with free tiers, validate first |
${a.needsPayments ? '| Payment/PCI compliance | Medium | Use Stripe — they handle PCI |' : ''}

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateBusinessModel(a: IdeaAnswers): GeneratedDocument {
  return generateDoc('business_model', 'business-model.md', 'Business Model',
`# Business Model: ${a.brandName || a.ideaName}

## Monetisation Strategy
**${MONETISATION_LABELS[a.monetisation]}**

${a.monetisation === 'subscription' ? `
### Subscription Tiers (Suggested)

| Tier | Price | Features |
|------|-------|----------|
| Starter | £9/month | Core features, 1 project |
| Pro | £29/month | Advanced features, 5 projects, priority support |
| Enterprise | £99/month | Unlimited, SSO, dedicated support |
` : a.monetisation === 'one_time' ? `
### Pricing Strategy
- Charge per project/use rather than recurring
- Consider a "lifetime" option for early adopters to generate initial revenue
- Offer bundles for higher average order value
` : a.monetisation === 'freemium' ? `
### Freemium Model
- Free tier: core functionality with usage limits
- Paid tier: unlocks limits + premium features
- Target: 5-10% free-to-paid conversion rate
` : a.monetisation === 'marketplace' ? `
### Marketplace Model
- Take a percentage of each transaction (typically 5-15%)
- Consider listing fees for premium placement
- Both sides (buyers and sellers) need value to join
` : a.monetisation === 'ads' ? `
### Advertising Model
- Requires significant traffic to generate meaningful revenue
- Consider hybrid: ads + premium ad-free tier
- Target: 10,000+ monthly active users before ads become viable
` : `
### Monetisation TBD
Validate willingness to pay before deciding on a model. Ask potential users: "Would you pay for this? How much?"
`}

## Revenue Projections (Conservative)

| Timeframe | Users | Revenue (monthly) |
|-----------|-------|-------------------|
| Month 1-3 | 0–50 | £0–500 |
| Month 4-6 | 50–200 | £500–2,000 |
| Month 7-12 | 200–1,000 | £2,000–10,000 |

*These are illustrative estimates. Actual results depend on execution, market demand, and pricing.*

## Customer Acquisition Cost (CAC) Estimate
- Content marketing (blog/SEO): £5–20 per customer
- Social/community (Reddit, Twitter): £0–10 per customer
- Paid ads: £20–100+ per customer

**Recommended:** Start with content and community. Only invest in paid ads after finding product-market fit.

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateBudgetPlan(a: IdeaAnswers): GeneratedDocument {
  const cost = estimateCost(a)

  return generateDoc('budget_plan', 'budget-plan.md', 'Budget Plan',
`# Budget Plan: ${a.brandName || a.ideaName}

## Budget Level: ${BUDGET_LABELS[a.budget]}

## Monthly Operating Costs

${cost.breakdown.map((b) => `- **${b.item}**: ${b.cost}`).join('\n')}

| Category | Monthly | Annual |
|----------|---------|--------|
| Infrastructure & Tools | £${cost.monthly} | £${cost.monthly * 12} |
| Domain | — | £15 |
| **Total** | **£${cost.monthly}** | **£${cost.monthly * 12 + 15}** |

## One-Time Setup Costs
£${cost.setup} (domain registration)

## Recommendations for ${BUDGET_LABELS[a.budget]}

${a.budget === 'none' ? `
- Use **free tiers only** — Supabase, Vercel, and Resend all have generous free plans
- No paid ads until revenue covers costs
- Use AI coding tools (Lovable, Bolt, Cursor) to build the MVP without hiring developers
- Focus entirely on validation and early users
` : a.budget === 'under_1k' ? `
- Start with free tiers, upgrade Supabase to Pro (\$25/month) when you hit limits
- Set aside £200–500 for a custom domain, professional logo, and basic branding
- Consider spending £200–300 on targeted ads to test messaging
` : a.budget === '1k_10k' ? `
- Upgrade to paid tiers from day one for reliability
- Budget £2,000–5,000 for a professional design/branding
- Consider hiring a part-time developer for complex features
- Allocate £1,000–3,000 for initial marketing
` : `
- Professional setup across all services
- Hire a developer or agency for custom features
- Significant marketing budget for launch
- Legal review of terms, privacy, and compliance
`}

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateBuildPlan(a: IdeaAnswers): GeneratedDocument {
  const stack = recommendStack(a)

  return generateDoc('build_plan', 'build-plan.md', 'Build Plan',
`# Build Plan: ${a.brandName || a.ideaName}

## Recommended Stack

${stack.map((s) => `- ${s}`).join('\n')}

## Development Phases

### Phase 1 — MVP (${TIMELINE_LABELS[a.timeline] === 'Weekend project' ? 'Weekend' : '2–4 weeks'})
${a.needsAuth ? '- [ ] Set up Supabase project and authentication\n- [ ] Create sign-up, log-in, and profile pages\n' : ''}- [ ] Build core feature: ${a.oneLiner.split('.')[0]}
- [ ] Deploy to ${a.projectType === 'mobile_app' ? 'Expo' : 'Vercel'}
- [ ] Set up custom domain
${a.needsPayments ? '- [ ] Integrate Stripe checkout and webhooks\n' : ''}

### Phase 2 — Polish (2–4 weeks)
- [ ] Improve UI/UX based on early feedback
- [ ] Add error handling and loading states
- [ ] Set up analytics (PostHog or Plausible)
- [ ] Write documentation and README
${a.compliance.includes('gdpr') ? '- [ ] Add cookie consent and privacy policy\n' : ''}

### Phase 3 — Launch (1–2 weeks)
- [ ] Run O.D.I.N. security audit
- [ ] Fix critical and high-severity findings
- [ ] Prepare launch assets (screenshots, description)
- [ ] Launch on Product Hunt, Reddit, and relevant communities

### Phase 4 — Growth (ongoing)
- [ ] Monitor analytics and user feedback
- [ ] Iterate on features based on usage data
- [ ] Build content marketing engine (blog, tutorials)
- [ ] Explore partnerships and integrations

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | ${stack[0]} | Best fit for ${PROJECT_LABELS[a.projectType]} |
| Language | TypeScript | Type safety, better IDE support |
| Auth | ${a.needsAuth ? 'Supabase Auth' : 'Not needed'} | ${a.needsAuth ? 'Free, built-in, secure' : 'No user accounts required'} |
| Database | Supabase (PostgreSQL) | Free tier, real-time, Row Level Security |
| Payments | ${a.needsPayments ? 'Stripe' : 'Not needed'} | ${a.needsPayments ? 'Industry standard, great DX' : 'No payments required'} |
| Hosting | ${a.projectType === 'mobile_app' ? 'Expo EAS' : 'Vercel'} | Free tier, automatic HTTPS, global CDN |

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateMarketingPlan(a: IdeaAnswers): GeneratedDocument {
  return generateDoc('marketing_plan', 'marketing-plan.md', 'Marketing Plan',
`# Marketing Plan: ${a.brandName || a.ideaName}

## Target Audience
${a.targetAudience || 'To be defined — update your intake with target audience details for a personalised plan.'}

## Launch Strategy

### Pre-Launch (4 weeks before)
- [ ] Create landing page with email signup
- [ ] Start building in public on Twitter/X
- [ ] Write 2–3 blog posts about the problem you are solving
- [ ] Join communities where ${a.targetAudience || 'your audience'} hangs out

### Launch Week
- [ ] Product Hunt launch (Tuesday–Thursday)
- [ ] Reddit post: "I built X to solve Y"
- [ ] Hacker News Show HN (if developer-focused)
- [ ] Email your waitlist
- [ ] Post on relevant Discord/Slack communities

### Post-Launch (ongoing)
- [ ] Weekly blog posts targeting SEO keywords
- [ ] Share customer stories and testimonials
- [ ] Engage in communities without selling
- [ ] Consider paid ads once you have proven CAC < LTV

## Content Calendar (First 4 Weeks)

| Week | Content | Channel |
|------|---------|---------|
| 1 | "${a.problemStatement.substring(0, 80)}..." — blog post | Blog, Twitter |
| 2 | "How we built ${a.brandName || 'our product'} with AI tools" | Blog, Reddit |
| 3 | "${a.targetAudience ? `Top 5 challenges ${a.targetAudience} face` : 'Industry trends post'}" | Blog, LinkedIn |
| 4 | Launch announcement + founder story | All channels |

## Key Metrics to Track
- Website visitors → signup conversion rate
- Free → paid conversion rate (if freemium)
- Customer acquisition cost (CAC)
- Monthly recurring revenue (MRR)
- Churn rate

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateLearningPlan(a: IdeaAnswers): GeneratedDocument {
  const items: string[] = []

  if (a.skillLevel === 'beginner') {
    items.push('- **Web development basics** — HTML, CSS, JavaScript fundamentals (freeCodeCamp, MDN)')
    items.push('- **React/Next.js tutorial** — Build a todo app to understand components, state, and routing')
    items.push('- **Supabase basics** — Set up a database, create tables, understand Row Level Security')
  }

  if (a.needsPayments) {
    items.push('- **Stripe integration** — Learn checkout sessions, webhooks, and payment flows')
  }

  if (a.projectType === 'mobile_app') {
    items.push('- **React Native fundamentals** — Navigation, native components, Expo workflow')
  }

  if (a.skillLevel !== 'beginner') {
    items.push('- **System design patterns** — Multi-tenant architecture, API design, caching strategies')
  }

  if (a.compliance.includes('gdpr')) {
    items.push('- **GDPR compliance** — Cookie consent, data processing agreements, right to deletion')
  }

  return generateDoc('learning_plan', 'learning-plan.md', 'Learning Plan',
`# Learning Plan: ${a.brandName || a.ideaName}

## Your Skill Level: ${SKILL_LABELS[a.skillLevel]}

## Recommended Learning Path

### Essential (do these first)
${items.join('\n')}

### Resources

| Resource | Topic | Cost |
|----------|-------|------|
| freeCodeCamp | Full-stack web development | Free |
| MDN Web Docs | HTML, CSS, JavaScript reference | Free |
| Supabase Docs | Database, Auth, Storage | Free |
| Next.js Learn | Next.js framework | Free |
| Fireship.io | Quick tutorials, concepts | Free/Paid |
| Udemy / Coursera | Structured courses | £10–50 |

### Timeline

| Week | Focus | Goal |
|------|-------|------|
| 1 | ${a.skillLevel === 'beginner' ? 'HTML/CSS/JS basics' : 'Framework refresher'} | Build a static landing page |
| 2 | React + Next.js | Build a todo app with state |
| 3 | Supabase + Auth | Add user accounts to your todo app |
| 4 | ${a.needsPayments ? 'Stripe integration' : 'Full-stack project'} | Complete a working prototype |

### Mindset
- **Build in public.** Share what you learn. It attracts users and keeps you accountable.
- **Learn by building.** Tutorials are a starting point. Real learning happens when you build your own thing.
- **Use AI as a tutor.** Tools like Cursor and Claude can explain code, suggest fixes, and accelerate learning.

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateSourceOfTruth(a: IdeaAnswers): GeneratedDocument {
  const stack = recommendStack(a)

  return generateDoc('source_of_truth', 'source-of-truth.md', 'Source of Truth',
`# Source of Truth: ${a.brandName || a.ideaName}

> **Purpose:** This document is the single canonical reference for this project. All contributors, AI agents, and future-you should read this before making changes.

## Project Identity
- **Name:** ${a.brandName || a.ideaName}
- **One-liner:** ${a.oneLiner}
- **Type:** ${PROJECT_LABELS[a.projectType]}
- **Audience:** ${a.targetAudience || 'TBD'}

## Architecture
- **Frontend:** ${stack[0]}
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend/Database:** Supabase (PostgreSQL)
${a.needsAuth ? '- **Authentication:** Supabase Auth\n' : ''}${a.needsPayments ? '- **Payments:** Stripe\n' : ''}- **Hosting:** ${a.projectType === 'mobile_app' ? 'Expo EAS' : 'Vercel'}

## Data Model (Initial)

\`\`\`sql
-- Users (managed by Supabase Auth)
-- Profiles table for extended user data
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  created_at timestamptz default now()
);
\`\`\`

## Key Decisions
- Using Supabase for auth + database (free tier, managed)
- Using ${stack[0]} for ${a.projectType === 'mobile_app' ? 'cross-platform mobile' : 'web'} development
${a.needsPayments ? '- Using Stripe for payment processing (PCI compliant)\n' : ''}- TypeScript for type safety

## Constraints
- Budget: ${BUDGET_LABELS[a.budget]}
- Timeline: ${TIMELINE_LABELS[a.timeline]}
- Skill level: ${SKILL_LABELS[a.skillLevel]}
${a.compliance.filter(c => c !== 'none').length > 0 ? `- Compliance: ${a.compliance.filter(c => c !== 'none').map(c => c.toUpperCase()).join(', ')}\n` : ''}
## Open Questions
${!a.targetAudience ? '- [ ] Define target audience more precisely\n' : ''}${a.monetisation === 'unsure' ? '- [ ] Decide on monetisation model\n' : ''}${!a.competitors ? '- [ ] Research competitors\n' : ''}- [ ] Validate problem with 10 potential users

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateAgents(a: IdeaAnswers): GeneratedDocument {
  return generateDoc('agents', 'agents.md', 'AI Agent Instructions',
`# AI Agent Instructions: ${a.brandName || a.ideaName}

> **For Cursor, Codex, Claude, and other AI coding agents.** Read this before making changes to the project.

## Project Context
${a.oneLiner}

Built for ${a.targetAudience || 'users'}.

## Rules
1. **Do not place secret keys in frontend code.** Use environment variables for all API keys, database URLs, and secrets.
2. **Use Supabase Row Level Security.** Every table that stores user data must have RLS policies. Users can only access their own data.
3. **Never trust client-side payment confirmation.** All Stripe operations must be verified server-side via webhooks.
4. **Keep the UI minimal and accessible.** Use Tailwind + shadcn/ui. Dark theme. Large tap targets.
5. **TypeScript strict mode.** No \`any\` types. Use proper interfaces.
6. **One feature at a time.** Small, focused commits. Always keep the build green.
7. **Document changes.** Update this file if the architecture, data model, or key decisions change.

## Build Commands
\`\`\`bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Lint code
npm run type-check # TypeScript check
\`\`\`

## Environment Variables
See \`.env.example\` for the full list.

## Current Stack
${recommendStack(a).map((s) => `- ${s}`).join('\n')}

## Key Files
- \`source-of-truth.md\` — canonical project reference
- \`build-plan.md\` — implementation roadmap
- \`agents.md\` — this file

---

*Generated by O.D.I.N. (Reticle Systems Idea Architect)*`)
}

function generateEnvExample(a: IdeaAnswers): GeneratedDocument {
  const vars: string[] = [
    '# Supabase',
    'NEXT_PUBLIC_SUPABASE_URL=your-supabase-url',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key',
    '',
    '# Database (if separate)',
    'DATABASE_URL=your-database-url',
  ]

  if (a.needsPayments) {
    vars.push('', '# Stripe (server-side only — NEVER expose in frontend)', 'STRIPE_SECRET_KEY=sk_test_your-key', 'STRIPE_WEBHOOK_SECRET=whsec_your-secret')
  }

  vars.push('', '# Analytics (optional)', 'NEXT_PUBLIC_POSTHOG_KEY=your-key', 'NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com')

  return generateDoc('env_example', '.env.example', 'Environment Variables Template',
    vars.join('\n'))
}

// ─── Main generator ──────────────────────────────────────────────

function generateAllDocuments(a: IdeaAnswers): GeneratedDocument[] {
  return [
    generateReadme(a),
    generateIdeaSummary(a),
    generateValidationReport(a),
    generateBusinessModel(a),
    generateBudgetPlan(a),
    generateBuildPlan(a),
    generateMarketingPlan(a),
    generateLearningPlan(a),
    generateSourceOfTruth(a),
    generateAgents(a),
    generateEnvExample(a),
  ]
}

// ─── Hook ────────────────────────────────────────────────────────

interface UseIdeaArchitectReturn {
  sessionId: string | null
  documents: GeneratedDocument[]
  generating: boolean
  error: string | null
  generate: (answers: IdeaAnswers) => Promise<void>
  reset: () => void
}

export function useIdeaArchitect(): UseIdeaArchitectReturn {
  const { user } = useAuthStore()

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<GeneratedDocument[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (answers: IdeaAnswers) => {
    if (!user) { setError('Must be signed in.'); return }
    setGenerating(true)
    setError(null)

    try {
      // Generate all documents synchronously (no AI needed for heuristic generation)
      const docs = generateAllDocuments(answers)
      const sid = crypto.randomUUID()

      setSessionId(sid)
      setDocuments(docs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }, [user])

  const reset = useCallback(() => {
    setSessionId(null)
    setDocuments([])
    setError(null)
  }, [])

  return { sessionId, documents, generating, error, generate, reset }
}
