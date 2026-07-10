This information is a development philosophy, not a feature specification.

I'd create a separate foundational document that every AI agent (Codex, Claude Code, Gemini, future ODIN agents, and even human developers) is expected to read before contributing.

I'd place it near the top of the Source of Truth:

/docs
│
├── 00_Foundation
│   ├── 00.1_Vision.md
│   ├── 00.2_Product_Philosophy.md
│   ├── 00.3_AI_Development_Philosophy.md   ← NEW
│   ├── 00.4_AI_Agent_Workflow.md           ← NEW
│   ├── 00.5_Prompt_Engineering_Guide.md    ← NEW
│   └── 00.6_Engineering_Principles.md

I would split it into three documents because they serve different purposes:

00.3 – AI Development Philosophy

This explains how Reticle Systems believes AI-assisted software should be built, including:

Outcome-first, not implementation-first.
Small incremental changes.
Documentation before code.
Continuous review and improvement.
Human owns vision; AI owns execution details.
Stay model-agnostic.
Teach the user, don't just generate output.
Preserve user ownership and avoid vendor lock-in.
00.4 – AI Agent Workflow

This is effectively the playbook for ODIN and external agents:

Discover
Clarify
Plan
Self-review the plan
Break work into logical slices
Implement one slice
Test
Fix
Document
Commit
Repeat
Final architectural review

It also covers multi-agent coordination, branch strategy, review loops, bug triage, and project memory.

00.5 – Prompt Engineering Guide

This becomes your internal "best practices" manual:

How to write high-quality briefs.
How to use /goal.
When to ask AI for planning versus implementation.
How to review AI output.
How to avoid over-constraining the model.
When to prototype first.
How to use voice input effectively.
When to switch models.
When to run review/improvement passes.

I also think we should add one principle that wasn't explicitly in the Reddit discussion but has emerged from our own work together:

AI should optimise for maintainability, not maximum code generation.

That means ODIN should actively prefer:

fewer files where appropriate,
simpler architectures,
readable code,
fewer dependencies,
incremental evolution,
and refactoring over unnecessary expansion.

I actually think these three documents are some of the most important in the entire Source of Truth. They don't describe what Reticle Systems builds—they define how every future feature should be built. As ODIN becomes more autonomous, these principles become the guardrails that keep both human developers and AI agents aligned with the platform's philosophy.