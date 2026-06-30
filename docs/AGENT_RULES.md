# AI Coding Agent Rules for BuildProof

Every AI coding agent must follow these rules to ensure code quality, security, and alignment with the build plan.

## Core Development Rules

1. **Do not implement features not requested** in the current task.
2. **Do not change database schema** without updating migrations and the build plan.
3. **Do not add secrets to source code** - ever.
4. **Do not disable RLS** - Row Level Security is required on all user-owned tables.
5. **Do not use service-role keys in frontend code**.
6. **Do not call OpenAI from the browser** - all AI calls must be backend/Edge Function only.
7. **Do not store raw uploaded code** unless explicitly required and documented.
8. **Do not create public buckets for private user uploads** - storage must be protected.
9. **Do not trust frontend payment success** - always verify via webhooks.
10. **Do not disable TypeScript strict mode**.

## Code Quality Rules

11. **Add tests or clear manual verification steps** for every feature.
12. **Keep UI minimal and guided, not chat-based** - follow HAL-inspired design.
13. **Use structured AI outputs** - JSON schema validation required, not freeform parsing.
14. **Redact secrets before storing snippets** - no API keys in database.
15. **Keep functions idempotent where possible** - safe to retry without side effects.
16. **Use TypeScript strict mode** - `noImplicitAny: true`, strict null checks.
17. **Add meaningful error messages** - users need plain-English explanations.
18. **Follow naming conventions** - camelCase for functions/variables, PascalCase for components.

## Security Rules

19. **Never expose environment variables** in bundle or logs.
20. **Always validate user input** before processing.
21. **Always sanitize file uploads** - validate type, size, content.
22. **Always verify Stripe webhooks** with signature check.
23. **Always check user ownership** on backend before returning data.
24. **Always use HTTPS** for all external communications.
25. **Always log sensitive operations** (without exposing secrets).
26. **Always implement rate limiting** for public endpoints.

## Database Rules

27. **Enable RLS on all user-owned tables**.
28. **Create policies for each operation** (select, insert, update, delete).
29. **Never use service-role in frontend** - use anon key with RLS instead.
30. **Index frequently queried columns** for performance.
31. **Add audit columns** (created_at, updated_at) to most tables.
32. **Use UUIDs for IDs** - not sequential integers.
33. **Add foreign key constraints** for referential integrity.

## API and Backend Rules

34. **All API endpoints must check auth** - no public routes without verification.
35. **All endpoints must validate RLS** - backend must not bypass it.
36. **All data modifications must be idempotent** - safe to retry.
37. **All errors must redact secrets** - never expose keys in error messages.
38. **All responses must include appropriate status codes**.
39. **All edge functions must timeout** - prevent resource exhaustion.

## Frontend Rules

40. **No secrets in environment variables** starting with `VITE_`.
41. **No hardcoded URLs** - use environment variables or constants.
42. **No direct table access** - use Edge Functions for privileged operations.
43. **No storing user passwords** - use Supabase Auth.
44. **No storing sensitive data** in localStorage - use secure cookies only.
45. **No calling OpenAI/Stripe/secrets** directly - use backend.

## Testing Rules

46. **Write security tests first** - test RLS, ownership, auth.
47. **Test error cases** - what happens when things fail?
48. **Test rate limiting** - verify limits work.
49. **Test file upload validation** - type, size, content checks.
50. **Test payment flows** - with mock Stripe events.

## Documentation Rules

51. **Document new database tables** with schema and purpose.
52. **Document new API endpoints** with auth, inputs, outputs.
53. **Document third-party integrations** with key flows.
54. **Document secret management** - where keys are stored, who accesses.
55. **Document deployment steps** for new features.

## Performance Rules

56. **Optimize database queries** - avoid N+1 queries.
57. **Use pagination for large datasets** - don't fetch 10,000 rows.
58. **Cache frequently accessed data** - use TanStack Query.
59. **Lazy load components** - code split on routes.
60. **Compress images and assets** - optimize for web.

## If in Doubt

- **Refer to the build plan** first - it's the source of truth.
- **Check SECURITY.md** - it has detailed security requirements.
- **Ask clarifying questions** if the task is ambiguous.
- **Default to secure** - if choosing between two options, pick the more secure one.
- **Default to minimal** - simpler code is easier to verify and maintain.

## Violation Handling

If you violate these rules:

1. **Stop immediately** - don't continue implementing.
2. **Revert changes** - undo the work that violates the rule.
3. **Explain the violation** - be transparent about what went wrong.
4. **Ask for guidance** - request clarification on the correct approach.
5. **Update the rule** - if the rule is outdated, request an update to this document.

## Checklist Before Submitting Code

- [ ] No secrets in code or environment variables exposed
- [ ] No feature outside the current task scope
- [ ] TypeScript strict mode enabled
- [ ] RLS enabled on all user-owned tables
- [ ] Tests or verification steps documented
- [ ] Error messages are user-friendly
- [ ] No chat-based UI added
- [ ] Backend calls for privileged operations
- [ ] Stripe/OpenAI calls only in backend
- [ ] File uploads validated
- [ ] Database queries optimized
- [ ] Documentation updated
- [ ] Security review passed

---

**These rules are non-negotiable.** Violations undermine the core promise of BuildProof: to be safer than the projects it audits.

