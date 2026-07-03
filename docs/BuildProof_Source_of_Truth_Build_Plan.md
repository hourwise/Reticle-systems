# Reticle Systems — Source of Truth Build Plan

**Product:** Reticle Systems
**AI Assistant:** O.D.I.N. (Optical Diagnostic & Inspection Network)
**Former working names:** BuildProof, ShipSafe AI, LaunchGuard AI, PromptProof, VibeShield
**Core promise:** Help non-technical and AI-assisted builders move from idea to launch with safer code, clearer structure, and better growth plans.

---

## 1. Product Vision

AI coding tools let people create apps quickly, but many founders and creators do not understand the security, scalability, maintainability, SEO, or marketing weaknesses inside what they have built.

Reticle Systems provides a guided, minimal, non-chat interface that:

1. Checks AI-built projects before or after launch.
2. Detects common security and structural problems.
3. Explains issues in plain English.
4. Generates repair instructions and Codex/vibe-coder prompts.
5. Offers SEO, marketing, and growth guidance once the project is technically safer.
6. Later helps users discover real-world problems worth building solutions for.

The product should feel like a calm diagnostic system, not a chatbot.

**Interface inspiration:** HAL-style, minimal, dark, typewriter text, clickable answers, guided flow, no open chat box.

### 1a. Our Mission

Not to scan code.

To create better software builders.

The product should educate users throughout their journey, gradually introducing professional software engineering practices without overwhelming beginners. Every feature should answer one question:

> "Does this make someone a better software builder?"

If not, it probably does not belong in Reticle Systems.

### 1b. Our Philosophy

O.D.I.N. is not an AI report generator.

It is an AI development mentor.

Every interaction should answer one of four questions:

1. **What is wrong?** — identify the issue clearly.
2. **Why does it matter?** — explain the impact in plain English.
3. **How do I fix it?** — provide actionable repair guidance.
4. **What should I learn next?** — guide the user's growth as a builder.

---

## 2. Product Positioning

### Suggested tagline options

- Build fast. Launch safely.
- Pre-flight checks for AI-built apps.
- Your launch readiness system for vibe-coded projects.
- From idea to launch, without the hidden traps.
- Security, structure, and growth plans for AI-built software.

### What the product is

Reticle Systems is an automated launch-readiness and growth advisory platform for AI-assisted builders, powered by O.D.I.N.

### What the product is not

Reticle Systems is not a guarantee that a product is secure. It is not a replacement for formal penetration testing, legal advice, or professional security review.

Always include wording similar to:

> Reticle Systems provides automated risk assessment and remediation guidance. It does not guarantee that your product is secure and is not a substitute for professional penetration testing, legal advice, or compliance review.

### 2a. Brand Personality

Reticle Systems should feel:

- **Calm** — never alarmist or fear-based.
- **Accurate** — precision over drama.
- **Professional** — trustworthy, not salesy.
- **Helpful** — focused on enabling the user.
- **Educational** — every interaction teaches something.

Never dramatic. Never fear-based. Never salesy.

### 2b. Trust First

O.D.I.N. never exaggerates findings.

Instead of:

> "You have a SQL Injection vulnerability."

Say:

> "We detected a pattern consistent with a potential SQL injection vulnerability that requires verification."

Accuracy is always more important than conversions. The product builds trust through measured, precise language — not through inflating risk to drive purchases.

---

## 3. Target Users

### Primary users

- Non-technical founders using Lovable, Bolt, Replit, Cursor, Claude, Codex, v0, or similar tools.
- Solo builders who have created an MVP and want to know whether it is safe to launch.
- Creators who built a SaaS, app, landing page, tool, or marketplace with AI.
- Small agencies building websites/apps quickly for clients.

### Secondary users

- Indie hackers.
- Startup weekend participants.
- Bootcamp students.
- Small businesses that paid for an AI-generated website/app.
- Developers who want a plain-English pre-launch checklist.

---

## 4. Core Product Stages (The Reticle Journey)

The long-term product journey has eight stages:

```text
1. Discover an idea
2. Plan the build
3. Audit the project
4. Repair the weaknesses
5. Verify the fixes
6. Professionalise the project
7. Launch with confidence
8. Grow the product
```

This replaces the simpler scan → report → leave model with a continuous journey. Every feature should fit somewhere in this journey.

The MVP should start with stages 3, 4, 5, and a basic version of 8.

### 4a. Professionalisation — A Unique Selling Point

One of Reticle Systems' differentiators: rather than assuming users understand Git, CI/CD, or deployments, O.D.I.N. teaches these concepts at the appropriate time — after critical issues are resolved.

**Professionalisation roadmap:**

| Level | Milestone |
|-------|-----------|
| **Level 1** | Downloaded a project from Lovable/Bolt/etc. |
| **Level 2** | Stored project in GitHub |
| **Level 3** | Security issues resolved |
| **Level 4** | Automatic monitoring enabled |
| **Level 5** | Production-ready application |

Users should feel they are progressing as software creators, not just receiving a one-time report.

### 4b. Verification Mode

Every finding should include a verification loop:

```text
"I've fixed it."
     ↓
  Rescan
     ↓
  Confirmed ✓
     ↓
Score increases
```

Positive reinforcement should be shown when fixes are verified. This builds trust and encourages users to continue improving their projects.

### 4c. Our Competitive Advantage

Most competitors:

- Produce reports.
- Generate AI text.
- Stop.

O.D.I.N. continues after the report. It helps users:

- ✓ fix
- ✓ verify
- ✓ improve
- ✓ monitor
- ✓ learn

The product is not a scanner — it is a development mentor that stays with the user through their entire builder journey.

---

## 5. MVP Scope

### MVP name

**AI App Launch Readiness Check**

### MVP user flow

1. User lands on homepage.
2. User clicks “Check my project”.
3. User answers guided questions using buttons, not free chat.
4. User provides:
   - live website URL
   - GitHub repo URL or uploaded ZIP, optional for first MVP
   - builder used: Lovable, Bolt, Replit, Cursor, Codex, Other
   - whether the project uses auth
   - whether it stores user data
   - whether it handles payments
   - whether it uses Supabase/Firebase/other backend
   - whether it is launched or pre-launch
   - target audience
5. User pays for a report or uses one free limited scan.
6. System runs deterministic checks first.
7. System runs AI summarisation and recommendations.
8. User receives a report with:
   - launch readiness score
   - security score
   - privacy/GDPR score
   - SEO score
   - growth readiness score
   - critical issues
   - suggested fixes
   - Codex/vibe-coder repair prompts
   - optional growth plan upsell

### MVP outputs

- Plain-English report.
- Technical appendix.
- “Paste this into Codex” repair prompts.
- “Paste this into Lovable/Bolt/etc.” safe improvement prompts.
- Growth suggestions after technical issues are fixed.

### Free vs Paid Report Strategy

**The Free Report** should answer only:

> "Is there a problem?"

Not:

> "What exactly is wrong?"

Display: launch score, security score, SEO score, growth score, issue counts, and categories. No implementation details.

**The Paid Report** reveals everything required to fix the project:

- Repair prompts tailored to the user's builder.
- Code explanations in plain English.
- Verification checklist.
- Architecture suggestions.
- Growth advice and next steps.

This tiered approach builds trust through the free report while creating clear value for the paid tier.

---

## 6. Future Expansion Features

### Phase 2 — Deeper code audit

- GitHub OAuth import.
- Private repo access.
- ZIP upload.
- Gitleaks secret scan.
- Semgrep security scan.
- Dependency vulnerability scan.
- Package manager detection.
- Framework detection.
- Supabase/Firebase config risk checks.
- CI/CD safety checks.
- Environment variable exposure checks.
- Frontend/backend separation analysis.
- RLS, Firebase Security Rules, and permission checklist.

### Phase 3 — Growth engine

- SEO audit.
- Landing page conversion audit.
- App Store optimisation suggestions.
- Social media launch calendar.
- Reddit-friendly launch posts.
- Product Hunt launch plan.
- TikTok/Reels scripts.
- Email launch campaign.
- Blog article ideas.
- FAQ/help centre generator.
- Competitor positioning suggestions.
- “Why users cannot find you” report.

### Phase 4 — Idea miner

This should not be built first.

Future idea-mining features:

- Monitor permitted public sources and APIs.
- Analyse common complaints and repeated problems.
- Detect app reviews with recurring feature requests.
- Detect abandoned/failed ideas with visible demand.
- Track GitHub issues with lots of reactions.
- Track public forum questions where users repeatedly ask for tools.
- Convert findings into buildable opportunity cards.

Each opportunity card should include:

- Problem summary.
- Who has the problem.
- Evidence of demand.
- Existing solutions.
- Gap in the market.
- Monetisation potential.
- Build difficulty.
- Suggested MVP.
- Tech stack.
- Security risks.
- Vibe-coder prompt.
- Professional build plan.

Important: Avoid positioning this as “scraping Reddit”. Use permitted APIs, public datasets, user-submitted ideas, RSS feeds, app store reviews where allowed, and compliant data sources.

### Phase 5 — Ongoing monitoring

- Weekly security scan.
- Dependency updates.
- SEO ranking check.
- Broken link monitoring.
- Lighthouse score monitoring.
- Accessibility regressions.
- Product feedback analysis.
- Competitor change tracking.
- Monthly growth recommendations.
- "What to build next" report.

### Phase 6 — GitHub Migration Assistant

After critical issues are resolved, recommend moving the project into GitHub.

Provide:

- Builder-specific export guides (Lovable, Bolt, Replit, etc.).
- GitHub Desktop setup guide.
- Repository creation and initial commit guide.
- Connect Reticle Systems for automatic monitoring.

This unlocks:

- Automatic scans on every push.
- Continuous monitoring.
- Historical score comparisons.
- Weekly progress reports.

### Phase 7 — Reticle Labs

Publish regular industry reports to position Reticle Systems as an authority and drive organic SEO:

- Top AI coding mistakes (monthly).
- Builder comparison reports (Lovable vs Bolt vs Cursor, etc.).
- Weekly security trends for AI-built software.
- State of AI-built software (annual).
- Common vulnerability patterns in vibe-coded projects.

These reports serve dual purpose: educating the community and attracting new users through organic discovery.

### Phase 8 — Long-Term Vision: Development Operating System

Eventually Reticle Systems becomes a development operating system, not merely a scanner.

Advisor capabilities:

- **Security Advisor** — continuous vulnerability detection and remediation.
- **Architecture Advisor** — structural guidance for scaling projects.
- **SEO Advisor** — ongoing visibility optimisation.
- **Growth Advisor** — launch strategy and marketing guidance.
- **Deployment Advisor** — production readiness and CI/CD setup.
- **Accessibility Advisor** — inclusive design checks.
- **Marketing Advisor** — content strategy and audience growth.

Each advisor acts as a specialised module within the platform, accessible as the user progresses through the professionalisation levels.

---

## 7. Recommended Tech Stack

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router
- TanStack Query
- Zustand or simple Context for lightweight state

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

- OpenAI API via backend only
- Use Responses API or current OpenAI API endpoint from official documentation
- Use Structured Outputs / JSON schema for predictable report modules
- Never call OpenAI directly from the browser

OpenAI Structured Outputs should be used because they enforce a supplied JSON schema rather than relying on freeform text. Official OpenAI documentation describes Structured Outputs as a way to ensure model responses adhere to your supplied JSON Schema.

### Scanning tools

- Gitleaks for secret detection
- Semgrep for static security scanning
- npm audit / pnpm audit for JavaScript dependency checks
- Lighthouse for performance, accessibility, SEO, and best practices
- Custom regex rules for common vibe-code mistakes
- Custom Supabase/Firebase rule checks

### Hosting

- Vercel for frontend
- Firebase for auth/database/storage/functions
- Optional separate worker host later for long-running scans:
  - Fly.io
  - Render
  - Railway
  - AWS ECS/Fargate

---

## 8. High-Level Architecture

```text
User
  ↓
React/Vite frontend
  ↓
Firebase Authentication
  ↓
Stripe payment / credit check
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
```

### Important AI rule

The frontend must never contain:

- OpenAI API keys
- Firebase service account private keys
- Stripe secret keys
- GitHub tokens
- Private webhook secrets

All privileged calls must happen in Cloud Functions or server-side workers.

Firebase service account credentials and Admin SDK privileges must not be used in the browser because they bypass Firebase Security Rules. Store them only as server-side secrets.

---

## 9. User Interface Direction

### Design mood

- Minimal
- Dark interface
- Calm diagnostic system
- HAL-inspired but not a direct copy
- Typewriter text
- Large clickable response buttons
- No open chatbot box
- No technical overwhelm

### Website Design Principles

**Avoid:**

- ❌ AI gradients
- ❌ Floating glass cards
- ❌ "Powered by AI" badges
- ❌ Generic SaaS layouts

**Instead create:**

- ✓ Industrial
- ✓ Diagnostic
- ✓ Mission control
- ✓ Minimal
- ✓ Trustworthy

**Think:** Apple diagnostics, HAL, Flight control, Professional engineering equipment.

### Example flow

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

Then:

```text
DOES YOUR PROJECT STORE USER DATA?

[ Yes ]
[ No ]
[ Not sure ]
```

Then:

```text
DOES YOUR PROJECT ACCEPT PAYMENTS?

[ Stripe ]
[ RevenueCat ]
[ PayPal ]
[ No payments ]
[ Not sure ]
```

### Report reveal

```text
ASSESSMENT COMPLETE.

3 launch blockers detected.
7 recommended improvements found.
Growth potential: Moderate to High.

[ View report ]
[ Generate repair prompts ]
[ Create growth plan ]
```

### UI components

- SystemPromptScreen
- GuidedQuestionCard
- TypewriterText
- ClickableAnswerGrid
- ProgressScanner
- ScoreDial
- FindingCard
- ReportSection
- RepairPromptCard
- UpsellCard
- ProjectDashboard

---

## 10. Core Firestore Data Model

Use Cloud Firestore as the primary application database. Keep document IDs as Firestore auto IDs unless a stable external ID is required. Store all user-owned records with `userId` equal to the Firebase Authentication UID.

### users / profiles

```json
users/{userId} {
  "email": "string",
  "fullName": "string | null",
  "role": "user | admin",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### projects

```json
projects/{projectId} {
  "userId": "firebaseAuthUid",
  "name": "string",
  "websiteUrl": "string | null",
  "repoUrl": "string | null",
  "builderUsed": "string | null",
  "backendUsed": "firebase | supabase | custom | other | none | unknown",
  "status": "idea | pre_launch | launched | unknown",
  "targetAudience": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### project answers

Use a subcollection to keep intake answers grouped under each project.

```json
projects/{projectId}/answers/{answerId} {
  "userId": "firebaseAuthUid",
  "questionKey": "string",
  "answerValue": "object | array | string | number | boolean | null",
  "createdAt": "timestamp"
}
```

### credits

```json
credits/{creditId} {
  "userId": "firebaseAuthUid",
  "creditType": "string",
  "quantity": 0,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

For safer accounting, add a ledger collection before paid launch:

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

### payments

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

### audit jobs

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

### audit findings

```json
auditFindings/{findingId} {
  "auditJobId": "auditJobId",
  "projectId": "projectId",
  "userId": "firebaseAuthUid",
  "category": "string",
  "severity": "info | low | medium | high | critical",
  "title": "string",
  "explanation": "string | null",
  "filePath": "string | null",
  "lineNumber": 0,
  "redactedSnippet": "string | null",
  "fixSummary": "string | null",
  "sourceTool": "string",
  "createdAt": "timestamp"
}
```

### reports

```json
reports/{reportId} {
  "auditJobId": "auditJobId",
  "projectId": "projectId",
  "userId": "firebaseAuthUid",
  "reportJson": {},
  "plainEnglishSummary": "string | null",
  "launchReadinessScore": 0,
  "securityScore": 0,
  "seoScore": 0,
  "growthScore": 0,
  "createdAt": "timestamp"
}
```

### ai usage logs

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

### scanner rules

```json
scannerRules/{ruleId} {
  "ruleKey": "string",
  "category": "string",
  "provider": "string | null",
  "regexPattern": "string | null",
  "severity": "string",
  "explanation": "string",
  "fixTemplate": "string",
  "enabled": true,
  "createdAt": "timestamp"
}
```

Scanner rules should be admin-managed. Normal users must not be able to write them.

---

## 11. Firebase Security Rules

Every user-owned collection must be protected by Firebase Security Rules and server-side ownership checks in Cloud Functions.

Basic Firestore rule pattern:

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

Apply this ownership model to:

- projects
- project answers
- audit jobs
- audit findings
- reports
- users / profiles
- credits
- credit ledger
- payments
- AI usage logs where appropriate

Admin access should be handled with Firebase custom claims and server-side checks, not by exposing service account credentials to the frontend.

---
## 12. Scanner Design

### Rule 1: Deterministic checks first

Before AI is called, run cheap deterministic checks:

- secret scanning
- environment file detection
- dependency audit
- framework detection
- common insecure config checks
- public metadata checks
- SEO fetch checks
- Lighthouse scan

### Rule 2: Do not store raw code by default

Do not store full source code in the database unless the user explicitly opts into deeper analysis.

Recommended approach:

```text
Upload/repo import
  ↓
Temporary isolated scan workspace
  ↓
Run scanners
  ↓
Store findings only
  ↓
Store redacted snippets only
  ↓
Delete raw code after scan
```

Stored findings should look like:

```text
File: firebase-adminsdk.json
Line: 12
Issue: Possible Firebase service account private key committed
Severity: Critical
Snippet: "private_key": "-----BEGIN PRIVATE KEY-----...REDACTED"
Fix: Remove the file from source control, rotate the key, and load credentials only in server-side infrastructure.
```

### Rule 3: Store scanner rules, not users' code

The database should store reusable detection rules, such as:

- regex pattern
- provider
- severity
- explanation
- fix template

Do not build the product around storing exact lines of user code for matching.

---

## 13. Initial Scanner Checks

### Secret checks

Detect likely:

- OpenAI keys
- Stripe secret keys
- Stripe webhook secrets
- Supabase service-role keys
- Supabase anon keys, with warning if used incorrectly
- Firebase service account private keys
- Firebase web config misuse where secrets are incorrectly placed alongside public config
- AWS access keys
- GitHub tokens
- JWT secrets
- database URLs
- SMTP credentials
- Vercel tokens
- API bearer tokens

### Environment mistakes

Flag:

- committed `.env`
- committed `.env.local`
- committed `.env.production`
- committed service account JSON
- `VITE_` or `NEXT_PUBLIC_` prefixes used for secrets
- hardcoded URLs/secrets in frontend code
- `.gitignore` missing environment patterns

### Supabase-specific checks

Flag:

- service-role key in frontend
- missing RLS reminders
- tables likely missing user ownership columns
- direct table access from frontend without ownership filtering
- overly broad policies
- public buckets containing private files
- unprotected storage access assumptions

### Firebase-specific checks

Flag:

- overly permissive Firestore rules
- public write access
- public read access for private user data
- service account JSON committed
- Firebase Admin SDK used in frontend code
- Storage rules that allow private upload reads or writes without ownership checks

### Auth checks

Flag:

- no route guards
- admin pages only hidden by frontend logic
- role checks only in UI
- no server-side ownership validation
- weak password reset assumptions
- missing email verification where appropriate

### Payment checks

Flag:

- trusting frontend payment success
- missing Stripe webhook verification
- fulfilling credits before webhook confirmation
- secret keys in frontend
- no idempotency handling
- no payment status table

### AI checks

Flag:

- OpenAI key in frontend
- user input sent to AI without moderation or boundaries
- no token/cost logging
- no rate limits
- no structured output validation
- storing sensitive user code unnecessarily

### SEO / visibility checks

Flag:

- missing title
- missing meta description
- missing Open Graph tags
- missing Twitter/X card tags
- missing canonical URL
- missing robots.txt
- missing sitemap.xml
- weak heading structure
- no clear CTA
- poor page copy
- no target keyword focus
- missing schema.org structured data
- slow page load
- mobile issues

### Growth checks

Flag:

- unclear target audience
- unclear value proposition
- no landing page CTA
- no email capture
- no analytics
- no onboarding flow
- no shareable content
- no launch plan
- no social proof
- no pricing clarity

---

## 14. AI Architecture

### AI should not scan everything

AI should not be responsible for basic secret detection or basic SEO checks. Use deterministic tools first.

AI should be used for:

- explaining findings in plain English
- prioritising issues
- generating repair prompts
- generating growth plans
- summarising the report
- converting technical findings into founder-friendly language

### AI call flow

```text
Raw scanner findings
  ↓
Normalise findings into JSON
  ↓
Send selected, redacted findings to AI
  ↓
AI returns structured JSON report
  ↓
Validate JSON schema
  ↓
Store report
  ↓
Render report in UI
```

### AI output should be structured

Use a strict schema like:

```json
{
  "summary": "string",
  "scores": {
    "security": 0,
    "launch_readiness": 0,
    "seo": 0,
    "growth": 0
  },
  "critical_blockers": [],
  "recommended_fixes": [],
  "repair_prompts": [],
  "growth_suggestions": [],
  "disclaimer": "string"
}
```

### AI cost tracking

Every AI call must log:

- user_id
- project_id
- audit_job_id
- model
- input tokens
- output tokens
- estimated cost
- purpose

Build an admin dashboard showing:

- cost per report
- revenue per report
- gross margin
- average tokens per report
- failed AI calls

---

## 15. Payments and Credits

### Recommended MVP pricing

- Free teaser scan: limited URL-only scan
- £9.99 basic launch readiness report
- £29.99 deeper code/repo audit
- £79–£199 full launch and growth plan
- Later: monthly monitoring subscription

### Credit model

Use credits instead of directly triggering reports from payment pages.

Flow:

```text
User pays with Stripe
  ↓
Stripe webhook confirms payment
  ↓
Credit added to user's account
  ↓
User starts report
  ↓
Credit consumed
  ↓
Audit job starts
```

Never trust frontend payment confirmation alone.

---

## 16. Security Instructions for This Project

This product must not contain the same flaws it scans for.

### Absolutely forbidden

- No API keys in frontend code.
- No OpenAI calls from browser.
- No Firebase service account credentials in browser.
- No Stripe secret key in browser.
- No committed `.env` files.
- No raw user code stored by default.
- No admin access controlled only by frontend UI.
- No report access without ownership checks.
- No payment fulfilment from frontend success page.
- No unrestricted file uploads.
- No unvalidated AI JSON responses.
- No public storage buckets for private uploads.
- No Firestore/Storage collections without explicit security rules.

### Required from day one

- TypeScript strict mode.
- Firebase Security Rules enabled for Firestore and Storage.
- Server-side ownership checks.
- Stripe webhook signature verification.
- OpenAI API key stored only as backend secret.
- Firebase service account credentials stored only as backend/server secrets.
- File upload validation.
- ZIP size limits.
- Job timeouts.
- Audit logging.
- AI cost logging.
- Error logging.
- Rate limiting.
- Security headers.
- GDPR/privacy policy.
- Data deletion flow.

### `.gitignore` must include

```gitignore
.env
.env.*
!.env.example
*.pem
*.key
*.p12
*.pfx
service-account*.json
firebase-service-account*.json
.firebase
.vercel
.DS_Store
node_modules
dist
coverage
```

### Environment variables

Use `.env.example` only, never real secrets.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GITHUB_APP_PRIVATE_KEY=
```

Only Firebase web app config values with the `VITE_FIREBASE_*` prefix may be exposed to the browser. Firebase service account credentials, Admin SDK credentials, Stripe secrets, OpenAI keys, webhook secrets, and GitHub private keys must remain server-side only.

---

## 17. Suggested Folder Structure

```text
reticle-systems/
  apps/
    web/
      src/
        components/
        pages/
        routes/
        features/
          intake/
          projects/
          reports/
          payments/
          dashboard/
        lib/
          firebaseClient.ts
          queryClient.ts
        styles/
  firebase/
    firestore.rules
    storage.rules
    firestore.indexes.json
    functions/
      src/
        createCheckoutSession.ts
        stripeWebhook.ts
        createAuditJob.ts
        runUrlScan.ts
        generateAiReport.ts
  packages/
    shared/
      schemas/
      types/
      constants/
    scanner-rules/
      secrets.ts
      seo.ts
      supabase.ts
      firebase.ts
      payments.ts
  workers/
    scanner/
      src/
        runGitleaks.ts
        runSemgrep.ts
        runLighthouse.ts
        normaliseFindings.ts
  docs/
    SECURITY.md
    PRIVACY.md
    BUILD_PLAN.md
    AGENT_RULES.md
```

---

## 18. Build Phases

### Phase 0 — Setup and guardrails ✅ COMPLETE

- [x] Create GitHub repo.
- [x] Add `.gitignore`.
- [x] Add `.env.example`.
- [x] Set up Vite React TypeScript.
- [x] Set up Tailwind CSS (dark HAL-inspired theme).
- [x] Set up Firebase project (Spark plan).
- [x] Configure Firebase Authentication (Email/Password).
- [x] Create Firestore and Storage security rules.
- [x] Add Firestore indexes where needed.
- [x] Add linting (ESLint) and formatting (Prettier).
- [x] Add security notes.
- [x] Add agent rules.
- [x] Branding: Reticle Systems + O.D.I.N. assistant.

### Phase 1 — Landing and intake ✅ COMPLETE

- [x] Homepage (HAL-style, auth-aware CTAs).
- [x] HAL-style guided intake (10-step interactive flow).
- [x] Project creation (Zustand intake store → storage adapter).
- [x] Save answers (persisted via localStorage or B2).
- [x] Basic dashboard (project listing with metadata cards).
- [x] Auth (Firebase sign-up/login, AuthGuard on routes).
- [x] Storage adapter architecture (localStorage + B2 S3-compatible).
- [x] Branding applied throughout UI ("O.D.I.N. checks your project...").

### Phase 2 — Payments 🔲 NOT STARTED

- [ ] Stripe Checkout.
- [ ] Stripe webhook.
- [ ] Credit allocation.
- [ ] Credit consumption.
- [ ] Payment history.

### Phase 3 — URL-only audit MVP 🔲 NOT STARTED

- [ ] Fetch website URL.
- [ ] Check HTTPS.
- [ ] Check title/meta.
- [ ] Check headings.
- [ ] Check robots.txt.
- [ ] Check sitemap.xml.
- [ ] Check Open Graph tags.
- [ ] Run Lighthouse if possible.
- Store findings.
- Generate AI report.

### Phase 4 — Repo/ZIP scan

- Allow ZIP upload or GitHub repo URL.
- Validate file size/type.
- Extract in temporary worker directory.
- Run Gitleaks.
- Run Semgrep.
- Run dependency audit.
- Store redacted findings.
- Delete raw files after scan.

### Phase 5 — Repair prompts and verification

- Generate Codex prompts.
- Generate Lovable/Bolt repair prompts.
- Generate developer checklist.
- Add copy buttons.
- Add "I've fixed it" verification button.
- Rescan individual findings.
- Update scores on verified fixes.
- Show positive reinforcement on improvement.

### Phase 6 — Growth plan upsell

- Offer growth report after technical report.
- SEO suggestions.
- Social media plan.
- Landing page improvements.
- Launch checklist.
- Content ideas.

### Phase 7 — Monitoring subscription

- Recurring scans.
- Weekly report email.
- Dependency update alerts.
- SEO regression alerts.
- Growth opportunities.

### Phase 8 — GitHub migration assistant

- Builder-specific export guides (Lovable, Bolt, Replit, etc.).
- GitHub Desktop setup walkthrough.
- Repository creation and commit guidance.
- Connect Reticle Systems for automatic push-based scanning.
- Historical score tracking across commits.

### Phase 9 — Idea miner

- Add opportunity discovery dashboard.
- Use compliant data sources.
- Add opportunity scoring.
- Generate build prompts/plans.

### Phase 10 — Reticle Labs

- Publish industry reports.
- Top AI coding mistakes (monthly).
- Builder comparison reports.
- State of AI-built software.
- Drive organic SEO through authoritative content.

---

## 19. Codex / Agent Working Rules

Every AI coding agent must follow these rules:

1. Do not implement features not requested in the current task.
2. Do not change the Firestore data model without updating Firebase rules, indexes where needed, and this plan.
3. Do not add secrets to source code.
4. Do not weaken Firebase Security Rules.
5. Do not use Firebase service account credentials or Admin SDK privileges in frontend code.
6. Do not call OpenAI from the browser.
7. Do not store raw uploaded code unless explicitly required and documented.
8. Do not create public Firebase Storage paths for private user uploads.
9. Do not trust frontend payment success.
10. Add tests or clear manual verification steps for every feature.
11. Keep UI minimal and guided, not chat-based.
12. Use structured AI outputs, not freeform parsing.
13. Redact secrets before storing snippets.
14. Log AI usage and estimated cost.
15. Keep functions idempotent where possible.

---

## 20. Testing Checklist

### Security tests

- User cannot view another user's project.
- User cannot view another user's report.
- User cannot consume another user's credit.
- Firebase service account key never appears in frontend bundle.
- OpenAI key never appears in frontend bundle.
- Stripe secret never appears in frontend bundle.
- Firestore Security Rules block direct unauthorised document access.
- Firebase Storage Rules block unauthorised private upload access.
- Uploaded ZIP size limit works.
- Unsafe file types rejected.
- Secrets are redacted in stored snippets.
- Payment webhook validates signature.

### Functional tests

- User can create account.
- User can create project.
- User can answer intake questions.
- User can pay and receive credit.
- User can run URL audit.
- User can view report.
- User can copy repair prompts.
- Failed scan shows useful error.

### AI tests

- AI output validates against schema.
- Invalid AI output is rejected and retried.
- Token usage is logged.
- AI report does not expose unredacted secrets.
- AI report includes disclaimer.

### UX tests

- No chat box visible.
- All intake questions can be answered by clicking.
- User can go back/change answer.
- Report is understandable to non-technical user.
- Mobile layout works.

---

## 21. Legal, Privacy, and Compliance Notes

### Required pages

- Privacy Policy
- Terms of Use
- Cookie Policy
- Security Policy
- Data Processing explanation
- Report disclaimer
- Contact page

### Data handling promises

- Raw code is processed temporarily for scans.
- Raw code is deleted after scanning unless user opts into storage.
- Stored snippets are redacted.
- Users can delete projects and reports.
- Users can request data deletion.
- Reports are guidance, not guarantees.

### Scraping caution

Do not build the idea miner around unauthorised scraping. Use compliant APIs, public feeds, app review sources where permitted, user submissions, newsletters, open datasets, or licensed data.

---

## 22. Initial Homepage Copy

### Hero

**Build fast. Launch safely.**

AI-built apps can hide serious problems. O.D.I.N. checks your project for security risks, launch blockers, SEO gaps, and growth weaknesses before they become expensive.

[ Check my project ]
[ See how it works ]

### Subheading

Made for founders, creators, and vibe coders who can build quickly but want confidence before launch.

### Key benefits

- Find exposed keys and dangerous configuration mistakes.
- Understand what your AI-built app actually does.
- Get plain-English fixes.
- Generate repair prompts for Codex, Lovable, Bolt, Replit, and more.
- Improve your landing page, SEO, and launch plan.

---

## 23. Example Report Sections

1. Executive summary
2. Launch readiness score
3. Critical blockers
4. Security findings
5. Data/privacy findings
6. Payment risks
7. SEO/visibility findings
8. Growth opportunities
9. Repair checklist
10. Vibe-coder repair prompts
11. Suggested next steps
12. Disclaimer

---

## 24. Example Repair Prompt Format

```text
You are working on my existing project. Do not rebuild the app from scratch.

Task:
Fix the exposed secret handling issue described below.

Rules:
- Do not place secret keys in frontend code.
- Move privileged API calls to a server-side function.
- Use environment variables for secrets.
- Do not disable authentication or weaken database/storage security rules.
- Do not change unrelated UI.
- Add a short explanation of what changed.

Issue:
[Insert finding here]

Expected result:
The app should work as before, but the secret must no longer be exposed to the browser.
```

---

## 25. Suggested First Codex Prompt

```text
Create the initial Vite + React + TypeScript project for Reticle Systems.

Requirements:
- Use Tailwind CSS.
- Use a dark minimal HAL-inspired interface.
- No chatbot UI.
- Create a guided intake flow with clickable answers.
- Add placeholder pages: Home, Intake, Dashboard, Report.
- Add Firebase client using only public `VITE_FIREBASE_*` web config values.
- Do not add any secret keys.
- Add .env.example and .gitignore.
- Add basic folder structure matching the build plan.
- Do not implement payments or AI calls yet.
- Keep code clean, typed, and modular.
```

---

## 26. Non-Negotiable Principles

### Principle 1: Be safer than the projects you audit

Reticle Systems must be safer than the projects it audits.

If the platform ever exposes keys, bypasses Firebase Security Rules, trusts frontend payment state, stores raw code unnecessarily, or produces unvalidated AI output, it has failed its own core promise.

### Principle 2: Every feature must create better builders

Every feature should answer one question:

> "Does this make someone a better software builder?"

If the answer is no, the feature probably does not belong in Reticle Systems.

The product exists not to scan code, but to educate, guide, and improve the people who build software — whether they are professional developers or first-time founders using AI tools.

### Principle 3: Accuracy over conversions

Never exaggerate findings to drive purchases. Reticle Systems' long-term value depends on trust. When in doubt, understate rather than overstate. Use measured language: "detected a pattern consistent with" rather than definitive claims of vulnerabilities that require human verification.
