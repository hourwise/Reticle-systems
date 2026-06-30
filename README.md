# BuildProof

> Build fast. Launch safely.

**Launch readiness and security audit platform for AI-built applications.**

BuildProof helps non-technical founders and AI-assisted builders move from idea to launch with safer code, clearer structure, and better growth plans.

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase project
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

# Edit .env.local with your actual keys (backend only)
# Keep VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY only
```

### Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
buildproof/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── features/           # Feature-specific modules
│   ├── lib/                # Utilities and services
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── styles/             # Global styles
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── docs/                   # Documentation
├── .env.example           # Environment variables template
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── vite.config.ts         # Vite config
└── package.json           # Dependencies
```

## Tech Stack

### Frontend
- **Vite** - Fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Framer Motion** - Animations

### Backend (Phase 1+)
- **Supabase** - Backend as a Service
  - Auth
  - PostgreSQL database
  - Row Level Security (RLS)
  - Storage
  - Edge Functions
- **Stripe** - Payment processing
- **OpenAI API** - AI capabilities

### Scanning Tools (Phase 2+)
- **Gitleaks** - Secret detection
- **Semgrep** - Static security analysis
- **npm audit** - Dependency vulnerabilities
- **Lighthouse** - Performance/SEO/accessibility

## Features

### Phase 0 ✅ (Current)
- [x] Project scaffolding
- [x] TypeScript setup
- [x] Tailwind CSS configured
- [x] Router setup
- [x] Supabase client configured
- [ ] Database migrations
- [ ] RLS policies

### Phase 1 (Next)
- [ ] Landing page
- [ ] HAL-style guided intake flow
- [ ] Project creation and management
- [ ] Basic dashboard
- [ ] Authentication with Supabase

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

**BuildProof must be safer than the projects it audits.**

See [SECURITY.md](docs/SECURITY.md) for detailed security policies and requirements.

### Key Principles

- ✅ No secrets in frontend code
- ✅ Supabase RLS on all user tables
- ✅ Webhook signature verification
- ✅ Server-side ownership checks
- ✅ Structured AI outputs
- ✅ Audit logging

## Environment Variables

### Frontend (safe to expose)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (secrets only)
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
```

## Documentation

- [Security Policy](docs/SECURITY.md) - Security requirements and policies
- [Build Plan](docs/BUILD_PLAN.md) - Complete product specification
- [Privacy Policy](docs/PRIVACY.md) - User data handling

## Contributing

This project follows the coding standards outlined in the build plan. Before implementing features:

1. Read the relevant section in the build plan
2. Follow security guidelines
3. Add tests or verification steps
4. Keep UI minimal and guided (not chat-based)
5. Use TypeScript strict mode

## Support

For issues or questions:
1. Check the documentation
2. Review the build plan
3. File an issue with details

## License

[Add license here]

## Disclaimer

BuildProof provides automated risk assessment and remediation guidance. It does not guarantee that your product is secure and is not a substitute for professional penetration testing, legal advice, or compliance review.

