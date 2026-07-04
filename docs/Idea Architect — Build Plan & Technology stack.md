# Idea Architect — Build Plan & Technical Roadmap

## 1. Product Vision

Idea Architect is a browser-first platform that turns vague ideas into structured, buildable projects.

It helps users:

* clarify what they want to build
* validate the idea
* choose the right format: app, website, store, video, business, game, document, campaign
* generate a build plan
* generate project files
* control budget before work begins
* export, deploy, or continue building in external tools

The long-term version becomes a remote AI execution platform with optional local tooling, MCP connectors, a VS Code-compatible extension, and eventually a private self-hosted coding server.

---

# 2. Core Principles

## 2.1 No Surprise Pricing

Every task is quoted before work starts.

The system must never silently consume extra credits.

If the scope changes, a new quote is shown before continuing.

## 2.2 User Owns the Output

The user must be able to export:

* source code
* documentation
* database schema
* environment variable templates
* deployment instructions
* generated assets
* prompts
* project memory

Avoid hidden backend lock-in.

## 2.3 Planning Before Building

The platform should not jump straight from vague prompt to generated app.

It should first understand:

* user goal
* skill level
* budget
* timeframe
* desired output
* technical confidence
* commercial ambition
* future expansion plans

## 2.4 Cheapest Capable Model First

Use premium frontier models for planning, reasoning and review.

Use lower-cost models for well-scoped implementation tasks.

---

# 3. High-Level Roadmap

```text
Phase 1 — Browser Planning MVP
Phase 2 — Cloud Project Generator
Phase 3 — Remote Build Workspace
Phase 4 — Multi-Agent Build Pipeline
Phase 5 — MCP Tool Layer
Phase 6 — VS Code / Open VSX Extension
Phase 7 — Downloadable Local Helper
Phase 8 — Private AI Coding Server
```

---

# 4. Phase 1 — Browser Planning MVP

## Goal

Build the first useful version without creating a full IDE.

The user enters an idea and answers structured questions.

The platform outputs a professional idea pack.

## Features

* user account
* project dashboard
* idea interview flow
* project type detection
* budget selector
* skill-level selector
* timeframe selector
* AI-generated project summary
* feasibility report
* recommended next steps
* downloadable PDF/Markdown report
* payment tiers

## Output Files

```text
README.md
idea-summary.md
validation-report.md
business-model.md
budget-plan.md
build-plan.md
marketing-plan.md
learning-plan.md
```

## Suggested Stack

```text
Frontend: Next.js or Vite React
Backend: Supabase / Postgres
Auth: Supabase Auth or Clerk
Payments: Stripe
Storage: Supabase Storage or S3-compatible storage
AI Gateway: LiteLLM
Hosting: Vercel
```

LiteLLM is useful because it can track spend by model, key, user and team, which supports the hard-budget principle.

---

# 5. Phase 2 — Cloud Project Generator

## Goal

Move from reports to actual generated project packs.

The user should receive real files, not “paste this snippet here” instructions.

## Features

* generate full project file tree
* generate source-of-truth documents
* generate `agents.md`
* generate `.env.example`
* generate database schema
* generate starter frontend
* generate starter backend
* generate deployment instructions
* ZIP export
* GitHub export

## Output Example

```text
/project-root
  README.md
  agents.md
  .env.example
  /docs
    build-plan.md
    architecture.md
    database.md
    roadmap.md
    testing.md
    security.md
  /src
  /supabase
    schema.sql
    policies.sql
```

## Important Rule

The platform should explain every technical choice.

Example:

```text
We selected Supabase because this project needs authentication, Postgres, file storage and row-level security without a custom backend.
```

---

# 6. Phase 3 — Remote Build Workspace

## Goal

Allow users to preview, edit, regenerate and export generated projects inside the browser.

This does not need to be a full IDE at first.

## Features

* file tree viewer
* markdown preview
* code preview
* editable files
* regenerate selected file
* project memory panel
* task list
* export ZIP
* push to GitHub
* deploy to Vercel / Netlify / Railway

## Possible Editor Options

* Monaco editor
* browser-based VS Code-style editor
* later Theia-based cloud IDE

The VS Code Extension API is designed for extensibility, and Theia/Open VSX-compatible ecosystems may become useful later for a browser coding environment.

---

# 7. Phase 4 — Multi-Agent Remote Build Pipeline

## Goal

Turn Idea Architect into a remote build factory.

The user approves a fixed-cost build package.

The system builds the project task-by-task.

## Architecture

```text
User Project
↓
Frontier Model Planner
↓
Structured Build Blueprint
↓
Task Splitter
↓
Queue System
↓
Coding Agent
↓
Sandboxed Build Runner
↓
Test Runner
↓
Reviewer Agent
↓
Export / Deploy
```

## Suggested Services

```text
Queue: Redis + BullMQ, Celery, or Temporal
Workers: Docker/Podman containers
Repo Storage: GitHub, Gitea, or GitLab
AI Router: LiteLLM
Build Logs: Loki/Grafana or simple Postgres logs first
```

## Agent Roles

```text
Product Architect
Technical Architect
UX Designer
Backend Engineer
Frontend Engineer
Test Engineer
Security Reviewer
Documentation Writer
Marketing Assistant
```

## Build Flow

1. Generate blueprint.
2. Split work into small tickets.
3. Create isolated branch.
4. Generate code.
5. Run tests.
6. Fix errors.
7. Review diff.
8. Commit.
9. Merge.
10. Export/deploy.

---

# 8. Phase 5 — MCP Tool Layer

## Goal

Use MCP as the connector layer between Idea Architect and external tools.

MCP resources allow servers to expose files, database schemas and application data to AI clients as context.

## Potential MCP Servers

```text
GitHub MCP
Supabase MCP
Vercel MCP
Stripe MCP
Google Drive MCP
Figma MCP
Wix MCP
Shopify MCP
YouTube MCP
Notion MCP
Local Files MCP
```

## Use Cases

```text
Website project → connect GitHub + Vercel
Online store → connect Shopify/Wix
Video project → connect asset storage + script generator
App project → connect Supabase + GitHub + deployment
Business project → connect Drive/Docs export
```

## Security Rule

MCP must be permission-scoped.

The user should approve:

```text
This project wants access to:
✓ GitHub repository
✓ Supabase schema
✓ Vercel deployment
```

Avoid broad account-level access.

---

# 9. Phase 6 — VS Code / Open VSX Extension

## Goal

Let users continue projects in their own coding environment.

This avoids lock-in and supports real developers.

## Extension Features

* open Idea Architect project memory inside VS Code
* sync `agents.md`
* sync build tasks
* pull latest source-of-truth docs
* send selected files/diffs for review
* request next implementation task
* run BuildProof-style scan
* update project history after commits

## Distribution Options

* VS Code Marketplace
* Open VSX Registry

Open VSX is an open-source, vendor-neutral extension registry for VS Code-compatible tools and AI-native IDEs.

## Future Compatible Tools

```text
VS Code
VSCodium
Cursor
Windsurf
Antigravity
Theia-based IDEs
Other VS Code-compatible editors
```

---

# 10. Phase 7 — Downloadable Local Helper

## Goal

Create optional software that allows Idea Architect to safely work with files on the user’s own machine.

This is useful for users who want local ownership, Android Studio, desktop builds, or private repositories.

## What It Does

```text
Writes files locally
Runs npm install
Runs tests
Runs builds
Manages Git branches
Opens VS Code / Android Studio
Syncs project status to cloud
Streams logs back to browser
```

## Form Factor

Start with a small signed desktop helper.

Later expand into:

```text
Windows installer
macOS app
Linux AppImage/deb
CLI tool
local agent service
```

## Security Requirements

* signed binaries
* explicit folder permissions
* no unrestricted disk access
* user-approved commands only
* project-specific sandbox
* local audit log
* emergency stop button

## Example Flow

```text
Browser says:
“Install the local helper to build this on your machine.”

User installs helper.

Browser sends:
“Create project in C:/Users/Phil/Projects/MyApp”

Helper creates files, runs install, starts dev server.
```

---

# 11. Phase 8 — Private AI Coding Server

## Goal

Use your own GPU server for low-cost coding tasks while frontier models handle planning and review.

## Architecture

```text
Frontier Model
- discovery
- planning
- architecture
- final review

Private AI Server
- code generation
- refactoring
- repetitive fixes
- test repair
- documentation drafts
```

## Inference Runtime

vLLM is a strong candidate because it provides OpenAI-compatible serving, making self-hosted models easier to route through the same API style as commercial models.

## Server Flow

```text
Idea Architect
↓
LiteLLM Router
↓
External Frontier Models
or
Private vLLM Server
↓
Queue Workers
↓
Docker Build Runners
```

## Practical Long-Term Hardware Path

```text
Stage 1: external APIs only
Stage 2: low-cost coding APIs
Stage 3: single GPU test server
Stage 4: multi-GPU local server
Stage 5: datacentre/colo if usage justifies it
```

## Do Not Start Here

Self-hosting only makes sense once usage is high enough.

Until then, orchestration matters more than hardware.

---

# 12. Pricing System

## Fixed Quote Model

Every task must be quoted before execution.

```text
Build landing page
Platform fee: £5.00
AI execution: £1.20
Total: £6.20

Approved maximum: £6.20
```

If the task exceeds estimate, the system absorbs the difference or stops safely.

It must not demand surprise credits mid-task.

## Budget Modes

```text
Budget Mode
- cheapest capable models
- slower
- good for MVPs

Balanced Mode
- frontier planning
- cheap coding
- frontier review

Premium Mode
- best models throughout
- best for investor packs, complex apps, enterprise work
```

## Hard Budget Controller

```text
User budget: £25
Spent: £7.40
Remaining: £17.60
Estimated to complete: £11.20
Safe to continue: Yes
```

---

# 13. Product Types Supported

## Software

* web app
* SaaS
* mobile app
* game
* internal tool
* API
* browser extension

## Business

* startup idea
* online store
* local service business
* consultancy
* marketplace
* content business

## Creative

* video concept
* music video
* social campaign
* advert
* brand identity
* pitch deck
* launch campaign

## Non-Coding Outputs

For Wix, Shopify, videos or documents, the platform should not force a coding workflow.

It should generate the right project pack:

```text
Wix store:
- page copy
- product structure
- SEO metadata
- image prompts
- setup guide
- launch checklist

Video:
- concept
- storyboard
- shot list
- narration
- music prompt
- captions
- export plan
```

---

# 14. MVP Scope Recommendation

The first version should not include:

* full IDE
* MCP
* downloadable helper
* private GPU server
* automated deployment
* multi-agent build execution

The first version should include:

```text
Idea interview
Project type detection
Budget-first planning
AI-generated build plan
agents.md generation
ZIP export
Stripe payments
Project dashboard
No-surprise pricing
```

This is enough to validate demand.

---

# 15. Strategic Positioning

Do not position this as “another Bolt”.

Position it as:

```text
The AI product architect that helps you work out what to build before you build it.
```

Suggested promise:

```text
From unfinished idea to clear plan, files, budget and next steps — without surprise AI costs.
```

The key difference is not faster code generation.

The key difference is:

```text
Discovery
Clarity
Ownership
Budget control
Exportability
Long-term project memory
```

---

# 16. Long-Term End State

The final version becomes:

```text
Idea Architect Cloud
+
AI planning system
+
remote build factory
+
browser workspace
+
MCP connector layer
+
VS Code/Open VSX extension
+
downloadable local helper
+
optional private AI coding server
```

At that stage it can support:

* people with vague ideas
* non-technical founders
* developers
* agencies
* content creators
* small businesses
* AI-assisted builders

The platform’s strongest promise:

```text
You do not need to know exactly what you want yet.

We help you find it, plan it, price it, build it and own it.
```
