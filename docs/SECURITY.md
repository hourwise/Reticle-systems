# Security Policy for BuildProof

## Non-Negotiable Principle

**BuildProof must be safer than the projects it audits.**

If the platform ever exposes keys, bypasses RLS, trusts frontend payment state, stores raw code unnecessarily, or produces unvalidated AI output, it has failed its own core promise.

## Absolutely Forbidden

- ❌ No API keys in frontend code
- ❌ No OpenAI calls from browser
- ❌ No Supabase service-role key in browser
- ❌ No Stripe secret key in browser
- ❌ No committed `.env` files
- ❌ No raw user code stored by default
- ❌ No admin access controlled only by frontend UI
- ❌ No report access without ownership checks
- ❌ No payment fulfilment from frontend success page
- ❌ No unrestricted file uploads
- ❌ No unvalidated AI JSON responses
- ❌ No public storage buckets for private uploads
- ❌ No database tables without RLS

## Required From Day One

- ✅ TypeScript strict mode
- ✅ Supabase RLS enabled on all user-owned tables
- ✅ Server-side ownership checks
- ✅ Stripe webhook signature verification
- ✅ OpenAI API key stored only as backend secret
- ✅ Supabase service-role key stored only as backend secret
- ✅ File upload validation
- ✅ ZIP size limits
- ✅ Job timeouts
- ✅ Audit logging
- ✅ AI cost logging
- ✅ Error logging (without exposing secrets)
- ✅ Rate limiting
- ✅ Security headers
- ✅ GDPR/privacy policy
- ✅ Data deletion flow

## Environment Variables

Only the following variables may be exposed to the frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

All other variables are backend-only secrets:
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GITHUB_APP_PRIVATE_KEY`

## Supabase Row Level Security

Every user-owned table must have RLS enabled with policies like:

```sql
create policy "Users can read own projects"
on projects for select
using (auth.uid() = user_id);

create policy "Users can insert own projects"
on projects for insert
with check (auth.uid() = user_id);

create policy "Users can update own projects"
on projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Apply this pattern to:
- projects
- project_answers
- audit_jobs
- audit_findings
- reports
- credits
- payments
- ai_usage_logs (where appropriate)

## Scanning Safety

### Rule 1: Deterministic checks first

Before AI is called, run cheap deterministic checks:
- secret scanning
- environment file detection
- dependency audit
- framework detection
- common insecure config checks

### Rule 2: Do not store raw code by default

```
Upload/repo import
  ↓
Temporary isolated scan workspace
  ↓
Run scanners
  ↓
Store findings only (redacted)
  ↓
Delete raw code after scan
```

### Rule 3: Store scanner rules, not users' code

Database should store reusable detection rules with:
- regex pattern
- provider
- severity
- explanation
- fix template

## AI Safety

- Never call OpenAI from the browser
- Use structured outputs / JSON schema for predictable responses
- Validate AI JSON against schema before storing
- Log all AI calls with tokens and estimated cost
- Do not expose unredacted secrets in reports
- Include disclaimer on all reports

## Payment Safety

- Never trust frontend payment success
- Always verify Stripe webhook signatures
- Only add credits when webhook confirms payment
- Implement idempotency for payment events
- Never fulfill credits before webhook confirmation
- Log all payment events

## File Upload Safety

- Validate file types (ZIP only initially)
- Implement size limits (default 500MB)
- Scan in isolated temporary directories
- Delete files after scanning
- Never store raw uploads in database
- Implement upload rate limiting

## Testing Requirements

### Security tests

- [ ] User cannot view another user's project
- [ ] User cannot view another user's report
- [ ] User cannot consume another user's credit
- [ ] Service-role key never appears in frontend bundle
- [ ] OpenAI key never appears in frontend bundle
- [ ] Stripe secret never appears in frontend bundle
- [ ] RLS blocks direct unauthorised table access
- [ ] Uploaded ZIP size limit works
- [ ] Unsafe file types rejected
- [ ] Secrets are redacted in stored snippets
- [ ] Payment webhook validates signature

## Auditing and Logging

All sensitive operations must be logged:
- User authentication events
- Project access
- Report generation
- Payment events
- AI API calls
- Scanner job execution
- Error conditions (without exposing secrets)

## Incident Response

If a security issue is discovered:
1. Immediately disable affected features if necessary
2. Notify affected users
3. Document the incident
4. Implement a fix
5. Add test to prevent regression
6. Update this security policy if needed

## Compliance

- Comply with GDPR data deletion requirements
- Provide privacy policy and terms of service
- Implement data retention policies
- Allow users to export their data
- Allow users to delete projects and reports
- Never sell user data
- Only use data as described in privacy policy

---

**Last updated:** 2024
**Owner:** BuildProof Security Team

