# Moots Forever Frame — Project Update

**Date:** May 18, 2026

## Current State

### Live site

- `https://mootsframe.com` is now published and pointing to Manus.

### DNS

GoDaddy DNS has been updated:

- `A @ -> 104.18.26.246`
- `A @ -> 104.18.27.246`
- `CNAME www -> cname.manus.space`

### Email

Resend domain verification is complete and sending is enabled.

- SPF configured.
- DKIM configured.
- Successful notification/email received.

### App health

- 21 tests passing.
- 0 TypeScript errors.
- Dev server clean.

### Feature work completed today

- Notification system implemented and production-ready.
- Contact info audit completed.
- Dependency/security cleanup improved in GitHub.

### Repo status

- PR #26 merged.
- Other PRs/branches remain open or messy and should be reviewed later, not urgently.

## Decisions

- **Hosting:** Manus hosts the live website.
- **Code/development:** GitHub is the source of truth for code, PRs, history, and security fixes.
- **DNS/domain:** GoDaddy manages DNS only.
- **Email delivery:** Resend is the email provider for transactional notifications.
- **Research/planning tools:** ChatGPT and Perplexity are support tools, not deployment/configuration sources of truth.
- **GitHub Pages:** Not the production host for `mootsframe.com`.

## Next Steps

### Immediate

Verify the live production site at:

- `https://mootsframe.com`
- `https://www.mootsframe.com`

Test critical flows on production:

- RSVP
- Booking/contact forms
- Community upload flow
- Admin notifications
- Email delivery

### Short-term

- Update the ChatGPT Project memory/brief with the current hosting and deployment model.
- Send Ian a concise status update summarizing:
  - Site is live.
  - Email works.
  - Notifications work.
  - Codebase/security improved.

### Later

Review remaining open PRs and decide which to merge, replace, or close:

- #27
- #28
- #29
- #31

Additional later work:

- Clean up stale GitHub branches.
- Continue feature development in GitHub, then publish through Manus.
- Consider adding:
  - Newsletter signup
  - Dealer testimonials
  - Event photo gallery

## Operating Model Going Forward

- Build and edit in GitHub.
- Publish and host in Manus.
- Manage DNS in GoDaddy.
- Send emails through Resend.

## One-Line Summary

Moots Forever Frame is now live on Manus at `mootsframe.com`, email/notifications are working, and the project now has a clear tool/hosting structure for future development.

## Governance Reminder

Doctrine governs tone. Territory authority governs routing. Signal rules govern presence.

Do not rebuild major architecture until production stabilization remains steady.
