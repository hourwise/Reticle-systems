# Reticle Systems — Unified Source of Truth & Build Plan

**Version:** 1.0 Unified Consolidation  
**Date:** 4 July 2026  
**Product:** Reticle Systems  
**AI system:** ODIN — Optical Diagnostic & Inspection Network  
**First commercial wedge:** BuildProof / ODIN Review  
**Status:** Canonical build plan and source of truth  
**Purpose:** Single reference document for the founder, coding agents, review agents, and future contributors.

---

## 0. How to Use This Document

This document consolidates the existing Reticle Systems, BuildProof, Idea Architect, ODIN, security, privacy, agent rule, accessibility, maintenance, and roadmap notes into one canonical build plan.

Every future AI coding agent should read this document before changing the project. If this document conflicts with older standalone notes, this unified document takes priority unless the founder explicitly says otherwise.

### Required reading order for any agent

1. Read this unified source of truth.
2. Read `AGENT_RULES.md` if still present in the repository.
3. Read `SECURITY.md` if still present in the repository.
4. Read `README.md` to confirm current install/build commands.
5. Inspect the current repository structure before making changes.
6. Confirm which files are source files, generated files, legacy files, or build artifacts.
7. Implement one focused slice at a time.
8. Run build, lint, type-check, tests, and manual verification.
9. Update documentation when architecture, data model, security rules, or workflows change.

### Consolidated source files

| Source file | Treatment |
|---|---|
| `04_AI_Project_Maintenance.md.md` | Integrated into this unified source of truth. |
| `27_BuildProof_Product_Strategy_and_Differentiation.md` | Integrated into this unified source of truth. |
| `AGENT_RULES.md` | Integrated into this unified source of truth. |
| `BuildProof_Source_of_Truth_Build_Plan(2).md` | Integrated into this unified source of truth. |
| `development philosophy.md` | Integrated into this unified source of truth. |
| `docs hierarchy.md` | Integrated into this unified source of truth. |
| `Idea Architect — Build Plan & Technology stack.md` | Integrated into this unified source of truth. |
| `idea architect.md` | Integrated into this unified source of truth. |
| `ODIN rules.md` | Integrated into this unified source of truth. |
| `PRIVACY.md` | Integrated into this unified source of truth. |
| `README.md` | Integrated into this unified source of truth. |
| `Reticle Systems — Source of Truth.md` | Integrated into this unified source of truth. |
| `Reticle Systems Addendum — Guided Build intelligence.md` | Integrated into this unified source of truth. |
| `Reticle Systems Addendum — ODIN Voice.md` | Integrated into this unified source of truth. |
| `SECURITY.md` | Integrated into this unified source of truth. |

---

# 1. Executive Decision

Reticle Systems should be treated as the parent product platform.

ODIN is the AI orchestration and mentorship layer that powers every capability.

BuildProof should not disappear, but it should become the first focused commercial module inside Reticle Systems: the Review / Launch Readiness / Security Audit capability.

This preserves a simple early pitch while leaving room for the larger platform vision.

## 1.1 Practical positioning

For the immediate product:

> Reticle Systems helps AI-assisted builders check whether their project is safe, structured, visible, and ready to launch.

For the long-term product:

> Reticle Systems is an AI Product Engineering Platform that helps people discover, validate, architect, build, review, launch, and grow digital products.

## 1.2 Why this matters

The scanner idea is understandable in seconds:

> Upload your project. Get a launch readiness and security report.

That clarity is valuable and should not be diluted too early.

The wider platform vision should therefore evolve naturally:

1. **Reticle / BuildProof v1** — security, code quality, SEO, accessibility, performance, launch readiness.
2. **Reticle v2** — architecture review, AI planning, documentation generation.
3. **Reticle v3** — guided discovery, build plans, project packs, source-of-truth generation.
4. **Reticle v4** — full AI Product Engineering Platform powered by ODIN.

---

# 2. Mission

Reticle Systems does not merely scan code.

It creates better software builders.

The product should educate users throughout their journey, gradually introducing professional software engineering practices without overwhelming beginners.

Every feature should answer at least one of these questions:

1. **What is wrong?**
2. **Why does it matter?**
3. **How do I fix it?**
4. **What should I learn next?**

If a feature does not make the user safer, clearer, more capable, or more launch-ready, it probably does not belong in the product.

---

# 3. Product Philosophy

## 3.1 ODIN is a mentor, not a report generator

ODIN should not feel like a generic AI chatbot or a one-shot report engine.

ODIN should act as:

- product architect
- technical lead
- security reviewer
- launch readiness assessor
- growth advisor
- calm mentor for non-technical builders

ODIN should use plain English and measured wording. It should never exaggerate findings to drive conversions.

Example wording:

Poor:

> You have a SQL injection vulnerability.

Better:

> ODIN detected a pattern consistent with a potential SQL injection vulnerability that requires verification.

## 3.2 Trust before urgency

Reticle Systems must never be fear-based.

The tone should be:

- calm
- accurate
- professional
- helpful
- educational
- restrained
- precise

Never dramatic. Never salesy. Never alarmist.

## 3.3 Planning before building

Reticle Systems should not jump from vague idea to generated app.

Before build recommendations, ODIN should establish:

- user goal
- target audience
- user technical ability
- available budget
- desired timeframe
- commercial ambition
- preferred ownership model
- future expansion plans
- privacy and compliance sensitivity

## 3.4 User ownership

Users own everything produced.

Reticle Systems must avoid vendor lock-in. Every project should be exportable with:

- source code
- documentation
- database schema
- environment variable templates
- deployment instructions
- generated assets
- prompts
- project memory
- test plan
- security notes

## 3.5 Transparent pricing

Pricing is a product feature.

Every paid or credit-consuming operation should be quoted before execution. The platform must never silently consume extra credits.

If scope changes, ODIN must show a new quote before continuing.

## 3.6 Cheapest capable model first

Reticle Systems is model-agnostic. Users should not need to care which model runs unless they ask.

ODIN should select models based on:

- quality required
- reasoning complexity
- context size
- cost
- speed
- privacy sensitivity
- tool capability

Use frontier models for planning, reasoning, architecture, and review. Use cheaper models for well-scoped implementation, formatting, extraction, and repetitive generation where appropriate.

---

# 4. Product Structure

## 4.1 Company / platform

**Reticle Systems** is the product platform.

## 4.2 AI layer

**ODIN** is the AI orchestration layer.

ODIN stands for:

> Optical Diagnostic & Inspection Network

ODIN powers every product module and should become the relationship the user builds with the system.

Example product language:

- ODIN has reviewed your architecture.
- ODIN detected three security concerns.
- ODIN recommends resolving authentication ownership before launch.
- ODIN has verified your fix.

## 4.3 First wedge

**BuildProof / ODIN Review** is the first practical commercial wedge.

It covers:

- launch readiness
- security review
- code quality
- maintainability
- SEO
- accessibility
- performance
- privacy/GDPR readiness
- growth readiness

---

# 5. The Reticle Journey

The journey should not be:

```text
Scan
↓
Report
↓
Leave
```

It should be:

```text
Discover
↓
Validate
↓
Architect
↓
Build
↓
Review
↓
Repair
↓
Verify
↓
Professionalise
↓
Launch
↓
Grow
```

Every feature must fit somewhere in this journey.

## 5.1 Capability modules

### Discover

Transforms vague ideas into clearly defined project opportunities.

Outputs:

- project summary
- user goal
- target audience
- problem definition
- initial opportunity analysis
- validation questions
- risks and unknowns

### Validate

Tests whether the idea has enough evidence to continue.

Outputs:

- problem validation summary
- competitor notes
- demand evidence
- risk profile
- suggested positioning
- commercial viability rating

### Architect

Designs the solution before code is written.

Outputs:

- build plan
- source of truth
- architecture
- data model
- API outline
- service setup guide
- implementation roadmap
- testing strategy
- security strategy

### Build

Coordinates implementation using the most suitable AI agents, models, and tools.

Supports:

- web apps
- mobile apps
- SaaS tools
- marketplaces
- games
- APIs
- websites
- online stores
- automations
- documents and campaign packs

### Review

This is the initial BuildProof capability.

Analyses projects for:

- security
- performance
- accessibility
- SEO
- maintainability
- launch readiness
- architecture quality
- privacy and data handling

### Repair

Turns findings into safe action.

Outputs:

- plain-English fix explanation
- repair prompts for Codex / Claude / Gemini / Cursor / Lovable / Bolt / Replit
- developer instructions
- test checklist
- verification checklist

### Verify

Confirms whether a fix worked.

Flow:

```text
Finding detected
↓
User fixes issue
↓
User clicks “I've fixed it”
↓
ODIN rescans
↓
Confirmed or still failing
↓
Score updates
```

### Professionalise

Teaches real software practices at the right time.

Progression example:

| Level | Milestone |
|---|---|
| 1 | Project downloaded from Lovable/Bolt/Replit/etc. |
| 2 | Project stored in GitHub |
| 3 | Critical security issues resolved |
| 4 | Automatic monitoring enabled |
| 5 | Production-ready application |

### Launch

Prepares products for release.

Includes:

- deployment checklist
- production environment review
- release notes
- store/app listing support
- documentation
- privacy and terms reminders
- launch announcement support
- marketing assets

### Grow

Improves the product after launch.

Future features:

- analytics review
- roadmap management
- dependency monitoring
- weekly review scans
- SEO monitoring
- feature suggestions
- growth experiments
- user feedback analysis

---

# 6. Target Users

## 6.1 Primary users

- Non-technical founders using AI coding tools.
- Solo builders who have created an MVP.
- Vibe-coders building with Lovable, Bolt, Replit, Cursor, Claude, Codex, v0, Gemini, or similar tools.
- Creators preparing a SaaS, app, marketplace, landing page, or tool for launch.
- Small agencies building quickly for clients.

## 6.2 Secondary users

- Indie hackers.
- Startup weekend participants.
- Bootcamp students.
- Small businesses that paid for AI-generated websites/apps.
- Developers who want a plain-English pre-launch checklist.

## 6.3 User knowledge levels

ODIN should adapt to the user's technical confidence.

| Mode | User type | ODIN behaviour |
|---|---|---|
| Level 0 | Complete beginner | Simple explanations, account setup guidance, copy/paste instructions, warnings before sensitive steps. |
| Level 1 | Basic user | Guided setup steps, exact values to copy, checkpoints, troubleshooting. |
| Level 2 | Builder | Generated files, setup commands, `.env.example`, deployment checklist, optional explanations. |
| Level 3 | Developer | Concise technical instructions, architecture decisions, schema, tests, deployment notes. |
| Level 4 | Expert | Architecture pack, repository, task list, build commands, minimal hand-holding. |

---

# 7. Brand and Interface Direction

## 7.1 Brand personality

Reticle Systems should feel like professional diagnostic equipment.

It should be:

- industrial
- diagnostic
- mission-control inspired
- minimal
- calm
- trustworthy
- precise
- accessible

Avoid:

- generic SaaS gradients
- floating glass cards
- excessive AI imagery
- “powered by AI” as a selling crutch
- chaotic dashboards
- fear-based warnings
- dramatic red alerts unless genuinely critical

Think:

- Apple diagnostics
- aircraft pre-flight checks
- mission control
- HAL-inspired calm interface
- professional engineering equipment

## 7.2 UI principles

- Guided, not chat-first.
- Buttons before free text where possible.
- Plain-English questions.
- No overwhelming technical forms.
- Typewriter-style system messages can be used sparingly.
- Dark interface by default.
- Large tap targets.
- Strong keyboard navigation.
- Semantic HTML.
- Clear focus states.
- Accessible contrast.

## 7.3 Example intake flow

```text
GOOD EVENING.

I CAN ASSESS YOUR PROJECT.

WHAT WOULD YOU LIKE TO CHECK?

[ Launch readiness ]
[ Security risks ]
[ SEO visibility ]
[ Growth plan ]
[ Full report ]
```

```text
DOES YOUR PROJECT STORE USER DATA?

[ Yes ]
[ No ]
[ Not sure ]
```

```text
DOES YOUR PROJECT ACCEPT PAYMENTS?

[ Stripe ]
[ RevenueCat ]
[ PayPal ]
[ No payments ]
[ Not sure ]
```

## 7.4 Example report reveal

```text
ASSESSMENT COMPLETE.

3 launch blockers detected.
7 recommended improvements found.
Growth potential: Moderate to High.

[ View report ]
[ Generate repair prompts ]
[ Create growth plan ]
```

## 7.5 Core UI components

- `SystemPromptScreen`
- `GuidedQuestionCard`
- `TypewriterText`
- `ClickableAnswerGrid`
- `ProgressScanner`
- `ScoreDial`
- `FindingCard`
- `ReportSection`
- `RepairPromptCard`
- `UpsellCard`
- `ProjectDashboard`
- `VerificationStatusBadge`
- `ProfessionalisationLevelCard`
- `GuidedSetupChecklist`

---

# 8. Product Modules and MVP Scope

## 8.1 Immediate MVP name

**AI App Launch Readiness Check**

This keeps the first product promise clear.

## 8.2 MVP user flow

1. User lands on homepage.
2. User clicks “Check my project”.
3. User answers guided questions using buttons, not an open chat.
4. User provides some or all of:
   - live website URL
   - GitHub repo URL
   - uploaded ZIP, later phase
   - builder used
   - backend used
   - whether project uses auth
   - whether project stores user data
   - whether project handles payments
   - whether project is launched or pre-launch
   - target audience
5. User uses one limited free scan or purchases credits/report access.
6. System runs deterministic checks first.
7. System optionally runs AI summarisation and recommendations through backend only.
8. User receives a report.
9. User can generate repair prompts.
10. User can verify fixes through rescans.

## 8.3 MVP outputs

- Plain-English report.
- Technical appendix.
- “Paste this into Codex” repair prompts.
- “Paste this into Lovable/Bolt/Replit/Cursor” safe improvement prompts.
- Verification checklist.
- Growth suggestions once technical blockers are handled.

## 8.4 Free report strategy

The free report should answer:

> Is there a problem?

It should not answer:

> Exactly what is wrong and how do I fix it?

Free report may show:

- launch readiness score
- security score
- SEO score
- growth score
- issue counts
- affected categories
- high-level risk wording

Free report must not show:

- exact file paths
- line numbers
- unredacted snippets
- detailed exploit paths
- complete repair prompts
- private implementation details

## 8.5 Paid report strategy

The paid report reveals what is needed to fix the project.

Paid report includes:

- full finding explanations
- redacted evidence
- severity and impact
- repair prompts
- code-level guidance where safe
- verification checklist
- architecture suggestions
- growth advice
- next-step roadmap

## 8.6 Report disclaimer

Every report should include wording similar to:

> Reticle Systems provides automated risk assessment and remediation guidance. It does not guarantee that your product is secure and is not a substitute for professional penetration testing, legal advice, or compliance review.

---

# 9. Recommended Technology Stack

## 9.1 Current / near-term stack

The existing project notes favour:

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Zustand or lightweight Context
- Framer Motion, used sparingly

### Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Security Rules
- Firebase Storage
- Cloud Functions for Firebase
- Cloud Scheduler / scheduled Cloud Functions where useful

### Payments

- Stripe Checkout
- Stripe Customer Portal
- Stripe Webhooks
- Credit-based report system

### AI

- OpenAI API or other model providers via backend only
- Structured outputs / JSON schema validation
- AI routing layer for model choice and cost control
- AI usage logs with token and estimated cost tracking

### Scanning tools

- Gitleaks for secret detection
- Semgrep for static security scanning
- npm audit / pnpm audit for JS dependency checks
- Lighthouse for performance, accessibility, SEO, and best practices
- Custom regex rules for common AI-code mistakes
- Custom Supabase/Firebase configuration checks

### Hosting

- Vercel for frontend
- Firebase for auth, database, storage, functions
- Optional later worker host for long-running scans:
  - Fly.io
  - Render
  - Railway
  - AWS ECS/Fargate

## 9.2 Standard SaaS stack template for generated projects

For user-generated SaaS projects, ODIN may recommend:

```text
Next.js
TypeScript
Tailwind
shadcn/ui
Supabase
Stripe
Vercel
GitHub
Playwright
Sentry
PostHog
```

ODIN should explain every chosen service:

- what it is
- why the project needs it
- whether there is a free tier
- what account must be created
- what information to copy
- where to paste it
- how to test it worked
- what to do if it fails

---

# 10. High-Level Architecture

## 10.1 Initial audit architecture

```text
User
  ↓
React/Vite frontend
  ↓
Firebase Authentication
  ↓
Stripe payment / free scan credit check
  ↓
Cloud Function: create audit job
  ↓
Scanner worker
  ↓
Deterministic checks
  ↓
AI summarisation / repair plan generation
  ↓
Results stored in Firestore
  ↓
Frontend report viewer
  ↓
Verification and rescan loop
```

## 10.2 Future platform architecture

```text
User Project
  ↓
ODIN Project Memory
  ↓
Frontier Model Planner
  ↓
Structured Build Blueprint
  ↓
Task Splitter
  ↓
Queue System
  ↓
Coding Agent / Specialist Agent
  ↓
Sandboxed Runner
  ↓
Test Runner
  ↓
Reviewer Agent
  ↓
Documentation Update
  ↓
Export / Deploy / Monitor
```

## 10.3 AI call flow

```text
Deterministic findings
  ↓
Redaction layer
  ↓
Structured prompt assembly
  ↓
Backend AI call
  ↓
Schema validation
  ↓
Cost log
  ↓
Safe report storage
```

The frontend must never call AI providers directly.

## 10.4 Model routing

ODIN should route tasks by need:

| Task type | Model strategy |
|---|---|
| High-level architecture | Frontier reasoning model |
| Security judgement | Strong reasoning model + deterministic evidence |
| Plain-English rewrite | Cheaper capable model |
| Structured extraction | Cheapest reliable structured model |
| Code generation | Coding-specialised model |
| Review of generated code | Different model where practical |
| Bulk repetitive docs | Lower-cost model with templates |

---

# 11. Data Model

Use Cloud Firestore as the initial application database. Use Firestore auto IDs unless a stable external ID is required.

Every user-owned document must include `userId` equal to the Firebase Authentication UID.

## 11.1 users / profiles

```json
users/{userId} {
  "email": "string",
  "fullName": "string | null",
  "role": "user | admin",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 11.2 projects

```json
projects/{projectId} {
  "userId": "firebaseAuthUid",
  "name": "string",
  "websiteUrl": "string | null",
  "repoUrl": "string | null",
  "builderUsed": "lovable | bolt | replit | cursor | codex | claude | v0 | other | unknown",
  "backendUsed": "firebase | supabase | custom | other | none | unknown",
  "status": "idea | pre_launch | launched | unknown",
  "targetAudience": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 11.3 project answers

```json
projects/{projectId}/answers/{answerId} {
  "userId": "firebaseAuthUid",
  "questionKey": "string",
  "answerValue": "object | array | string | number | boolean | null",
  "createdAt": "timestamp"
}
```

## 11.4 credits

```json
credits/{creditId} {
  "userId": "firebaseAuthUid",
  "creditType": "free_scan | paid_report | rescan | monitoring",
  "quantity": 0,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 11.5 credit ledger

Use a ledger before paid launch. Do not rely only on mutable credit totals.

```json
creditLedger/{ledgerEntryId} {
  "userId": "firebaseAuthUid",
  "delta": 0,
  "reason": "stripe_purchase | audit_consumption | refund | admin_adjustment",
  "stripeEventId": "string | null",
  "auditJobId": "string | null",
  "createdAt": "timestamp"
}
```

## 11.6 payments

```json
payments/{paymentId} {
  "userId": "firebaseAuthUid",
  "stripeCheckoutSessionId": "string",
  "stripePaymentIntentId": "string | null",
  "stripeEventId": "string",
  "amountTotal": 0,
  "currency": "string",
  "status": "string",
  "createdAt": "timestamp"
}
```

## 11.7 audit jobs

```json
auditJobs/{auditJobId} {
  "projectId": "projectId",
  "userId": "firebaseAuthUid",
  "auditType": "url_scan | repo_scan | zip_upload",
  "status": "queued | running | completed | failed | cancelled",
  "startedAt": "timestamp | null",
  "completedAt": "timestamp | null",
  "errorMessage": "string | null",
  "createdAt": "timestamp"
}
```

## 11.8 audit findings

```json
auditFindings/{findingId} {
  "auditJobId": "auditJobId",
  "projectId": "projectId",
  "userId": "firebaseAuthUid",
  "category": "security | privacy | seo | accessibility | performance | maintainability | growth | architecture",
  "severity": "info | low | medium | high | critical",
  "title": "string",
  "explanation": "string | null",
  "filePath": "string | null",
  "lineNumber": 0,
  "redactedSnippet": "string | null",
  "fixSummary": "string | null",
  "sourceTool": "gitleaks | semgrep | lighthouse | custom | ai_review",
  "verificationStatus": "not_started | user_claimed_fixed | verified | still_failing | not_applicable",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 11.9 reports

```json
reports/{reportId} {
  "auditJobId": "auditJobId",
  "projectId": "projectId",
  "userId": "firebaseAuthUid",
  "reportJson": {},
  "plainEnglishSummary": "string | null",
  "launchReadinessScore": 0,
  "securityScore": 0,
  "privacyScore": 0,
  "seoScore": 0,
  "accessibilityScore": 0,
  "performanceScore": 0,
  "growthScore": 0,
  "createdAt": "timestamp"
}
```

## 11.10 AI usage logs

```json
aiUsageLogs/{logId} {
  "userId": "firebaseAuthUid | null",
  "projectId": "projectId | null",
  "auditJobId": "auditJobId | null",
  "provider": "string",
  "model": "string",
  "inputTokens": 0,
  "outputTokens": 0,
  "estimatedCost": 0,
  "purpose": "string",
  "createdAt": "timestamp"
}
```

## 11.11 scanner rules

```json
scannerRules/{ruleId} {
  "ruleKey": "string",
  "category": "string",
  "provider": "firebase | supabase | stripe | openai | generic | seo | accessibility",
  "regexPattern": "string | null",
  "severity": "info | low | medium | high | critical",
  "explanation": "string",
  "fixTemplate": "string",
  "enabled": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Scanner rules should be admin-managed. Normal users must not write them.

---

# 12. Firebase Security Rules Baseline

Every user-owned Firestore document must be protected by rules and by server-side ownership checks in Cloud Functions.

Baseline pattern:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function ownsExisting() {
      return signedIn() && resource.data.userId == request.auth.uid;
    }

    function ownsIncoming() {
      return signedIn() && request.resource.data.userId == request.auth.uid;
    }

    function ownsProject(projectId) {
      return signedIn()
        && get(/databases/$(database)/documents/projects/$(projectId)).data.userId == request.auth.uid;
    }

    match /users/{userId} {
      allow read, update: if signedIn() && request.auth.uid == userId;
      allow create: if signedIn() && request.auth.uid == userId;
      allow delete: if false;
    }

    match /projects/{projectId} {
      allow read, update, delete: if ownsExisting();
      allow create: if ownsIncoming();

      match /answers/{answerId} {
        allow read, update, delete: if ownsProject(projectId);
        allow create: if ownsProject(projectId) && ownsIncoming();
      }
    }

    match /credits/{creditId} {
      allow read: if ownsExisting();
      allow write: if false;
    }

    match /creditLedger/{ledgerEntryId} {
      allow read: if ownsExisting();
      allow write: if false;
    }

    match /payments/{paymentId} {
      allow read: if ownsExisting();
      allow write: if false;
    }

    match /auditJobs/{auditJobId} {
      allow read: if ownsExisting();
      allow write: if false;
    }

    match /auditFindings/{findingId} {
      allow read: if ownsExisting();
      allow write: if false;
    }

    match /reports/{reportId} {
      allow read: if ownsExisting();
      allow write: if false;
    }

    match /aiUsageLogs/{logId} {
      allow read, write: if false;
    }

    match /scannerRules/{ruleId} {
      allow read: if signedIn();
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

Security rules are not a substitute for server-side checks. Cloud Functions and workers must still verify ownership before returning private data or creating privileged records.

---

# 13. Security Policy

## 13.1 Non-negotiable principle

Reticle Systems must be safer than the projects it audits.

If Reticle Systems exposes keys, bypasses Firebase Security Rules, trusts frontend payment state, stores raw code unnecessarily, or produces unvalidated AI output, it has failed its own core promise.

## 13.2 Absolutely forbidden

- No API keys in frontend code.
- No OpenAI or other AI provider calls from the browser.
- No Firebase service account credentials in browser code.
- No Firebase Admin SDK usage in frontend code.
- No Stripe secret key in browser code.
- No committed `.env` files.
- No raw user code stored by default.
- No admin access controlled only by frontend UI.
- No report access without ownership checks.
- No payment fulfilment from frontend success pages.
- No unrestricted file uploads.
- No unvalidated AI JSON responses.
- No public Firebase Storage paths for private uploads.
- No Firestore or Storage collections without explicit security rules.
- No weakening security rules for convenience.

## 13.3 Required from day one

- TypeScript strict mode.
- Firebase Security Rules for Firestore and Storage.
- Server-side ownership checks in Cloud Functions and workers.
- Stripe webhook signature verification.
- Backend-only AI keys.
- Backend-only Firebase service account credentials.
- File upload validation.
- ZIP size limits.
- Job timeouts.
- Audit logging.
- AI cost logging.
- Error logging without exposing secrets.
- Rate limiting.
- Security headers.
- GDPR/privacy policy.
- Data deletion flow.

## 13.4 Environment variables

Only Firebase web app config may be exposed through `VITE_` variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Backend-only secrets:

```env
FIREBASE_SERVICE_ACCOUNT_JSON=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GITHUB_APP_PRIVATE_KEY=
```

Never place backend secrets in frontend bundles, logs, screenshots, reports, or client-readable config.

## 13.5 Storage safety

- Private user uploads must live under authenticated user paths such as `users/{userId}/uploads/{fileName}`.
- Users may only access paths matching their Firebase Auth UID.
- Generated reports should be readable only by the owner.
- Generated reports should be writable only by backend processes.
- Catch-all Storage rules must deny reads and writes by default.

## 13.6 Payment safety

- Never trust frontend payment success.
- Always verify Stripe webhook signatures.
- Only add credits after webhook confirmation.
- Stripe event IDs must be stored to prevent duplicate fulfilment.
- Payment-related writes must be server-only.

## 13.7 AI safety

- Redact secrets before AI calls.
- Send selected findings, not whole codebases, unless the user explicitly opts into deeper analysis.
- Use structured outputs with JSON schema validation.
- Reject invalid AI output instead of storing it.
- Log provider, model, token usage, purpose, and estimated cost.
- Do not expose unredacted secrets in reports.
- Include disclaimers on generated reports.

## 13.8 Incident response

If a security incident is discovered:

1. Disable affected features if necessary.
2. Preserve logs required for investigation.
3. Identify affected data and users.
4. Notify users or regulators where required.
5. Implement a fix.
6. Add regression tests.
7. Update security documentation.
8. Review whether ODIN should add a new scanner rule.

---

# 14. Privacy and Compliance

## 14.1 Data collected

Reticle Systems may collect:

- account information
- project metadata
- website URLs
- repository URLs
- builder/backend choices
- scan results
- redacted snippets
- payment records via Stripe
- usage and operational logs

## 14.2 Raw code handling

Raw code should be processed temporarily only.

Default approach:

```text
Upload/repo import
  ↓
Temporary isolated scan workspace
  ↓
Run deterministic scanners
  ↓
Store findings only
  ↓
Store redacted snippets only where necessary
  ↓
Delete raw code after scan
```

Raw code must not be sold, shared for unrelated use, or retained without explicit user consent.

## 14.3 Data retention

Recommended retention:

- Scan results: until deleted by user or retention policy.
- Raw code: deleted after processing unless user opts into storage.
- Payment data: retained according to Stripe/legal requirements.
- Usage/security logs: normally 90 days unless needed for incident investigation.

## 14.4 User rights

Users should be able to:

- access their data
- correct their data
- delete their account
- delete projects and reports
- export their data
- withdraw consent where applicable
- request support for privacy concerns

## 14.5 Required legal pages

Before public launch, provide:

- Privacy Policy
- Terms of Service
- Security Policy
- Responsible Disclosure / Vulnerability Reporting
- Cookie notice where needed
- Contact page

---

# 15. Scanner and Review Design

## 15.1 Deterministic checks first

Run cheap, deterministic checks before AI:

- secret scanning
- `.env` exposure checks
- dependency vulnerability checks
- framework detection
- public metadata checks
- Firebase/Supabase configuration checks
- auth pattern checks
- payment integration checks
- AI key exposure checks
- Lighthouse checks
- SEO basics
- accessibility basics

## 15.2 Initial scanner categories

### Secret checks

- API key patterns
- `.env` committed or public
- Firebase service account JSON
- Stripe secret keys
- OpenAI keys
- GitHub tokens
- Supabase service role keys

### Environment mistakes

- frontend variables containing secrets
- hardcoded service URLs where config is expected
- public debug flags
- verbose error messages

### Firebase checks

- permissive Firestore rules
- missing ownership checks
- public Storage paths
- direct privileged writes from client
- Admin SDK in frontend bundle

### Supabase checks

- exposed service role key
- missing RLS guidance
- client-side privileged access patterns
- public storage buckets for private files

### Auth checks

- missing protected routes
- insecure role checks
- admin UI-only access control
- sensitive localStorage usage

### Payment checks

- trusting frontend success pages
- missing webhook verification
- missing idempotency
- credits updated from client

### AI checks

- AI keys in browser
- unstructured AI output stored directly
- unredacted secrets sent to AI
- no AI usage/cost logs

### SEO / visibility checks

- missing title and meta description
- missing Open Graph tags
- poor headings
- broken links
- missing sitemap/robots
- weak homepage copy
- no clear audience/problem statement

### Growth checks

- unclear positioning
- weak CTA
- missing social proof
- no onboarding path
- no email capture
- no launch plan

## 15.3 Finding schema expectations

Every finding should include:

- title
- category
- severity
- evidence summary
- confidence level
- plain-English explanation
- why it matters
- suggested fix
- verification step
- source tool
- whether it is shown in free report
- whether it is unlocked in paid report

## 15.4 Confidence language

Findings must be precise about certainty.

Use:

- Confirmed
- Likely
- Possible
- Needs manual verification
- Informational

Avoid turning possible patterns into absolute claims.

---

# 16. Repair Prompt Format

Paid repair prompts should be safe, specific, and verifiable.

Template:

```md
## Repair Prompt: {findingTitle}

You are working on the project described in the Source of Truth.

### Goal
Fix the issue: {plainEnglishIssue}

### Context
{safeContext}

### Constraints
- Do not expose secrets.
- Do not weaken authentication or ownership checks.
- Do not make unrelated changes.
- Do not edit generated files unless necessary and documented.
- Preserve existing architecture where possible.

### Required Changes
1. {changeOne}
2. {changeTwo}
3. {changeThree}

### Verification
Run:

```bash
npm run type-check
npm run lint
npm run test
npm run build
```

Then manually verify:

- {manualCheckOne}
- {manualCheckTwo}

### Documentation
Update relevant documentation if the data model, security rules, API behaviour, or setup steps changed.
```

---

# 17. Verification Mode

Verification Mode is a core differentiator.

Every significant finding should support a lifecycle:

| State | Meaning |
|---|---|
| `open` | ODIN detected the issue. |
| `fix_prompt_generated` | A repair prompt was created. |
| `user_claimed_fixed` | User says the issue is fixed. |
| `rescan_queued` | Verification scan is queued. |
| `verified` | ODIN confirmed the issue is resolved. |
| `still_failing` | ODIN still detects the issue. |
| `manual_review_needed` | Automated verification cannot confidently confirm. |

Positive reinforcement matters. When a fix is verified, ODIN should clearly show progress and score improvement.

---

# 18. Professionalisation Layer

ODIN should gradually teach professional software practice.

Do not overwhelm beginners at first. Introduce practices at the right time.

## 18.1 Recommended progression

1. Project exists locally or in builder platform.
2. Project exported/downloaded safely.
3. Project stored in GitHub.
4. `.env.example` created and secrets removed.
5. Basic build command works.
6. Security blockers fixed.
7. Firebase/Supabase rules verified.
8. Stripe webhooks verified if payments exist.
9. CI added.
10. Monitoring enabled.
11. Production checklist completed.
12. Launch pack generated.

## 18.2 GitHub migration assistant

After critical issues are resolved, recommend GitHub migration.

Provide:

- builder-specific export guides
- GitHub Desktop guide
- repository setup
- `.gitignore` setup
- `.env.example` setup
- first commit guide
- connect Reticle Systems for monitoring

Unlocks:

- scans on push
- historical comparisons
- weekly reports
- monitoring
- team workflows

---

# 19. Guided Build Intelligence

ODIN should not stop after recommending a stack. It should continue guiding the user through account creation, setup, configuration, development, testing, deployment, and launch.

For every selected service, ODIN should explain:

```text
What it is
Why you need it
Whether it has a free tier
What account to create
What information to copy
Where to paste it
How to test it worked
What to do if it fails
```

## 19.1 Beginner example

```text
You need GitHub so your project has a safe source-code backup.

Create a free GitHub account.

When finished, click:
[I have created my GitHub account]
```

## 19.2 Developer example

```text
Create a new private GitHub repository.
Add the generated `.env.example`.
Do not commit `.env.local`.
Run `npm run build` before first push.
```

## 19.3 Expert example

```text
Stack selected.

Next.js + TypeScript + Tailwind + shadcn/ui
Supabase
Stripe
Vercel
GitHub
Playwright
Sentry
PostHog

[Begin]
```

---

# 20. Voice and Accessibility Layer

Voice must support accessibility first and personality second.

## 20.1 MVP accessibility requirements

- Semantic HTML.
- Keyboard navigation.
- ARIA labels where needed.
- Large tap targets.
- Clear contrast.
- Reduced motion support.
- Screen-reader friendly report structure.
- No information conveyed by colour alone.

## 20.2 Future voice features

Phase 2:

- basic text-to-speech for ODIN questions
- replay question button
- mute button

Phase 3:

- hover/focus-to-speak
- voice personality options
- guided setup narration

Phase 4:

- speech input
- conversational accessibility mode
- multilingual voice support

## 20.3 Accessibility settings

Users should be able to control:

- voice on/off
- voice speed
- voice volume
- voice style
- hover-to-speak
- reduced motion
- large text
- high contrast
- keyboard navigation
- screen-reader friendly mode

---

# 21. AI Development Philosophy

This section governs how Reticle Systems itself should be built.

## 21.1 Outcome-first, not implementation-first

Agents and users should describe success, constraints, existing architecture, and things to avoid before demanding specific implementation details.

ODIN should teach users to say:

> Here is the desired outcome, here are the constraints, here is what must not break.

rather than:

> Create class X and method Y.

## 21.2 Small steps. Always green.

Every implementation slice should follow:

```text
Plan
↓
Implement small slice
↓
Type-check
↓
Lint
↓
Test
↓
Review
↓
Document
↓
Commit
```

Avoid massive unsupervised changes.

## 21.3 Documentation before code

For larger changes, update or create the documentation first:

- source of truth
- architecture notes
- data model
- implementation checklist
- test plan

Then build against that plan.

## 21.4 Review mode and Improve mode

Reticle should include two distinct agent modes:

### Review mode

Looks for issues:

- security
- bugs
- architecture drift
- missing tests
- stale docs
- performance risks
- accessibility risks

### Improve mode

No new features. Improve the codebase:

- remove duplication
- simplify naming
- reduce complexity
- improve docs
- increase test coverage
- improve accessibility
- delete stale files
- clarify ownership

## 21.5 Self-review before implementation

Before implementation, ODIN should review its own plan:

- Have we reached the intended standard?
- What important constraints are missing?
- What could break?
- What should be tested?
- Is there a simpler implementation?

## 21.6 Multi-agent caution

Multiple parallel agents are powerful but dangerous for beginners.

ODIN should scale automatically:

| User/project complexity | Agent strategy |
|---|---|
| Beginner / small task | One worker, one reviewer. |
| Intermediate project | Planner, implementer, reviewer. |
| Large project | Multiple specialists with strict task boundaries. |
| Enterprise/later phase | Orchestrated queue with branch isolation and merge review. |

## 21.7 Maintainability over maximum generation

AI should optimise for maintainability, not the largest possible amount of generated code.

Prefer:

- fewer files when appropriate
- readable code
- simpler architecture
- fewer dependencies
- incremental evolution
- refactoring over expansion
- explicit tests
- clear ownership

---

# 22. AI Project Maintenance Standard

The project itself is part of the AI system.

Poor documentation, stale files, unclear ownership, generated artifacts, legacy code, and dirty repositories reduce AI quality regardless of the model used.

Every repository should optimise for:

- clarity
- discoverability
- ownership
- repeatability
- verification
- documentation
- recoverability

## 22.1 AI readiness

A new AI session should understand the repository within minutes.

AI should never need to guess:

- where the truth lives
- which files are generated
- which files should be edited
- how to build
- how to test
- how to deploy

## 22.2 Required AI navigation file

Every project should contain:

```text
AI_INDEX.md
```

or:

```text
ODIN_INDEX.md
```

It should include:

- project overview
- architecture summary
- directory map
- source-of-truth location
- generated folders
- build commands
- test commands
- deployment process
- documentation map

## 22.3 Preflight checklist

Before modifying code:

- Read Source of Truth.
- Read AI Index.
- Identify ownership of affected files.
- Confirm files are not generated.
- Confirm current branch.
- Understand build process.
- Understand test process.
- Review related documentation.

## 22.4 Finish gate

A task is not complete until:

- repository builds successfully
- relevant tests pass
- lint passes
- formatting passes
- documentation is updated where required
- Source of Truth updated if architecture changed
- AI Index updated if navigation changed
- no accidental generated file edits
- git working tree reviewed

If the working tree remains intentionally dirty, document why.

## 22.5 Recovery mode

Use Recovery Mode when:

- AI becomes confused
- changes sprawl across unrelated files
- generated files are edited incorrectly
- tests fail after broad modifications
- documentation and code disagree

Recovery steps:

1. Stop implementation.
2. Review git diff.
3. Identify source files vs generated files.
4. Re-read Source of Truth and AI Index.
5. Rebuild a small plan.
6. Revert unsafe or unrelated changes.
7. Continue one slice at a time.

---

# 23. Agent Rules

These rules apply to Codex, Claude Code, Gemini, ODIN agents, and human contributors.

## 23.1 Core rules

1. Do not implement features not requested in the current task.
2. Do not change the Firestore data model without updating Firebase rules, indexes, and this build plan.
3. Do not add secrets to source code.
4. Do not weaken Firebase Security Rules.
5. Do not use Firebase service account credentials or Admin SDK privileges in frontend code.
6. Do not call AI providers from the browser.
7. Do not store raw uploaded code unless explicitly required and documented.
8. Do not create public Firebase Storage paths for private uploads.
9. Do not trust frontend payment success.
10. Do not disable TypeScript strict mode.

## 23.2 Code quality rules

- Add tests or clear manual verification for every feature.
- Keep UI minimal and guided, not chat-based.
- Use structured AI outputs with JSON schema validation.
- Redact secrets before storing snippets.
- Keep functions idempotent where possible.
- Add meaningful plain-English error messages.
- Use camelCase for functions/variables.
- Use PascalCase for components.

## 23.3 Backend rules

- All endpoints/functions must check authentication unless explicitly public.
- Backend functions must perform ownership checks.
- Data modifications should be idempotent and safe to retry.
- Errors must redact secrets.
- Responses should include appropriate status codes.
- Long-running functions need timeouts and failure handling.

## 23.4 Frontend rules

- No secrets in `VITE_` variables.
- No hardcoded service URLs where config is required.
- No privileged Firestore writes directly from browser.
- No storing user passwords.
- No sensitive data in localStorage.
- No direct AI, Stripe secret, private GitHub, or admin calls from browser.

## 23.5 Testing rules

- Test security rules, ownership, and auth.
- Test error cases.
- Test rate limiting.
- Test file upload validation.
- Test payment flows with mock Stripe events.
- Test report access controls.
- Test AI schema validation.

## 23.6 Violation handling

If an agent violates these rules:

1. Stop immediately.
2. Revert only the violating changes.
3. Explain the violation.
4. Ask for guidance if needed.
5. Update the rule only if the rule is outdated and the founder approves.

---

# 24. Suggested Repository Structure

```text
reticle-systems/
  README.md
  AGENT_RULES.md
  SECURITY.md
  PRIVACY.md
  AI_INDEX.md
  .env.example
  package.json
  firebase/
    firestore.rules
    storage.rules
    firestore.indexes.json
  functions/
    src/
      index.ts
      auth/
      payments/
      audits/
      ai/
      scanners/
      webhooks/
  src/
    app/
    components/
      system/
      guided-flow/
      reports/
      dashboard/
      accessibility/
    features/
      auth/
      projects/
      intake/
      audits/
      reports/
      payments/
      verification/
      professionalisation/
    hooks/
    lib/
      firebaseClient.ts
      queryClient.ts
      routes.ts
    pages/
    styles/
    types/
  docs/
    00_Foundation/
    01_ODIN/
    02_Platform_Modules/
    03_Implementation/
    04_Future/
```

## 24.1 Recommended docs hierarchy

```text
/docs
│
├── 00_Foundation
│   ├── Vision.md
│   ├── Product_Philosophy.md
│   ├── Pricing_Principles.md
│   ├── AI_Development_Philosophy.md
│   ├── AI_Agent_Workflow.md
│   ├── Prompt_Engineering_Guide.md
│   ├── AI_Routing_Strategy.md
│   └── Technology_Roadmap.md
│
├── 01_ODIN
│   ├── ODIN_Architecture.md
│   ├── Agent_System.md
│   ├── Model_Selection.md
│   ├── Project_Memory.md
│   └── Multi_Agent_Pipeline.md
│
├── 02_Platform_Modules
│   ├── Discover.md
│   ├── Validate.md
│   ├── Architect.md
│   ├── Build.md
│   ├── Review.md
│   ├── Repair.md
│   ├── Verify.md
│   ├── Launch.md
│   └── Grow.md
│
├── 03_Implementation
│   ├── Firebase.md
│   ├── Backblaze.md
│   ├── Vercel.md
│   ├── Authentication.md
│   ├── Question_Engine.md
│   ├── Report_Generation.md
│   ├── Scanner_Workers.md
│   ├── Stripe.md
│   └── AI_Routing.md
│
└── 04_Future
    ├── MCP.md
    ├── VSCode_Extension.md
    ├── Local_Helper.md
    ├── Private_GPU_Server.md
    └── Enterprise_Edition.md
```

---

# 25. Build Phases

## Phase 0 — Setup and guardrails

Status: current project notes indicate scaffolding has started/partially completed.

Goals:

- Vite + React + TypeScript project.
- Tailwind configured.
- Router configured.
- Firebase client configured.
- Initial Firestore rules.
- Initial Storage rules.
- Initial indexes file.
- README, SECURITY, PRIVACY, AGENT_RULES.
- `.env.example` created.
- TypeScript strict mode.

Exit criteria:

- `npm run build` works.
- `npm run lint` works.
- no secrets in repo.
- Firebase config limited to safe `VITE_FIREBASE_*` values.
- rules deny unsafe access.

## Phase 1 — Landing, auth, and guided intake

Goals:

- Refined homepage.
- HAL/ODIN-inspired guided interface.
- Firebase Authentication.
- Project creation.
- Project dashboard.
- Guided question flow.
- Knowledge-level selection.
- Basic project metadata saved.

Key screens:

- Landing page.
- Auth pages.
- Dashboard.
- New project intake.
- Project summary.

Exit criteria:

- user can sign up/sign in.
- user can create a project.
- intake answers save with ownership.
- user cannot read another user's project.
- dashboard shows only owned projects.

## Phase 2 — Payments and credits

Goals:

- Stripe Checkout.
- Stripe Customer Portal.
- Webhook verification.
- Credit ledger.
- Free scan entitlement.
- Paid report unlock.

Exit criteria:

- frontend cannot grant credits.
- webhook signature is verified.
- duplicate Stripe events are idempotent.
- ledger records all credit changes.
- user sees correct credit/report access.

## Phase 3 — URL-only audit MVP

Goals:

- User submits live URL.
- Backend creates audit job.
- Worker fetches public site safely.
- Run Lighthouse/basic SEO checks.
- Run public metadata checks.
- Generate high-level report.
- Show free report safely.

Exit criteria:

- audit job lifecycle works.
- failed jobs show useful errors.
- free report reveals no sensitive implementation details.
- report is readable only by owner.

## Phase 4 — Repo/ZIP scanning

Goals:

- GitHub repo URL or OAuth import.
- ZIP upload with validation.
- Temporary isolated scan workspace.
- Gitleaks.
- Semgrep.
- dependency audit.
- framework detection.
- Firebase/Supabase checks.
- redacted findings storage.

Exit criteria:

- upload size/type limits enforced.
- raw code deleted after scan by default.
- scanner failures do not expose secrets.
- findings are redacted.
- paid report unlock gates implementation details.

## Phase 5 — Repair prompts and verification

Goals:

- Generate safe repair prompts.
- Tailor prompts to builder/tool.
- Add “I've fixed it” workflow.
- Rescan relevant checks.
- Update finding status.
- Show score improvement.

Exit criteria:

- repair prompts contain constraints and tests.
- rescan verifies where possible.
- confidence language is clear.
- unverified fixes are not marked as confirmed.

## Phase 6 — Growth plan upsell

Goals:

- SEO improvement plan.
- Landing page conversion audit.
- Social launch calendar.
- Product positioning suggestions.
- Reddit-friendly launch copy guidance.
- Email launch campaign suggestions.

Exit criteria:

- growth advice appears after technical blockers are addressed.
- advice is specific to project and audience.
- no fake market claims.

## Phase 7 — Monitoring subscription

Goals:

- Weekly security scan.
- Dependency update checks.
- SEO/Lighthouse trend checks.
- Broken link monitoring.
- Accessibility regressions.
- Weekly/monthly reports.

Exit criteria:

- scheduled jobs work.
- notifications are useful and non-spammy.
- user can cancel monitoring.
- costs are tracked.

## Phase 8 — GitHub migration assistant

Goals:

- Builder-specific export guides.
- GitHub Desktop flow.
- `.gitignore` and `.env.example` checks.
- First commit guide.
- Connect Reticle monitoring.

Exit criteria:

- beginner can follow without prior Git knowledge.
- secrets are excluded.
- repository can be rescanned.

## Phase 9 — Idea Architect / project generation

Goals:

- Idea interview.
- Project type detection.
- Feasibility report.
- Build plan generation.
- Source-of-truth generation.
- Project file pack.
- ZIP export.
- GitHub export.

Outputs:

```text
README.md
idea-summary.md
validation-report.md
business-model.md
budget-plan.md
build-plan.md
marketing-plan.md
learning-plan.md
source-of-truth.md
agents.md
.env.example
```

Exit criteria:

- generated projects include documentation and setup guides.
- user owns output.
- pricing/cost estimate shown before generation.

## Phase 10 — Remote build workspace

Goals:

- File tree viewer.
- Markdown preview.
- Code preview.
- Editable files.
- Regenerate selected file.
- Project memory panel.
- Task list.
- Export ZIP.
- Push to GitHub.
- Deploy to Vercel/Netlify/Railway.

Exit criteria:

- user can inspect generated files before export.
- no hidden lock-in.
- branch/commit history is clear.

## Phase 11 — Multi-agent build pipeline

Goals:

- Planner.
- Task splitter.
- Queue system.
- Sandboxed workers.
- Test runner.
- Reviewer agent.
- Documentation writer.
- Merge/export flow.

Agent roles:

- Product Architect
- Technical Architect
- UX Designer
- Backend Engineer
- Frontend Engineer
- Test Engineer
- Security Reviewer
- Documentation Writer
- Marketing Assistant

Exit criteria:

- all tasks are scoped.
- each task has tests.
- branches are isolated.
- review occurs before merge.
- cost is controlled.

## Phase 12 — MCP, extension, local helper, private server

Future capabilities:

- MCP connectors for GitHub, Supabase, Vercel, Stripe, Google Drive, Figma, Shopify, Wix, YouTube.
- VS Code / Open VSX extension.
- Downloadable local helper for safe file operations.
- Optional private AI coding server.
- Enterprise edition.

Do not start here. These depend on a working platform, user demand, and strong security foundations.

---

# 26. Pricing Principles

## 26.1 No surprise pricing

Before work starts, show:

- estimated credit cost
- what is included
- what is excluded
- whether AI will be used
- what happens if scope increases

## 26.2 Suggested early model

Initial options:

- One limited free scan per user/project.
- Paid full report.
- Paid repair prompt pack.
- Paid rescan bundle.
- Monitoring subscription later.
- Growth plan add-on.

## 26.3 Fixed quote model for generated projects

For Idea Architect/build generation:

```text
ODIN estimates this project pack will cost 12 credits.

Included:
✓ source of truth
✓ README
✓ database plan
✓ build plan
✓ deployment guide
✓ test checklist

Not included:
✕ full implementation
✕ deployment to production
✕ paid integrations
```

User must explicitly approve before credits are consumed.

---

# 27. Project Dashboard Model

Reticle should become project-centric.

Example dashboard:

```text
Projects

HourWise
Status: Building
Next task: Authentication review

Relief
Status: Marketing
Next task: App Store preparation

Reticle Systems
Status: Review MVP
Next task: Stripe credit system

[ New Project ]
```

Each project should contain:

- Planning
- Files
- Documentation
- ODIN Review
- Repair
- Verification
- Deployment
- Marketing
- Monitoring
- Project Memory

---

# 28. ODIN Project Memory

Each project should maintain structured memory.

Suggested memory fields:

```json
projectMemory/{projectId} {
  "userId": "firebaseAuthUid",
  "projectSummary": "string",
  "businessGoal": "string",
  "targetAudience": "string",
  "technicalStack": [],
  "constraints": [],
  "decisions": [],
  "risks": [],
  "openQuestions": [],
  "lastReviewedAt": "timestamp",
  "updatedAt": "timestamp"
}
```

ODIN should use memory to avoid asking repeated questions and to keep advice consistent.

---

# 29. Reticle Labs

Reticle Labs is a future authority-building content arm.

Possible reports:

- Top AI coding mistakes.
- Builder comparison reports.
- Weekly security trends for AI-built software.
- State of AI-built software.
- Common vulnerability patterns in vibe-coded projects.
- Launch readiness benchmarks.

Purpose:

- educate the market
- drive organic SEO
- build credibility
- create lead magnets
- reinforce Reticle as a professional diagnostic system

Reticle Labs should never disclose private user projects or identifiable scan data without explicit consent.

---

# 30. Homepage Direction

## 30.1 Early homepage promise

```text
Build fast. Launch safely.
```

or:

```text
Pre-flight checks for AI-built apps.
```

## 30.2 Subheading

```text
Reticle Systems reviews AI-built projects for launch blockers, security risks, code quality issues, SEO gaps, and growth readiness — then gives you plain-English next steps and safe repair prompts.
```

## 30.3 Primary CTA

```text
Check my project
```

## 30.4 Secondary CTA

```text
See what ODIN checks
```

## 30.5 Key benefits

- Find launch blockers before users do.
- Understand security risks in plain English.
- Generate safe repair prompts for your AI coding tool.
- Verify fixes with rescans.
- Learn professional software practices as you build.

## 30.6 Trust language

```text
ODIN does not exaggerate risk. Findings are labelled by confidence and severity, and automated checks are not a replacement for professional penetration testing.
```

---

# 31. README Quick Start

The repository README should include:

```bash
# clone
 git clone <repository-url>
 cd reticle-systems

# install
 npm install

# env
 cp .env.example .env.local

# develop
 npm run dev

# checks
 npm run lint
 npm run type-check
 npm run format
 npm run build
```

Prerequisites:

- Node.js 18+
- npm or pnpm
- Firebase project
- Stripe account for payment phases
- backend-only AI provider key for AI phases

---

# 32. Testing Checklist

## Security tests

- user cannot read another user's project
- user cannot read another user's report
- user cannot write credits
- user cannot write payments
- user cannot write findings
- user cannot access private uploads
- admin-only collections are protected

## Functional tests

- sign up/sign in/sign out
- create project
- save intake answers
- create audit job
- report appears after job completion
- failed job shows safe error
- verification status updates

## AI tests

- AI outputs validate against schema
- invalid AI output is rejected
- secrets are redacted before AI call
- cost logging works
- report disclaimer included

## Payment tests

- checkout session creation requires auth
- webhook verifies signature
- duplicate webhook is idempotent
- credit ledger updates correctly
- frontend cannot grant credits

## Upload tests

- invalid file type rejected
- oversized ZIP rejected
- path traversal blocked
- raw code deleted after scan
- findings are redacted

## UX tests

- guided flow works by keyboard
- screen reader labels are present
- reduced motion respected
- free report does not reveal paid details
- report is understandable to non-technical users

---

# 33. First Implementation Prompts

## 33.1 Prompt for Codex / coding agent: repository audit

```text
You are working on Reticle Systems.

First, read:
- README.md
- AGENT_RULES.md
- SECURITY.md
- this unified Source of Truth
- AI_INDEX.md if present

Do not implement new features yet.

Task:
Perform a repository readiness review.

Check:
1. Current folder structure against the Source of Truth.
2. Whether TypeScript strict mode is enabled.
3. Whether Firebase config is frontend-safe only.
4. Whether Firestore and Storage rules exist.
5. Whether `.env.example` exists and contains no secrets.
6. Whether build/lint/type-check scripts exist.
7. Whether generated/build artifacts are committed.
8. Whether docs are stale or contradictory.

Output:
- concise findings
- recommended fixes
- files that should not be edited
- next safest implementation slice

Do not make code changes in this pass.
```

## 33.2 Prompt for Codex: Phase 1 implementation slice

```text
You are working on Reticle Systems.

Read the unified Source of Truth, AGENT_RULES.md, SECURITY.md, and README.md first.

Task:
Implement the next small Phase 1 slice: guided project intake shell.

Requirements:
- Keep UI minimal, dark, diagnostic, and guided.
- No open chatbot box.
- Use clickable answer buttons.
- Store intake answers only for the authenticated owner.
- Do not add payments.
- Do not add scanner workers.
- Do not call AI.
- Do not weaken Firebase rules.

Deliver:
1. Intake route/page.
2. Question component.
3. Answer state handling.
4. Project metadata save path.
5. Clear manual verification steps.
6. Any required tests.

Run:
- npm run type-check
- npm run lint
- npm run build

Stop and explain if any command fails.
```

## 33.3 Prompt for security reviewer

```text
Review the current Reticle Systems implementation against the unified Source of Truth and SECURITY.md.

Focus on:
- secrets exposure
- Firebase rules
- frontend privileged writes
- report ownership
- upload safety
- payment trust boundaries
- AI call boundaries
- TypeScript strict mode

Do not implement features.
Return a ranked list of issues, confidence level, risk, and recommended fix.
```

---

# 34. Non-Negotiable Principles

## Principle 1 — Be safer than the projects you audit

Reticle Systems must not make the mistakes it detects in others.

## Principle 2 — Create better builders

The product is not only a scanner. It is a mentor that teaches professional practice without overwhelming the user.

## Principle 3 — Accuracy over conversions

Do not exaggerate risk. Use confidence language and explain uncertainty.

## Principle 4 — Guided, not chaotic

Avoid generic chat-first UX. Use guided flows, clear choices, and progressive disclosure.

## Principle 5 — User owns the output

Exportability, documentation, and transparency are core product features.

## Principle 6 — No surprise costs

Quote work before execution. Never silently consume extra credits.

## Principle 7 — Small steps, always green

Every implementation slice should build, test, review, and document before moving on.

## Principle 8 — Maintainability over volume

The best AI output is not the largest output. It is the clearest, safest, and easiest to maintain.

---

# 35. Current Strategic Recommendation

Build the clear wedge first:

> AI App Launch Readiness Check for vibe-coded and AI-assisted projects.

Do not lead with “build anything with AI” yet. That message is too broad for the first landing page.

The public product should start narrow:

- review existing projects
- show high-level free score
- sell detailed paid report
- generate repair prompts
- verify fixes

Then expand naturally into:

- GitHub migration
- monitoring
- planning
- project generation
- ODIN-powered build platform

This keeps the early product understandable while preserving the larger Reticle Systems vision.

---

# 36. Final Build Direction

Reticle Systems should become the professional layer for AI-assisted builders.

The market problem:

> AI tools help people create software quickly, but many users do not know whether what they built is safe, maintainable, private, discoverable, or ready to launch.

The product answer:

> Reticle Systems gives those builders a calm diagnostic system, a guided repair path, and a professionalisation journey powered by ODIN.

The immediate build priority:

1. Secure foundation.
2. Guided intake.
3. Project dashboard.
4. Free URL-only launch readiness scan.
5. Paid detailed report.
6. Repair prompts.
7. Verification loop.
8. GitHub migration and monitoring.
9. Idea Architect expansion.

The product should always feel calm, accurate, professional, and educational.

---

# Appendix A — Original Document Integration Notes

The uploaded documents were consolidated as follows:

- `Reticle Systems — Source of Truth.md` became the parent platform vision.
- `BuildProof_Source_of_Truth_Build_Plan(2).md` supplied the audit MVP, scanner strategy, data model, phases, and report logic.
- `Idea Architect — Build Plan & Technology stack.md` supplied the long-term planning/generation/workspace roadmap.
- `idea architect.md` supplied the strategic decision to keep BuildProof as the first module inside the larger platform.
- `27_BuildProof_Product_Strategy_and_Differentiation.md` supplied mission, differentiation, free/paid report strategy, and Reticle Labs.
- `Reticle Systems Addendum — Guided Build intelligence.md` supplied adaptive knowledge levels and guided setup principles.
- `Reticle Systems Addendum — ODIN Voice.md` supplied accessibility and future voice modes.
- `AGENT_RULES.md` supplied coding agent rules.
- `SECURITY.md` supplied non-negotiable platform security constraints.
- `PRIVACY.md` supplied data handling, retention, user rights, and compliance commitments.
- `04_AI_Project_Maintenance.md.md` supplied AI-readiness, maintenance, preflight, finish gate, and recovery mode.
- `development philosophy.md` and `ODIN rules.md` supplied the AI-assisted development philosophy.
- `docs hierarchy.md` supplied the recommended documentation structure.
- `README.md` supplied quick start, current stack, and repository structure assumptions.

---

# Appendix B — Agent Handoff Summary

For the next coding session, the agent should understand this in one minute:

```text
Reticle Systems is an AI Product Engineering Platform powered by ODIN.
The first commercial wedge is BuildProof / ODIN Review: launch readiness and security scanning for AI-built projects.
The UX is guided, minimal, dark, diagnostic, and non-chat-first.
The user owns all outputs.
The platform must be safer than the projects it audits.
No secrets in frontend. No AI from browser. No frontend payment fulfilment. No raw code stored by default.
Use Firebase Auth/Firestore/Storage/Functions, Vite/React/TypeScript/Tailwind, Stripe, backend-only AI, deterministic scanners first.
Build in small slices. Keep the repo AI-readable. Update docs when architecture changes.
```
