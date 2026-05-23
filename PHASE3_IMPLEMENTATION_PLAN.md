# Phase 3 Implementation Plan — Moots Forever Frame

**Repository:** https://github.com/thejrcohen-glitch/moots-forever-frame  
**Status:** Phase 2 complete (43/43 tests passing, 0 TypeScript errors)  
**Target:** Phase 3 advanced features (4 independent PRs)

---

## PR 1: Testimonial Admin Management

**Scope:** Enable admins to manage dealer testimonials with verification-first publishing.

### 1. Scope
- Add testimonials table with verification status
- Create testimonialsRouter with admin procedures (listPublic, listAdmin, create, update, verify, reject, delete)
- Add "Testimonials" tab to Admin.tsx dashboard
- Update DealerTestimonials component to load verified testimonials from database
- Preserve 4 existing testimonials as seed data (pending verification)

### 2. Files Likely Affected
**Backend:**
- `drizzle/schema.ts` — Add testimonials table
- `server/testimonialsRouter.ts` — New file with admin procedures
- `server/routers.ts` — Register testimonialsRouter
- `server/db.ts` — Add getTestimonials helper

**Frontend:**
- `client/src/pages/Admin.tsx` — Add testimonials tab (status filter, verify/reject/delete actions)
- `client/src/components/DealerTestimonials.tsx` — Load verified testimonials from database
- `client/src/pages/Home.tsx` — Wire DealerTestimonials to use database data

**Tests:**
- `server/testimonials.test.ts` — New test file

### 3. Schema Changes
```sql
CREATE TABLE testimonials (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  personName VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  territory ENUM('TX', 'OK', 'AR', 'CH', 'ALL') NOT NULL,
  quote TEXT NOT NULL,
  imageUrl VARCHAR(500),
  imageKey VARCHAR(500),
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  displayOrder INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  verifiedAt TIMESTAMP,
  verifiedBy VARCHAR(100),
  INDEX (status),
  INDEX (territory)
);
```

### 4. Router/API Changes
**New Procedures:**
- `testimonials.listPublic` — Get verified testimonials only (public)
- `testimonials.listAdmin` — Get all testimonials with status (admin-only)
- `testimonials.create` — Create new testimonial (admin-only, starts as pending)
- `testimonials.update` — Edit pending/rejected testimonials (admin-only)
- `testimonials.verify` — Publish testimonial with verifiedBy/verifiedAt (admin-only)
- `testimonials.reject` — Reject testimonial (admin-only)
- `testimonials.delete` — Delete testimonial (admin-only)

**Input Validation:**
- Zod schemas for personName, organization, territory, quote (required)
- imageUrl optional (S3 URL)
- status restricted to admin role

### 5. Frontend Changes
**Admin.tsx:**
- Add "Testimonials" tab to AdminTab type
- Add `testimonialStatusFilter` state
- Wire `trpc.testimonials.listAdmin` query
- Wire verify/reject/delete mutations with toast feedback
- Status filter chips (pending/verified/rejected/all)
- Card-based moderation UI (mirror photos tab pattern)
- Show personName, organization, quote, territory, status
- Action buttons: Verify (pending only), Reject (pending only), Delete (all)

**DealerTestimonials.tsx:**
- Replace hardcoded DEFAULT_TESTIMONIALS with `trpc.testimonials.listPublic` query
- Loading state (spinner)
- Empty state if no verified testimonials
- Auto-rotation and navigation unchanged

### 6. Admin Changes
- Add testimonials admin tab to control panel
- Verify/reject workflow with audit trail
- Track verifiedBy (admin openId) and verifiedAt timestamp
- Pending testimonials do not appear on public site

### 7. Tests to Add/Update
**New: server/testimonials.test.ts**
- Test listPublic returns only verified testimonials
- Test listAdmin returns all testimonials (admin-only)
- Test create procedure (admin-only)
- Test verify procedure (sets verifiedBy/verifiedAt)
- Test reject procedure
- Test delete procedure
- Test non-admin cannot access admin procedures

**Update: existing tests**
- Verify DealerTestimonials component loads from database
- Verify 4 existing testimonials are seeded as pending

### 8. Migration/Deploy Notes
**Database:**
- Run `pnpm db:push` to create testimonials table
- Seed 4 existing testimonials as pending (via migration or manual insert)

**Deployment:**
- Testimonials tab appears in Admin.tsx after deploy
- Public site shows no testimonials until admin verifies at least one
- No breaking changes to existing features

**Rollback:**
- Drop testimonials table
- Revert DealerTestimonials to hardcoded data

### 9. Risks
- **No testimonials on public site initially** — Admin must verify at least one for carousel to display
- **Migration timing** — Seed data must be inserted after table creation
- **Admin access** — Only users with role='admin' can manage testimonials
- **Data loss** — Deleting testimonials is permanent (consider soft delete if needed)

### 10. Manus-Ready Execution Prompt
```
Implement Phase 3 PR 1: Testimonial Admin Management

Goal: Enable admins to manage dealer testimonials with verification-first publishing.

Requirements:
1. Create testimonials table with verification schema (pending/verified/rejected)
2. Create testimonialsRouter with 7 admin procedures (listPublic, listAdmin, create, update, verify, reject, delete)
3. Add testimonials tab to Admin.tsx dashboard with status filter and moderation UI
4. Update DealerTestimonials component to load verified testimonials from database
5. Seed 4 existing testimonials as pending (Marcus Chen, Sarah Williams, James Patterson, Elena Rodriguez)
6. Add tests for testimonials router procedures
7. Run pnpm check, test, build to verify

Governance:
- Only verified testimonials appear publicly
- Admin-only verification workflow with audit trail
- Preserve public contact info: ianzak@mac.com, 917-578-7687
- Do not expose secrets

Expected Results:
- 43+ tests passing
- 0 TypeScript errors
- Production build successful
- Testimonials tab in Admin.tsx
- DealerTestimonials carousel loads from database
```

---

## PR 2: Bike Model Filtering for Community Wall

**Scope:** Allow visitors to filter community photos by Moots model (Routt 45, Routt RSL, Routt CRD, Routt YBB, Scrambler, Womble MXC, Legacy).

### 1. Scope
- Add model filter UI to Community.tsx gallery
- Combine model filtering with existing territory and tag filters
- Update community router to support model filtering
- Add empty states for no matching photos
- Preserve moderation gate (approved photos only)

### 2. Files Likely Affected
**Backend:**
- `server/communityRouter.ts` — Add models input parameter to list query

**Frontend:**
- `client/src/pages/Community.tsx` — Add model state, filter UI, toggle functions
- `client/src/components/EventPhotoGallery.tsx` — Already has model filtering (no changes needed)

**Tests:**
- `server/community.test.ts` — Add model filtering tests

### 3. Schema Changes
**None required** — Use existing `mootsModel` field in communityPhotos table

### 4. Router/API Changes
**Update: community.list procedure**
- Add `models?: string[]` input parameter
- Filter photos by mootsModel if models array provided
- Combine with existing territory and tag filters (OR-match)

### 5. Frontend Changes
**Community.tsx:**
- Add `selectedModels` state
- Add `toggleModelFilter()` function
- Add model filter UI: 7 checkboxes (Routt 45, Routt RSL, Routt CRD, Routt YBB, Scrambler, Womble MXC, Legacy)
- Update query to pass models parameter
- Update clear filters to include models
- Context-aware empty state message

### 6. Admin Changes
- None (moderation gate unchanged)

### 7. Tests to Add/Update
**Update: server/community.test.ts**
- Test model filtering with single model
- Test model filtering with multiple models
- Test combined territory + tag + model filtering
- Test empty result set with model filter

### 8. Migration/Deploy Notes
**Database:**
- No migration needed (mootsModel field already exists)

**Deployment:**
- Model filter UI appears on Community page
- No breaking changes

### 9. Risks
- **Empty results** — If no photos have mootsModel set, filter shows no results
- **Filter combination** — Multiple filters (territory + tag + model) may result in empty set

### 10. Manus-Ready Execution Prompt
```
Implement Phase 3 PR 2: Bike Model Filtering for Community Wall

Goal: Allow visitors to filter community photos by Moots model.

Requirements:
1. Add model filter UI to Community.tsx (7 models: Routt 45, Routt RSL, Routt CRD, Routt YBB, Scrambler, Womble MXC, Legacy)
2. Update community.list router to accept models parameter
3. Implement model filtering logic (OR-match with territory and tag filters)
4. Add context-aware empty states
5. Add tests for model filtering
6. Run pnpm check, test, build to verify

Expected Results:
- 43+ tests passing
- 0 TypeScript errors
- Production build successful
- Model filter UI on Community page
- Photos filterable by model
```

---

## PR 3: Performance Pass & SEO Polish

**Scope:** Optimize performance (image lazy loading, code splitting, caching) and improve SEO (structured data, meta tags, social sharing).

### 1. Scope
- Implement image lazy loading for photo galleries
- Add code splitting for large components
- Optimize bundle size
- Improve Core Web Vitals (LCP, FID, CLS)
- Add structured data (Schema.org) for routes, testimonials, events
- Enhance Open Graph meta tags for social sharing
- Add canonical URLs

### 2. Files Likely Affected
**Frontend:**
- `client/src/components/EventPhotoGallery.tsx` — Add lazy loading
- `client/src/components/DealerTestimonials.tsx` — Code split
- `client/src/pages/Community.tsx` — Lazy load images
- `client/src/pages/Home.tsx` — Add structured data
- `client/src/pages/Switzerland.tsx` — Add structured data
- `client/src/App.tsx` — Add canonical URLs
- `client/index.html` — Update meta tags

**Build:**
- `vite.config.ts` — Optimize bundle splitting
- `package.json` — Add performance monitoring

### 3. Schema Changes
**None** — Performance optimization only

### 4. Router/API Changes
**None** — Performance optimization only

### 5. Frontend Changes
- Add `loading="lazy"` to `<img>` tags in galleries
- Implement React.lazy() for large components
- Add Suspense boundaries with loading states
- Optimize Tailwind CSS output (purge unused styles)
- Add preload hints for critical resources

### 6. Admin Changes
- None

### 7. Tests to Add/Update
**New: client/src/components/__tests__/performance.test.ts**
- Test lazy loading images render correctly
- Test code-split components load with Suspense
- Test bundle size stays under threshold

**Update: existing tests**
- Verify no performance regressions

### 8. Migration/Deploy Notes
**Build:**
- Run `pnpm build` to verify bundle size
- Check Core Web Vitals in Lighthouse

**Deployment:**
- No database changes
- No breaking changes

### 9. Risks
- **Lazy loading** — Images may not load if JavaScript disabled
- **Code splitting** — May introduce network waterfall for large components
- **Bundle size** — Optimization may be minimal if already well-tuned

### 10. Manus-Ready Execution Prompt
```
Implement Phase 3 PR 3: Performance Pass & SEO Polish

Goal: Optimize performance and improve SEO.

Requirements:
1. Add image lazy loading to photo galleries (loading="lazy")
2. Implement code splitting for large components (React.lazy + Suspense)
3. Optimize bundle size and Core Web Vitals
4. Add structured data (Schema.org) for routes, testimonials, events
5. Enhance Open Graph meta tags for social sharing
6. Add canonical URLs
7. Run pnpm check, test, build to verify

Expected Results:
- 43+ tests passing
- 0 TypeScript errors
- Production build successful
- Improved Lighthouse scores
- Better social sharing previews
```

---

## PR 4: Switzerland Routes & Dealer Expansion

**Scope:** Add Switzerland routes table, verification workflow, and Swiss dealer support.

### 1. Scope
- Create routes table with verification schema
- Create routesRouter with admin procedures
- Add routes admin tab to Admin.tsx
- Update Switzerland.tsx to load verified routes from database
- Extend dealers to support CH territory
- Add pass sign badge logic (elevation >= 2000m)

### 2. Files Likely Affected
**Backend:**
- `drizzle/schema.ts` — Add routes table
- `server/routesRouter.ts` — New file with admin procedures
- `server/routers.ts` — Register routesRouter
- `server/db.ts` — Add getRoutes helper

**Frontend:**
- `client/src/pages/Admin.tsx` — Add routes tab
- `client/src/pages/Switzerland.tsx` — Load verified routes from database
- `client/src/pages/Dealers.tsx` — Add CH territory support

**Tests:**
- `server/routes.test.ts` — New test file

### 3. Schema Changes
```sql
CREATE TABLE routes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  distanceKm DECIMAL(8,2),
  elevationGainM INT,
  terrainType VARCHAR(100),
  description TEXT,
  mootsInsiderTip TEXT,
  territory ENUM('TX', 'OK', 'AR', 'CH') NOT NULL,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verifiedBy VARCHAR(100),
  verifiedAt TIMESTAMP,
  sourceAttribution VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (status),
  INDEX (territory)
);
```

### 4. Router/API Changes
**New Procedures:**
- `routes.listPublic` — Get verified routes only (public)
- `routes.listAdmin` — Get all routes with status (admin-only)
- `routes.create` — Create new route (admin-only)
- `routes.update` — Edit pending/rejected routes (admin-only)
- `routes.verify` — Publish route with verifiedBy/verifiedAt (admin-only)
- `routes.reject` — Reject route (admin-only)
- `routes.delete` — Delete route (admin-only)

### 5. Frontend Changes
**Admin.tsx:**
- Add "Routes" tab to AdminTab type
- Add `routeStatusFilter` state
- Wire `trpc.routes.listAdmin` query
- Wire verify/reject/delete mutations
- Status filter chips and moderation UI

**Switzerland.tsx:**
- Replace hardcoded SWISS_ROUTES with `trpc.routes.listPublic` query
- Filter by territory='CH'
- Add pass sign badge if elevationGainM >= 2000
- Loading state and empty state

**Dealers.tsx:**
- Add CH territory to TERRITORY_COLORS and TERRITORY_LABELS
- Load dealers from database (future PR)

### 6. Admin Changes
- Add routes admin tab to control panel
- Verify/reject workflow with audit trail

### 7. Tests to Add/Update
**New: server/routes.test.ts**
- Test listPublic returns only verified routes
- Test listAdmin returns all routes (admin-only)
- Test create procedure
- Test verify procedure
- Test reject procedure
- Test delete procedure

### 8. Migration/Deploy Notes
**Database:**
- Run `pnpm db:push` to create routes table
- Seed 3 existing routes as pending (Tremola, Trans Jura, Bernina Express)

**Deployment:**
- Routes tab appears in Admin.tsx
- Switzerland page shows no routes until admin verifies at least one
- No breaking changes

### 9. Risks
- **No routes on public site initially** — Admin must verify at least one
- **Hardcoded dealers** — Dealers still hardcoded (database migration in future PR)
- **Pass sign logic** — Badge only shows if elevationGainM is set

### 10. Manus-Ready Execution Prompt
```
Implement Phase 3 PR 4: Switzerland Routes & Dealer Expansion

Goal: Add Switzerland routes with verification-first publishing.

Requirements:
1. Create routes table with verification schema (pending/verified/rejected)
2. Create routesRouter with 7 admin procedures
3. Add routes admin tab to Admin.tsx dashboard
4. Update Switzerland.tsx to load verified routes from database
5. Add pass sign badge logic (elevation >= 2000m)
6. Seed 3 existing routes as pending
7. Add tests for routes router procedures
8. Run pnpm check, test, build to verify

Governance:
- Only verified routes appear publicly
- Admin-only verification workflow
- Preserve public contact info: ianzak@mac.com, 917-578-7687

Expected Results:
- 43+ tests passing
- 0 TypeScript errors
- Production build successful
- Routes tab in Admin.tsx
- Switzerland page loads verified routes
```

---

## Execution Order

**Recommended PR sequence:**
1. **PR 1: Testimonial Admin Management** (foundation for admin pattern)
2. **PR 2: Bike Model Filtering** (quick win, no schema changes)
3. **PR 3: Performance Pass & SEO Polish** (continuous improvement)
4. **PR 4: Switzerland Routes & Dealer Expansion** (builds on PR 1 pattern)

**Estimated Timeline:**
- PR 1: 2-3 hours (schema + router + admin UI)
- PR 2: 1 hour (UI only, no backend changes)
- PR 3: 2-3 hours (performance + SEO)
- PR 4: 2-3 hours (schema + router + admin UI)

**Total: ~8-10 hours** for all Phase 3 features

---

## Quality Checklist

Before merging each PR:
- [ ] `pnpm check` — 0 TypeScript errors
- [ ] `pnpm test` — 43+ tests passing
- [ ] `pnpm build` — Production build successful
- [ ] No secrets exposed in code
- [ ] Public contact info preserved (ianzak@mac.com, 917-578-7687)
- [ ] No unverified content published
- [ ] Admin-only procedures protected
- [ ] Audit trail (verifiedBy, verifiedAt) for verification workflows
- [ ] Empty states for no data scenarios
- [ ] Loading states for async operations
- [ ] Error handling with toast notifications

---

## Governance & Safety

**Verification-First Publishing:**
- Only verified testimonials, routes, and dealers appear on public pages
- Pending/rejected content hidden from public
- Admin-only verification workflow with audit trail

**Contact Info Preservation:**
- ianzak@mac.com — Preserved in all contact forms and emails
- 917-578-7687 — Preserved in all contact forms

**Secret Protection:**
- No secrets in code or config files
- All secrets injected via environment variables
- No API keys exposed in frontend code

**Admin Authority:**
- Ian (owner) has final approval on all verification decisions
- All admin actions logged with verifiedBy and verifiedAt
- Role-based access control (admin-only procedures)

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize PRs** based on business needs
3. **Create GitHub issues** for each PR
4. **Assign to developer** with execution prompts
5. **Review PRs** before merging
6. **Deploy to production** after QA
7. **Monitor metrics** (performance, user engagement)

---

**Document Version:** 1.0  
**Last Updated:** May 23, 2026  
**Status:** Ready for Implementation
