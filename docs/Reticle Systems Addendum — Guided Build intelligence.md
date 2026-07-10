# Reticle Systems Addendum — Guided Build Intelligence

## Core Insight

ODIN must not stop at recommending a technology stack.

The platform should continue guiding the user through account creation, setup, configuration, development, testing, deployment and launch.

The level of guidance should adapt to the user's technical confidence.

---

# Knowledge Level Modes

## Level 0 — Complete Beginner

The user has little or no technical knowledge.

ODIN should provide:

* simple explanations
* account creation instructions
* copy-and-paste setup guidance
* screenshots or visual walkthroughs where possible
* warnings before sensitive steps
* plain English explanations of API keys, environment variables, billing and deployment

Example:

```text
First, create a free GitHub account.

When finished, return here and click “I’ve created GitHub”.
```

---

## Level 1 — Basic User

The user can follow instructions but does not understand the full technical stack.

ODIN should provide:

* guided setup steps
* explanations of why each service is needed
* exact values to copy
* confirmation checkpoints
* troubleshooting help

---

## Level 2 — Builder

The user understands basic development tools.

ODIN should provide:

* generated files
* setup commands
* environment variable templates
* service links
* deployment checklist
* optional explanations

---

## Level 3 — Developer

The user is comfortable with modern tooling.

ODIN should provide:

* concise technical instructions
* architecture decisions
* generated code
* schema
* testing instructions
* deployment notes

---

## Level 4 — Expert

The user wants minimal hand-holding.

ODIN should provide:

* architecture pack
* repository
* task list
* build commands
* begin button

Example:

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

Click Begin when ready.
```

---

# Standard SaaS Stack Template

For many software projects, ODIN may recommend:

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

## Purpose of Each Tool

* Next.js: web application framework
* TypeScript: safer JavaScript
* Tailwind: styling
* shadcn/ui: reusable interface components
* Supabase: database, authentication and storage
* Stripe: payments and subscriptions
* Vercel: hosting and deployment
* GitHub: source control
* Playwright: automated browser testing
* Sentry: error tracking
* PostHog: analytics and user behaviour

---

# Guided Setup Principle

For every chosen technology, ODIN should provide:

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

---

# Production Guidance Must Continue

ODIN should not stop after generating files.

During production, it should continue asking:

* Have you created the required account?
* Have you copied the API key?
* Have you added the environment variable?
* Have you deployed successfully?
* Did the test pass?
* Do you want ODIN to diagnose the error?

---

# Example Beginner Flow

## Step 1 — GitHub

```text
You need GitHub so your project has a safe source-code backup.

Create an account at GitHub.

When finished, click:
“I have created my GitHub account.”
```

## Step 2 — Supabase

```text
You need Supabase for login, database and storage.

Create a new Supabase project.

Copy the Project URL and anon key.

Paste them into the boxes below.
```

## Step 3 — Stripe

```text
You need Stripe only if your project charges users.

If you are not charging users yet, ODIN can skip this step for now.
```

## Step 4 — Vercel

```text
You need Vercel to publish your website.

Connect your GitHub account to Vercel.

ODIN will help you deploy when the repository is ready.
```

---

# Adaptive Instruction Rule

ODIN should always adjust instructions based on the user’s selected knowledge level.

The same task should have different guidance depths.

Example:

## Beginner

```text
Click the green “New project” button.
Choose your organisation.
Type the project name exactly as shown below.
```

## Developer

```text
Create Supabase project.
Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.
```

## Expert

```text
Configure Supabase env vars and run migrations.
```

---

# Service Setup Checklist System

Each project should include a setup checklist:

```text
GitHub account
Repository created
Supabase project created
Database schema installed
Environment variables added
Stripe keys added
Vercel project connected
Deployment successful
Playwright tests passing
Sentry configured
PostHog configured
```

Each item should have:

* status
* owner
* instructions
* validation method
* troubleshooting steps

---

# ODIN’s Role

ODIN acts as:

* product architect
* technical guide
* setup assistant
* project manager
* debugger
* QA reviewer
* launch coach

The goal is not simply to tell users what stack to use.

The goal is to walk them from:

```text
I have an idea
```

to:

```text
My product is live and I understand how it works.
```

---

# Updated Differentiator

Most AI builders generate software.

Reticle Systems teaches, guides, builds, reviews and hands over ownership.

The user should never feel abandoned between recommendation and execution.
