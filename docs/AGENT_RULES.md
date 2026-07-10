# AI Coding Agent Rules for Reticle Systems

Every AI coding agent must follow these rules to ensure code quality, security, and alignment with the build plan.

## Core Development Rules

1. Do not implement features not requested in the current task.
2. Do not change the Firestore data model without updating Firebase rules, indexes where needed, and the build plan.
3. Do not add secrets to source code.
4. Do not weaken Firebase Security Rules.
5. Do not use Firebase service account credentials or Admin SDK privileges in frontend code.
6. Do not call OpenAI from the browser. All AI calls must happen in backend functions or trusted workers.
7. Do not store raw uploaded code unless explicitly required and documented.
8. Do not create public Firebase Storage paths for private user uploads.
9. Do not trust frontend payment success. Always verify via Stripe webhooks.
10. Do not disable TypeScript strict mode.

## Code Quality Rules

11. Add tests or clear manual verification steps for every feature.
12. Keep UI minimal and guided, not chat-based. Follow the HAL-inspired design direction.
13. Use structured AI outputs with JSON schema validation, not freeform parsing.
14. Redact secrets before storing snippets.
15. Keep functions idempotent where possible.
16. Use TypeScript strict mode.
17. Add meaningful error messages with plain-English explanations.
18. Follow naming conventions: camelCase for functions/variables and PascalCase for components.

## Security Rules

19. Never expose backend environment variables in bundles or logs.
20. Always validate user input before processing.
21. Always sanitize file uploads by type, size, and content.
22. Always verify Stripe webhooks with signature checks.
23. Always check user ownership on the backend before returning private data.
24. Always use HTTPS for external communications.
25. Always log sensitive operations without exposing secrets.
26. Always implement rate limiting for public endpoints.

## Firestore and Storage Rules

27. Protect every user-owned Firestore document with `userId` ownership rules.
28. Keep sensitive writes server-only, including credits, payments, findings, reports, and AI usage logs.
29. Never use Firebase Admin SDK in frontend code.
30. Add Firestore indexes for frequently queried fields.
31. Add audit fields such as `createdAt` and `updatedAt` where useful.
32. Use Firestore auto IDs unless a stable external ID is required.
33. Protect Firebase Storage with per-user paths and deny all unmatched paths.

## API and Backend Rules

34. All API endpoints and Cloud Functions must check authentication unless explicitly public.
35. Backend functions must perform ownership checks even when Firestore rules also exist.
36. Data modifications should be idempotent and safe to retry.
37. All errors must redact secrets.
38. All responses must include appropriate status codes.
39. Long-running functions must have explicit timeout and failure handling.

## Frontend Rules

40. No secrets in environment variables starting with `VITE_`.
41. No hardcoded service URLs where configuration is required.
42. No privileged Firestore writes directly from the browser.
43. No storing user passwords. Use Firebase Authentication.
44. No storing sensitive data in localStorage.
45. No calling OpenAI, Stripe secret APIs, or private GitHub APIs directly from the browser.

## Testing Rules

46. Write security tests for rules, ownership, and auth.
47. Test error cases.
48. Test rate limiting.
49. Test file upload validation.
50. Test payment flows with mock Stripe events.

## Documentation Rules

51. Document new Firestore collections with schema and purpose.
52. Document new Cloud Functions/API endpoints with auth, inputs, and outputs.
53. Document third-party integrations with key flows.
54. Document secret management.
55. Document deployment steps for new features.

## Performance Rules

56. Optimize Firestore queries and add indexes where needed.
57. Use pagination for large datasets.
58. Cache frequently accessed data with TanStack Query.
59. Lazy load components where useful.
60. Compress images and assets.

## If in Doubt

- Refer to the build plan first. It is the source of truth.
- Check `docs/SECURITY.md` for detailed security requirements.
- Ask clarifying questions if the task is ambiguous.
- Default to secure.
- Default to minimal.

## Violation Handling

If you violate these rules:

1. Stop immediately.
2. Revert only your own violating changes.
3. Explain the violation.
4. Ask for guidance.
5. Update the rule only if the rule is outdated and the user approves.

## Checklist Before Submitting Code

- [ ] No secrets in code or exposed environment variables.
- [ ] No feature outside the current task scope.
- [ ] TypeScript strict mode remains enabled.
- [ ] Firebase Security Rules protect user-owned data.
- [ ] Tests or verification steps are documented.
- [ ] Error messages are user-friendly.
- [ ] No chat-based UI added.
- [ ] Backend calls are used for privileged operations.
- [ ] Stripe/OpenAI calls happen only in backend code.
- [ ] File uploads are validated.
- [ ] Firestore queries are indexed where required.
- [ ] Documentation is updated.
- [ ] Security review passed.

These rules are non-negotiable. Violations undermine the core promise of Reticle Systems: to be safer than the projects it audits.
