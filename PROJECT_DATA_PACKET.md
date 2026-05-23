# Moots Forever Frame — Transferable Data Packet

## 1. Project Name
**Moots Forever Frame**

---

## 2. System Layer
**Publication** (with secondary **Execution** components)

This project sits at the Publication layer—it is the public-facing marketing campaign website that broadcasts Moots Bicycle's brand narrative, territory presence, and event participation to end-users. It contains Execution-layer components (booking system, RSVP tracking, lead capture) that feed signals upstream into the business operations layer.

---

## 3. Authority Tier
**Tier 2: Campaign Authority** (subject to Moots brand guidelines and Ian Zakrocki's approval)

This project has authority to:
- Publish verified marketing content (territories, events, testimonials)
- Capture and store customer data (RSVPs, bookings, leads, photos)
- Manage community contributions (photo uploads, moderation queue)
- Send notifications to customers and admins

This project does NOT have authority to:
- Modify Moots product specifications or pricing
- Commit to dealer inventory or availability
- Override verification status on routes or events
- Change contact information without explicit approval

---

## 4. Primary Purpose
**Sell the Moots brand narrative ("The Forever Frame") across three territories (Bentonville AR, Austin TX, Oklahoma City OK) by creating an immersive, vibe-driven marketing experience that captures customer intent (RSVPs, bookings, leads) and builds community engagement (photo sharing, testimonials).**

---

## 5. Core Functions

| Function | Responsibility | Owner |
|----------|-----------------|-------|
| **Territory Explorer** | Display location-specific content (coffee shops, breweries, weather, ride calendar) for AR/TX/OK | Homepage, dynamic data from weather API + database |
| **Event Management** | Host ride calendar with RSVP tracking, confirmation emails, admin analytics | Ride Calendar page, event_rsvps table, Resend email service |
| **Pop-Up Booking** | Capture booking requests for "Espresso & Dirt" events with territory/date selection | Booking form, bookings table, notifyOwner alerts |
| **Community Contribution** | Accept photo uploads, apply moderation queue, display approved photos with territory/event/tag filtering | Community page, community_photos table, admin moderation panel |
| **Build Configurator** | Guide users through 5-step flow (use case → terrain → budget → territory → recommendation) and capture leads | Build Configurator page, configurator_leads table |
| **Dealer Network** | Display 51 dealer locations on map with territory color-coding and contact info | Dealers page, Google Maps integration |
| **Model Comparison** | Allow side-by-side comparison of up to 4 Moots bike models with specs and CTAs | Comparison page, bike_models table |
| **Education** | Explain titanium material science, build process, warranty, and trade-up program | Engineering page, static content |
| **Testimonials** | Display verified dealer quotes in carousel format | Homepage carousel, testimonials table |
| **Instagram Integration** | Fetch and display latest 12 Instagram posts with graceful fallback | Homepage, Instafeed.js library |
| **Notification System** | Send in-app and email notifications to admins and customers (7 types: RSVP, booking, upload, lead, custom, reminder, announcement) | Notification router, notifications table, Sonner toast library |
| **Admin Dashboard** | Provide admins with photo moderation queue, RSVP list, analytics, and notification center | Admin page, protected routes, role-based access |
| **Newsletter Signup** | Collect email addresses for future marketing campaigns | Newsletter form, newsletter_subscribers table (backend wired, frontend integration pending) |
| **Switzerland Expansion** | Prepare shell for Swiss territory with route cards, verification badges, and expansion roadmap | Switzerland page, routes table (not yet populated with verified data) |

---

## 6. Inputs

| Input Type | Source | Format | Frequency | Validation |
|-----------|--------|--------|-----------|-----------|
| **Customer Data** | Forms (booking, RSVP, lead capture, photo upload) | JSON via tRPC mutations | Real-time | Email validation, required fields, territory enum |
| **Weather Data** | Open-Meteo API | JSON (14-day forecast) | On-demand per territory | Latitude/longitude lookup, temperature unit conversion |
| **Instagram Posts** | Instagram Graph API via Instafeed.js | JSON (12 latest posts) | On-page load | Fallback to direct Instagram link if API fails |
| **Dealer Data** | CRM (51 dealer pins) | Hardcoded in Dealers.tsx | Static | Territory color-coding (TX/AR/OK), coordinates |
| **Bike Models** | Moots.com specifications | Seed script (6 official models) | Static | Price, specs, use case, terrain, features |
| **Photo Uploads** | Community users | Image files (JPEG/PNG) + metadata | Real-time | File size limit, territory/event/tag selection, moderation queue |
| **Admin Actions** | Admin dashboard | Form submissions (approve/reject/delete/notify) | Real-time | Role-based access control (admin only) |
| **Testimonials** | Dealer verification process | Text + attribution | Manual entry | Verification status (verified/pending/rejected) |
| **Routes (Switzerland)** | Editorial verification process | Route data + elevation/distance/difficulty | Manual entry | Verification status required before publication |

---

## 7. Outputs

| Output Type | Destination | Format | Frequency | Use Case |
|------------|-------------|--------|-----------|----------|
| **Confirmation Emails** | Customer email (RSVP, booking, upload) | HTML via Resend API | Real-time on form submission | Customer acknowledgment, event details |
| **Admin Notifications** | notifyOwner (Ian Zakrocki) | In-app notification card + email | Real-time on customer action | Operational awareness (new RSVP, booking, photo, lead) |
| **Analytics Dashboard** | Admin page | JSON (RSVPs, bookings, leads, photos by status/territory) | On-demand | Business metrics, territory performance |
| **Public Website** | mootsframe.com + custom domains | HTML/CSS/JS (React SPA) | On-demand per user | Customer-facing campaign experience |
| **Moderation Queue** | Admin page | JSON (pending photos with metadata) | Real-time | Photo approval workflow |
| **RSVP List** | Admin page | JSON (grouped by event with attendee details) | Real-time | Event planning, headcount tracking |
| **Community Gallery** | Community page | Filtered photo grid (territory/event/tag) | Real-time | User-generated content display |
| **Lead Database** | configurator_leads table | Structured rows (name, email, territory, use case, budget, notes) | Real-time on form submission | Sales follow-up, CRM integration |
| **Booking Database** | bookings table | Structured rows (name, email, territory, date, notes, status) | Real-time on form submission | Event logistics, capacity planning |
| **Newsletter Subscriber List** | newsletter_subscribers table | Email addresses + subscription date + territory | Real-time on signup | Future email campaigns |

---

## 8. Upstream Dependencies

| Dependency | Type | Purpose | Criticality |
|-----------|------|---------|------------|
| **Moots Brand Guidelines** | Doctrine | Visual identity, tone, messaging standards | CRITICAL |
| **Moots Product Data** | Reference | Bike models, specs, pricing, warranty terms | CRITICAL |
| **Dealer Network (CRM)** | Reference | 51 dealer locations, contact info, territory assignments | HIGH |
| **Ian Zakrocki (Owner)** | Authority | Approval for content, contact info, business decisions | CRITICAL |
| **Open-Meteo Weather API** | External Service | 14-day forecast data for territories | MEDIUM (graceful degradation if unavailable) |
| **Instagram Graph API** | External Service | Latest posts for social proof | MEDIUM (fallback to direct link) |
| **Google Maps API** | External Service | Dealer map rendering, geocoding | MEDIUM (fallback to list view) |
| **Resend Email Service** | External Service | Transactional email delivery | HIGH (confirmation emails) |
| **Manus OAuth** | Platform Service | User authentication, session management | CRITICAL |
| **MySQL Database (Manus-hosted)** | Infrastructure | Data persistence (customers, photos, notifications) | CRITICAL |
| **S3 Storage (Manus-hosted)** | Infrastructure | Photo file storage, CDN delivery | CRITICAL |
| **GitHub Repository** | Infrastructure | Source control, CI/CD workflow | CRITICAL |

---

## 9. Downstream Destinations

| Destination | Data Type | Frequency | Purpose | Access Control |
|-------------|-----------|-----------|---------|-----------------|
| **Ian Zakrocki (Email/In-App)** | Notifications (RSVP, booking, photo, lead) | Real-time | Operational awareness, business metrics | Owner-only |
| **Customer Email** | Confirmation emails (RSVP, booking, upload) | Real-time on action | Transactional confirmation, event details | Customer email only |
| **Admin Dashboard** | Analytics, moderation queue, RSVP list, notifications | On-demand | Admin decision-making, content moderation | Admin role only |
| **CRM System (Future)** | Leads (name, email, territory, use case, budget, notes) | Batch export (manual) | Sales pipeline, customer relationship management | Sales team |
| **Email Marketing Platform (Future)** | Newsletter subscriber list | Batch export (manual) | Email campaigns, audience segmentation | Marketing team |
| **Public Website** | Approved photos, testimonials, routes (Switzerland) | Real-time | Community engagement, social proof | Public |
| **Instagram** | Campaign hashtags, event teasers | Manual posting | Social media amplification | Marketing team |

---

## 10. Governance Constraints

| Constraint | Rule | Enforcement |
|-----------|------|------------|
| **Verification-First Publishing** | No unverified Swiss routes, testimonials, or dealer info may be published | Manual review gate before database insertion |
| **Editorial Authority** | Only Ian Zakrocki may approve new territories, routes, or major content changes | Role-based access control (admin role required) |
| **Data Privacy** | Customer emails, names, and notes are for operational use only; no third-party sharing without consent | Database access restricted to authenticated users; no public API export |
| **Contact Info Lock** | All public-facing contact info must be ianzak@mac.com or 917-578-7687; no manus.space addresses in customer-visible content | Code review gate, search for hardcoded values |
| **Photo Moderation** | All community photos must pass moderation queue before display; rejected photos are deleted after 30 days | Moderation router enforces approval status; scheduled cleanup task (not yet implemented) |
| **Dealer Accuracy** | Dealer locations, hours, and contact info must be verified against CRM; no stale data | Manual CRM sync (not yet automated) |
| **Email Compliance** | Confirmation emails must include unsubscribe link and comply with CAN-SPAM; no marketing emails without explicit opt-in | Resend API templates include compliance headers |
| **Brand Tone** | All customer-facing copy must match "lo-fi, authentic, understated" aesthetic; no corporate jargon | Content review before publication |
| **Territory Scope** | Campaign is limited to AR/TX/OK + Switzerland (expansion); no other territories without explicit approval | Territory enum enforced in database schema |
| **Newsletter Opt-In** | Newsletter signup must be voluntary; no automatic enrollment from other forms | Separate newsletter_subscribers table; no cross-form enrollment |

---

## 11. Contamination Risks

| Risk | Mechanism | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Stale Dealer Data** | CRM not synced; dealer locations/hours become outdated | Customers visit closed shops, trust erodes | Implement automated CRM sync or manual verification schedule |
| **Unverified Routes Published** | Switzerland routes added without verification gate | Customers attempt dangerous/incorrect routes; brand damage | Enforce verification status check before publication; admin-only route creation |
| **Spam/Inappropriate Photos** | Moderation queue bypassed or photos auto-approved | Community wall becomes unusable; brand damage | Strengthen moderation router, add image content filters |
| **Contact Info Drift** | Old email/phone hardcoded in templates; future contact changes missed | Customers reach wrong person; support failures | Centralize contact info in environment variables; code search before each release |
| **Newsletter Spam** | Subscriber list sold or used for non-Moots campaigns | Legal liability, customer trust loss | Enforce opt-in only; no third-party access to subscriber list |
| **Data Breach** | Customer emails/names exposed via public API or database dump | Privacy violation, legal liability | Enforce authentication on all endpoints; no public data export; regular security audits |
| **Email Delivery Failure** | Resend API key invalid or quota exceeded | Customers don't receive confirmations; support burden | Monitor email logs; set up alerts for failed sends; maintain backup email service |
| **Map Rendering Failure** | Google Maps API quota exceeded or service down | Dealer map becomes unusable | Implement fallback to list view; monitor API usage; set up alerts |
| **Instagram Feed Stale** | Instafeed.js fails silently; last 12 posts not updated for weeks | Social proof becomes outdated | Add error logging; implement manual refresh button; fallback to direct Instagram link |
| **Notification System Overload** | Too many notifications sent to Ian; critical alerts buried | Operational awareness lost | Implement notification preferences; batch digest emails; priority levels |
| **TypeScript Type Drift** | tRPC client types out of sync with server router | Frontend errors, type safety lost | Regenerate types on server restart; add type check to CI/CD |
| **Database Schema Mismatch** | Local schema differs from production; migrations fail | Data corruption, deployment failure | Run `pnpm db:push` before each release; version control migrations |

---

## 12. Canonical Artifacts

| Artifact | Location | Owner | Update Frequency | Purpose |
|----------|----------|-------|------------------|---------|
| **Campaign Brief** | Moots Vibe Marketing Campaign _The Forever Frame_.markdown | Ian Zakrocki | As-needed | Source of truth for campaign messaging, territories, partners |
| **Database Schema** | drizzle/schema.ts | Development team | Per feature release | Authoritative data model definition |
| **tRPC Router** | server/routers.ts | Development team | Per feature release | Authoritative API contract |
| **Homepage** | client/src/pages/Home.tsx | Development team | Per feature release | Primary public-facing experience |
| **Admin Dashboard** | client/src/pages/Admin.tsx | Development team | Per feature release | Authoritative admin interface |
| **Dealer CRM** | Moots Signals Hub.xlsx (external) | Ian Zakrocki | Weekly | Source of truth for 51 dealer locations |
| **Testimonials** | testimonials table (database) | Ian Zakrocki (manual entry) | As-verified | Verified dealer quotes |
| **Bike Models** | bike_models table (database) + seed script | Development team | Per product update | Official Moots model specs |
| **Routes (Switzerland)** | routes table (database) | Ian Zakrocki (manual entry) | As-verified | Verified Swiss cycling routes |
| **Email Templates** | server/_core/email.ts | Development team | Per email campaign | Transactional email content |
| **Notification Types** | notificationRouter.ts + notifications table | Development team | Per feature release | 7 notification types (RSVP, booking, upload, lead, custom, reminder, announcement) |
| **GitHub Repository** | https://github.com/user/moots-forever-frame | Development team | Per commit | Source control, deployment history |

---

## 13. Non-Promotable Content

| Content | Reason | Location |
|---------|--------|----------|
| **Customer Email Addresses** | Privacy; no third-party sharing without consent | newsletter_subscribers, event_rsvps, configurator_leads, bookings tables |
| **Customer Notes/Preferences** | Personal data; confidential business information | event_rsvps.notes, configurator_leads.notes, bookings.notes |
| **Admin Contact Info** | Security; prevents direct customer contact bypass | notifyOwner email, admin dashboard |
| **Rejected Photos** | Community moderation; failed submissions not public | community_photos table (status='rejected') |
| **Unverified Routes** | Editorial integrity; prevents incorrect route publication | routes table (verification_status='pending' or 'rejected') |
| **Unverified Testimonials** | Brand integrity; prevents false dealer claims | testimonials table (verification_status='pending' or 'rejected') |
| **Dealer CRM Data** | Competitive sensitivity; dealer relationships confidential | External CRM (Moots Signals Hub.xlsx) |
| **Internal Notifications** | Operational; not for public consumption | notifications table (type='custom', territory-specific) |
| **API Keys / Secrets** | Security; prevents unauthorized service access | Environment variables (RESEND_API_KEY, VITE_FRONTEND_FORGE_API_KEY, etc.) |
| **GitHub Branches** | Development; work-in-progress not for public | GitHub repository (non-main branches) |

---

## 14. Current Status

**Status: Stable (with minor integration blockers)**

| Component | Status | Notes |
|-----------|--------|-------|
| **Core Campaign Website** | ✅ Stable | Hero, manifesto, territories, events, booking, education all production-ready |
| **Community System** | ✅ Stable | Photo upload, moderation, gallery display working |
| **Admin Dashboard** | ✅ Stable | Photo moderation, RSVP list, analytics, notifications all functional |
| **Email System** | ✅ Stable | Resend API integrated; confirmation emails wired (awaiting domain verification) |
| **Notification System** | ✅ Stable | 7 types implemented; admin compose form, territory targeting, real-time updates |
| **Instagram Integration** | ✅ Stable | Instafeed.js with graceful fallback; 12-post grid on homepage |
| **Dealer Testimonials** | ✅ Stable | 4 verified quotes in carousel; auto-rotation and manual navigation working |
| **Newsletter Signup** | ⚠️ Blocked | Backend router registered; frontend TypeScript error (`Property 'newsletter' does not exist on type trpc`) blocking client-side integration |
| **Switzerland Expansion** | ⚠️ In Progress | Page shell created; routes table ready; awaiting verified route data from Ian |
| **Photo Tagging** | ⚠️ In Progress | Database schema complete; tag selection UI not yet wired to upload form |
| **Bike Model Filtering** | ⚠️ In Progress | Database schema complete; filtering UI not yet wired to photo gallery |

**Test Coverage:** 21 tests passing (5 test files), 0 TypeScript errors (excluding newsletter TS error)

**Deployment:** Live at mootsframe.com; auto-deploys on main branch push via GitHub Actions

---

## 15. Notes for System Integration

### Architecture Decisions
- **tRPC-first approach:** All backend logic exposed via tRPC procedures; no REST endpoints. This ensures end-to-end type safety and simplifies client-server communication.
- **Verification-gate pattern:** Routes, testimonials, and other editorial content require explicit verification status before publication. This prevents accidental publishing of unverified data.
- **Territory-based scoping:** All customer-facing features (events, bookings, notifications) are scoped to territories (AR/TX/OK/CH). This enables future expansion without code changes.
- **Graceful degradation:** External APIs (weather, Instagram, maps) have fallbacks. If any service is unavailable, the site remains functional.

### Integration Points for Future Expansion
- **CRM Sync:** Dealer data currently hardcoded; implement automated sync from external CRM to prevent stale data.
- **Email Marketing Platform:** Newsletter subscriber list can be exported for bulk email campaigns (manual export; no automatic integration yet).
- **Analytics Platform:** Admin dashboard metrics can be piped to external analytics service (e.g., Mixpanel, Amplitude) for deeper insights.
- **Social Media Management:** Instagram posts currently fetched on-demand; implement scheduled sync to cache posts and reduce API calls.
- **Inventory Management:** Bike model availability can be linked to dealer inventory system (not yet implemented).

### Maintenance Checklist
- **Weekly:** Monitor email delivery logs (Resend dashboard); check admin notification center for critical alerts.
- **Monthly:** Verify dealer CRM data accuracy; audit newsletter subscriber list for bounces.
- **Quarterly:** Review analytics dashboard for territory performance; identify underperforming regions.
- **Annually:** Update bike model specs from moots.com; refresh testimonials with new dealer quotes; audit all external API integrations for deprecations.

### Known Limitations
- **Newsletter integration:** Frontend TypeScript error blocking client-side signup form. Workaround: skip newsletter for now; revisit after tRPC type generation fix.
- **Photo cleanup:** Rejected photos not automatically deleted after 30 days; requires manual admin cleanup or scheduled job.
- **Dealer map:** Google Maps API quota not monitored; may fail if traffic spikes. Implement quota alerts and fallback to list view.
- **Switzerland routes:** No verified route data yet; page shell ready for future population.
- **Real-time updates:** Notifications not WebSocket-based; polling only. Implement Socket.io for true real-time if needed.

### Security Considerations
- **Authentication:** All admin endpoints protected by role-based access control (admin role required).
- **Data validation:** All form inputs validated via Zod schema; no SQL injection or XSS vulnerabilities.
- **Secrets management:** API keys stored in environment variables; never committed to git.
- **CORS:** API endpoints restricted to mootsframe.com domain; no cross-origin requests allowed.
- **Rate limiting:** Express rate limiter configured to prevent brute-force attacks on booking/RSVP endpoints.

### Monitoring & Alerts
- **Dev server logs:** `.manus-logs/devserver.log` (server startup, Vite HMR, Express warnings)
- **Browser console:** `.manus-logs/browserConsole.log` (client-side errors, stack traces)
- **Network requests:** `.manus-logs/networkRequests.log` (HTTP requests, status codes, duration)
- **Session replay:** `.manus-logs/sessionReplay.log` (user interactions, navigation events)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-22  
**Owner:** Ian Zakrocki (Moots Bicycle)  
**Maintainer:** Development Team  
**Status:** Ready for System Integration
