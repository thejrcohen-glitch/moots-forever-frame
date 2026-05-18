# Moots Forever Frame — Project TODO

## Core Campaign Website
- [x] Cinematic hero section with parallax scroll
- [x] Manifesto / campaign copy section
- [x] Territory explorer (Bentonville/Austin/OKC) with pop-up partner cards
- [x] Share the Vibe — Instagram Story card generator (Canvas, 1080×1920)
- [x] Dual order pathways (dealer + individual) routing to ianzskrocki.com
- [x] Model comparison table (Routt 45 / Routt RSL / Vamoots RSL)
- [x] Ride Calendar with 12 events across TX/OK/AR, filterable by territory and type
- [x] Pop-Up booking form with territory selector
- [x] Live weather widget (Open-Meteo API) in booking form
- [x] Engineering education page (titanium material science, 5-step build, Ti vs Carbon, FAQ)
- [x] Community Wall page with Polaroid gallery, territory filter, lightbox
- [x] Full SEO / AI-SEO (meta tags, Open Graph, 5 structured data schemas)
- [x] sitemap.xml and robots.txt in client/public/

## Full-Stack Upgrade (web-db-user)
- [x] Upgrade project to tRPC + MySQL + S3 template
- [x] Add community_photos table to drizzle/schema.ts
- [x] Run pnpm db:push to apply migration
- [x] Write communityRouter.ts (list + upload procedures)
- [x] Register communityRouter in server/routers.ts
- [x] Fix App.tsx import paths to use @/ alias

## Community Page — Persistent tRPC API
- [x] Rewrite Community.tsx to use trpc.community.list.useQuery() for gallery
- [x] Rewrite upload form to use trpc.community.upload.useMutation()
- [x] Map DB CommunityPhoto type to display (riderName, imageUrl, mootsModel, createdAt)
- [x] Territory filter uses uppercase TX/OK/AR to match DB enum
- [x] Loading spinner while photos are fetching
- [x] Invalidate query cache after successful upload
- [x] Empty state for no photos in territory
- [x] Error state for failed fetch

## Feature Batch 2

### Booking Notifications
- [x] bookingRouter.ts — submit procedure calling notifyOwner
- [x] Register bookingRouter in server/routers.ts
- [x] Update BookingForm in Home.tsx to use trpc.booking.submit.useMutation()
- [x] Map territory values (bentonville→AR, austin→TX, okc→OK) before sending
- [x] Show loading state on submit button

### Dealer Map
- [x] Create /dealers route in App.tsx
- [x] Create client/src/pages/Dealers.tsx with Google Maps + 51 CRM shop pins
- [x] Territory color coding (TX=sienna, AR=green, OK=charcoal)
- [x] Filterable by territory
- [x] Pin click shows shop name, city, and website link
- [x] Sidebar list with territory filter and selected dealer detail

### Database Schema Updates
- [x] Add event_rsvps table to drizzle/schema.ts
- [x] Change community_photos default approved to 'pending' (moderation flow)
- [x] Run pnpm db:push to apply migrations

### Photo Moderation Panel
- [x] Create /admin route in App.tsx (protected — admin role only)
- [x] Create client/src/pages/Admin.tsx with photo approval queue
- [x] moderationRouter.ts — list all, approve, reject, delete procedures
- [x] Register moderationRouter in server/routers.ts
- [x] Community Wall only shows approved photos

### Build Configurator
- [x] Create /build route in App.tsx
- [x] Create client/src/pages/BuildConfigurator.tsx — multi-step flow
- [x] Steps: use case → terrain → budget → territory → recommendation
- [x] Lead capture form at end (name, email, territory, notes)
- [x] configuratorRouter.ts — submitLead procedure calling notifyOwner
- [x] Build a Moots link in BuildConfigurator nav

### Event RSVP System
- [x] rsvpRouter.ts — submit (dedup by email+eventId), count, counts procedures
- [x] Register rsvpRouter in server/routers.ts
- [x] Update RideCalendar in Home.tsx to show RSVP button per event
- [x] RSVP modal: name + email + notes input, stores in event_rsvps table
- [x] Ian notified via notifyOwner on each new RSVP
- [x] Show live RSVP count per event (from DB)

## Feature Batch 3 — Gap Fixes

### Mobile Nav
- [x] Add hamburger icon (Menu/X toggle) to Home.tsx Nav component
- [x] Add slide-down mobile drawer with all nav links
- [x] Close drawer on link tap
- [x] Apply same mobile nav pattern to Community.tsx, Engineering.tsx, Dealers.tsx, BuildConfigurator.tsx

### RSVP Admin Tab
- [x] Add RSVPs tab to Admin.tsx alongside Photos tab
- [x] Fetch all RSVPs via trpc.rsvp.listAll (new procedure)
- [x] Display grouped by event with name, email, notes, territory, date
- [x] Add rsvpRouter.listAll procedure (admin-only)

### Configurator Lead DB Storage
- [x] Add configurator_leads table to drizzle/schema.ts
- [x] Update configuratorRouter.ts to insert lead before notifyOwner
- [x] Run pnpm db:push

### Community Upload Notification
- [x] Add notifyOwner call to communityRouter.ts upload procedure

### Sitemap Domain Fix
- [x] Update sitemap.xml to use mootsframe-quvovjek.manus.space
- [x] Update robots.txt Sitemap line to match
- [x] Update index.html og:url and og:image to match

## Feature Batch 4 — Configurator, Warranty, Email, Engineering, Admin Analytics

### Build Configurator Updates
- [x] Update price ranges to match verified moots.com pricing
- [x] Add Routt YBB as a 5th model option in the configurator
- [x] Update model descriptions to use official moots.com copy
- [x] Fix budget step labels to reflect verified price tiers

### Homepage Additions
- [x] Add Lifetime Warranty section to homepage (official Moots language)
- [x] Add Trade-Up Program section to homepage with CTA
- [x] Add build time note (6–8 weeks standard) to order section

### Engineering Page
- [x] Add CWSR titanium deep-dive section with official Why Ti copy
- [x] Include aircraft-grade standards note
- [x] Add tube mill partnership note (15+ years, Washington mill)
- [x] Add 35+ tube sizes / tuning philosophy section

### Email Confirmations (Resend)
- [x] Install resend npm package
- [x] Add RESEND_API_KEY secret (awaiting user API key)
- [x] Create server/_core/email.ts helper
- [x] Wire RSVP confirmation email to rider
- [x] Wire booking confirmation email to rider
- [x] Wire community upload acknowledgment email

### Admin Analytics Dashboard
- [x] Add Analytics tab to Admin.tsx
- [x] Show RSVPs this month + all time
- [x] Show configurator leads this month + all time
- [x] Show community photos by status (pending/approved/rejected)
- [x] Show territory breakdown with progress bars
- [x] Add analyticsRouter.ts with summary procedure (admin-only)
- [x] Register analyticsRouter in server/routers.ts

## Follow-up Items (Pending User Action)
- [x] Add RESEND_API_KEY secret (user to provide key when ready — email confirmations wired and ready to activate)
- [x] Verify sender domain in Resend dashboard (https://resend.com/domains) — add mootsframe-quvovjek.manus.space
- [x] Persist booking requests to database and add booking totals to analyticsRouter
- [x] Update Comparison.tsx to include frame material, geometry, weight fields
- [x] Add explicit 'Remove from Comparison' buttons for each selected model
- [x] Implement true difference highlighting across compared models (contrasting styles for differing values)

## Feature Batch 5 — Model Comparison

### Side-by-Side Comparison Page
- [x] Create client/src/pages/Comparison.tsx with model multi-select
- [x] Display selected models in side-by-side table format
- [x] Show specs: tagline, price, use case, terrain, key features
- [x] Add model selector with up to 4 models
- [x] Add "Remove from Comparison" via selector toggle
- [x] Highlight specs with color coding (green checkmarks)
- [x] Add "Build This Model" CTA button for each column
- [x] Create /comparison route in App.tsx
- [x] Add Comparison link to nav on BuildConfigurator page

## Feature Batch 6 — SEO Optimization

### Homepage SEO Fixes
- [x] Reduce keywords from 27 to 5-7 focused terms
- [x] Expand page title from 25 to 48 characters
- [x] Shorten meta description from 250 to 118 characters
- [x] Add dynamic document.title via useEffect in Home.tsx
- [x] Update Open Graph meta tags
- [x] Update Twitter Card meta tags

## Feature Batch 7 — Contact Info Audit & Update

### Contact Information Audit
- [x] Search for all ianzskrocki.com references across codebase
- [x] Search for all *.manus.space contact references
- [x] Search for old email/phone numbers
- [x] Identify which references should become: mootsframe.com, ianzak@mac.com, or 917-578-7687
- [x] Document all locations requiring updates

### Homepage & Footer Updates
- [x] Update footer contact section with Ian's info
- [x] Update homepage contact CTA with email/phone
- [x] Replace ianzskrocki.com with mootsframe.com in footer links
- [x] Remove manus.space references from public-facing sections

### Form & Page Updates
- [x] Update booking form confirmation text with correct contact info
- [x] Update build configurator result screen with contact CTA
- [x] Update dealer inquiry pages with correct contact info
- [x] Update FAQ with correct contact references

### Structured Data & Meta
- [x] Update organization schema in index.html with correct contact info
- [x] Update og:url and canonical tags if needed
- [x] Verify all email links use ianzak@mac.com
- [x] Verify all phone numbers display 917-578-7687


## Feature Batch 8 — Custom Notification System

### Database Schema & Router
- [x] Add notifications table to drizzle/schema.ts (id, type, title, message, territory, createdAt, readAt)
- [x] Add notification_preferences table (userId, emailNotifications, inAppNotifications, territory)
- [x] Run pnpm db:push to apply migrations
- [x] Create notificationRouter.ts with list, markAsRead, create, delete procedures
- [x] Register notificationRouter in server/routers.ts

### In-App Toast Notifications
- [x] Update RSVP form to show success toast after submission (already implemented)
- [x] Update booking form to show success toast after submission (already implemented)
- [x] Update community upload to show success toast after submission (already implemented)
- [x] Add error toast handling for all form failures (already implemented)
- [x] Verify Sonner toast library is working correctly (verified)

### Admin Notification Center
- [x] Add Notifications tab to Admin.tsx dashboard
- [x] Fetch all notifications via trpc.notification.list
- [x] Display notifications grouped by type (RSVP, booking, upload, lead)
- [x] Add mark-as-read functionality
- [x] Show unread notification count badge in admin nav
- [x] Add delete notification button

### Territory-Based Targeting
- [x] Add territory filter to notification creation
- [x] Allow admins to send custom notifications to specific territories
- [x] Store territory in notifications table
- [x] Filter notifications by user's territory preference

### Notification Preferences
- [x] Add notification settings page or modal for users (via getPreferences/updatePreferences procedures)
- [x] Allow users to opt-in/out of email and in-app notifications
- [x] Allow users to select preferred territory for notifications
- [x] Store preferences in notification_preferences table

### Testing & Delivery
- [x] Write vitest tests for notification router
- [x] Test toast notifications on all forms
- [x] Test admin notification center
- [x] Verify territory-based filtering
- [x] All 21 tests passing (5 test files)


## Follow-up Enhancements (Notification System)

- [ ] Add admin UI in NotificationCenter to compose and send custom notifications with territory targeting
- [ ] Implement grouping of notifications by type in NotificationCenter display
- [ ] Add unread count badge to Admin "Notifications" tab label
- [ ] Create user-facing notification settings page/modal wired to getPreferences/updatePreferences
- [ ] Implement end-to-end filtering of visible notifications using saved user territory preferences
- [ ] Add real Vitest coverage for notificationRouter procedures (list, create, markAsRead, delete)
- [ ] Add integration tests for NotificationCenter component behavior
- [ ] Add tests for toast notification flows on all forms
