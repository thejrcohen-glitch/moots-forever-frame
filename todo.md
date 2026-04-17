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

## Optional Follow-ups
- [ ] Wire booking form to send email notifications to Ian (notifyOwner helper)
- [ ] Add Dealer Map section using Google Maps component with 50 CRM shop pins
