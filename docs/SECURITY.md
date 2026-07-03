# Security Policy for Reticle Systems

## Non-Negotiable Principle

Reticle Systems must be safer than the projects it audits.

If the platform ever exposes keys, bypasses Firebase Security Rules, trusts frontend payment state, stores raw code unnecessarily, or produces unvalidated AI output, it has failed its own core promise.

## Absolutely Forbidden

- No API keys in frontend code.
- No OpenAI calls from the browser.
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

## Required From Day One

- TypeScript strict mode.
- Firebase Security Rules enabled for Firestore and Storage.
- Server-side ownership checks in Cloud Functions and workers.
- Stripe webhook signature verification.
- OpenAI API key stored only as a backend secret.
- Firebase service account credentials stored only as backend/server secrets.
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

## Environment Variables

Only Firebase web app config may be exposed to the frontend:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

All other variables are backend-only secrets:

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GITHUB_APP_PRIVATE_KEY`

## Firebase Security Rules

Every user-owned Firestore document must include `userId` equal to the Firebase Authentication UID. Every direct client read/write must be constrained by Firebase Security Rules. Privileged writes must happen only in Cloud Functions or trusted workers using server-side ownership checks.

Baseline ownership pattern:

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

    match /projects/{projectId} {
      allow read, update, delete: if ownsExisting();
      allow create: if ownsIncoming();
    }
  }
}
```

Apply equivalent ownership protection to:

- users / profiles
- projects
- project answers
- audit jobs
- audit findings
- reports
- credits
- credit ledger
- payments
- AI usage logs where appropriate

## Storage Safety

- Private user uploads must live under authenticated user paths such as `users/{userId}/uploads/{fileName}`.
- Users may only read/write paths that match their own Firebase Auth UID.
- Generated reports should be readable by the owner only and writable only by backend processes.
- All catch-all Storage paths must deny reads and writes by default.

## Scanning Safety

### Rule 1: Deterministic checks first

Before AI is called, run cheap deterministic checks:

- secret scanning
- environment file detection
- dependency audit
- framework detection
- common insecure config checks

### Rule 2: Do not store raw code by default

```text
Upload/repo import
  -> Temporary isolated scan workspace
  -> Run scanners
  -> Store findings only, redacted
  -> Delete raw code after scan
```

### Rule 3: Store scanner rules, not users' code

The database should store reusable detection rules with:

- regex pattern
- provider
- severity
- explanation
- fix template

## AI Safety

- Never call OpenAI from the browser.
- Use structured outputs / JSON schema for predictable responses.
- Validate AI JSON against schema before storing.
- Log all AI calls with tokens and estimated cost.
- Do not expose unredacted secrets in reports.
- Include disclaimer on all reports.

## Payment Safety

- Never trust frontend payment success.
- Always verify Stripe webhook signatures.
- Only add credits when a webhook confirms payment.
- Implement idempotency for payment events.
- Never fulfill credits before webhook confirmation.
- Log all payment events.

## File Upload Safety

- Validate file types, ZIP only initially.
- Implement size limits.
- Scan in isolated temporary directories.
- Delete files after scanning.
- Never store raw uploads in Firestore.
- Implement upload rate limiting.

## Testing Requirements

- [ ] User cannot view another user's project.
- [ ] User cannot view another user's report.
- [ ] User cannot consume another user's credit.
- [ ] Firebase service account key never appears in frontend bundle.
- [ ] OpenAI key never appears in frontend bundle.
- [ ] Stripe secret never appears in frontend bundle.
- [ ] Firestore Security Rules block direct unauthorised document access.
- [ ] Firebase Storage Rules block unauthorised private upload access.
- [ ] Uploaded ZIP size limit works.
- [ ] Unsafe file types are rejected.
- [ ] Secrets are redacted in stored snippets.
- [ ] Payment webhook validates signature.

## Auditing and Logging

All sensitive operations must be logged without exposing secrets:

- User authentication events
- Project access
- Report generation
- Payment events
- AI API calls
- Scanner job execution
- Error conditions

## Incident Response

If a security issue is discovered:

1. Immediately disable affected features if necessary.
2. Notify affected users where required.
3. Document the incident.
4. Implement a fix.
5. Add a test to prevent regression.
6. Update this security policy if needed.

## Compliance

- Comply with GDPR data deletion requirements.
- Provide privacy policy and terms of service.
- Implement data retention policies.
- Allow users to export their data.
- Allow users to delete projects and reports.
- Never sell user data.
- Only use data as described in the privacy policy.

**Last updated:** June 2026
**Owner:** Reticle Systems Security Team
