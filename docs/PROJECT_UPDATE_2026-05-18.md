# Moots Forever Frame — Project Update

**Date:** May 18, 2026

## What was completed today

### Custom domain is now live

- `mootsframe.com` is published and connected to the live Manus deployment.
- DNS was updated in GoDaddy.
- Root domain now points to Manus.
- `www` points to Manus via CNAME.

### Email delivery is working

- Resend domain verification completed.
- SPF and DKIM are configured.
- Sending is enabled.
- Test notification/email was successfully received.

### GitHub repo/security work completed

- Merged PR #26.
- Upgraded Vitest.
- Removed old vulnerable `vite@5.4.21` path from the lockfile.
- Branch/repo state is cleaner and more secure than before.

### App/runtime improvements

- Dealers map fallback logic was reviewed and improved so missing Forge env vars do not break the static/fallback experience.
- Contact info audit completed.
- Outdated references updated.

### Notification system added

- Custom notification system implemented.
- Admin notification center added.
- Unread count/badge added.
- Territory-targeted notifications supported.
- Mark-as-read and delete actions supported.
- Form toast notifications working.
- At least one successful notification was received.

## Current app health

- 21 tests passing.
- 0 TypeScript errors.
- Dev server running clean.
- Site considered production-ready in Manus.

## Current platform/tool roles

- **Manus** = live hosting / publish.
- **GitHub** = codebase, PRs, version control, security fixes.
- **GoDaddy** = DNS/domain management.
- **Resend** = transactional email delivery.
- **ChatGPT / Perplexity** = planning, debugging help, copy/research support.

## Important decisions clarified

- `mootsframe.com` should be hosted via Manus, not GitHub Pages.
- GitHub remains important for development, code management, and security.
- Resend email setup is active and functioning.

## Outstanding / later items

- Review remaining open GitHub PRs: #27, #28, #29, #31.
- Clean up stale GitHub branches later.
- Continue building out pages/features in GitHub, then publish through Manus.
- Optionally add newsletter signup, testimonials, and event gallery content later.

## Current status summary

The website is live, email works, notifications work, and the project is in a much stronger state than it was at the start of the day.

## Governance reminder

Doctrine governs tone. Territory authority governs routing. Signal rules govern presence.

Do not rebuild major architecture until production stabilization remains steady.
