# BuildProof

> Build fast. Launch safely.

Launch readiness and security audit platform for AI-built applications.

BuildProof helps non-technical founders and AI-assisted builders move from idea to launch with safer code, clearer structure, and better growth plans.

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Firebase project
- Stripe account (for Phase 2+)
- OpenAI API key (for Phase 2+)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd buildproof

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

Edit `.env.local` with your Firebase web app config. Only `VITE_FIREBASE_*` values are exposed to the browser. Keep Firebase service account JSON, Stripe secrets, OpenAI keys, and GitHub private keys backend-only.

### Development

```bash
npm run dev
npm run lint
npm run type-check
npm run format
```

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
buildproof/
  src/
    components/
    pages/
    features/
    lib/
      firebaseClient.ts
      queryClient.ts
    hooks/
    types/
    App.tsx
    main.tsx
  firebase/
    firestore.rules
    storage.rules
    firestore.indexes.json
  docs/
  .env.example
  package.json
```

## Tech Stack

### Frontend

- Vite
- React 18
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Framer Motion

### Backend (Phase 1+)

- Firebase Authentication
- Cloud Firestore
- Firebase Security Rules
- Firebase Storage
- Cloud Functions for Firebase
- Stripe payment processing
- OpenAI API via backend only

### Scanning Tools (Phase 2+)

- Gitleaks for secret detection
- Semgrep for static security analysis
- npm audit for dependency vulnerabilities
- Lighthouse for performance, SEO, accessibility, and best practices
- Custom Firebase and Supabase configuration checks for audited user projects

## Features

### Phase 0 (Current)

- [x] Project scaffolding
- [x] TypeScript setup
- [x] Tailwind CSS configured
- [x] Router setup
- [x] Firebase client configured
- [x] Initial Firestore rules scaffold
- [x] Initial Storage rules scaffold
- [x] Initial Firestore indexes file

### Phase 1 (Next)

- [ ] Landing page refinement
- [ ] HAL-style guided intake flow
- [ ] Project creation and management
- [ ] Basic dashboard
- [ ] Authentication with Firebase

### Phase 2

- [ ] Stripe payment integration
- [ ] Credit system
- [ ] URL-only audit MVP

### Phase 3+

- [ ] Code/ZIP scanning
- [ ] AI report generation
- [ ] Growth recommendations
- [ ] Monitoring subscriptions
- [ ] Idea miner

## Security

BuildProof must be safer than the projects it audits.

See [SECURITY.md](docs/SECURITY.md) for detailed security policies and requirements.

### Key Principles

- No secrets in frontend code
- Firebase Security Rules on all user-owned Firestore/Storage data
- Webhook signature verification
- Server-side ownership checks
- Structured AI outputs
- Audit logging

## Environment Variables

### Frontend (safe to expose)

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-optional-measurement-id
```

### Backend (secrets only)

```env
FIREBASE_SERVICE_ACCOUNT_JSON={...}
OPENAI_API_KEY=sk-your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
GITHUB_APP_PRIVATE_KEY=your-github-private-key
```

## Documentation

- [Security Policy](docs/SECURITY.md) - Security requirements and policies
- [Privacy Policy](docs/PRIVACY.md) - User data handling
- [Agent Rules](docs/AGENT_RULES.md) - Rules for AI coding agents
- [Source of Truth Build Plan](BuildProof_Source_of_Truth_Build_Plan.md) - Complete product specification

## Contributing

Before implementing features:

1. Read the relevant section in the build plan.
2. Follow security guidelines.
3. Add tests or verification steps.
4. Keep UI minimal and guided, not chat-based.
5. Use TypeScript strict mode.

## Disclaimer

BuildProof provides automated risk assessment and remediation guidance. It does not guarantee that your product is secure and is not a substitute for professional penetration testing, legal advice, or compliance review.
