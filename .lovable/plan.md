# Taara — Phase 2 Upgrade Plan

This is a large request (~15 areas). To keep quality high I'll ship it in 3 focused phases on top of the existing UI — no redesign, no rebuild.

## Phase A — Persistence & Settings (foundation)
Fixes the "data disappears on refresh" problem first.

1. **Image generation persistence**
   - Save every generated image to `saved_images` (already in DB).
   - `/app/image` loads gallery from DB on mount; downloads still work.
2. **Bookmarks persistence**
   - `/app/tools` reads/writes `bookmarks` table instead of local `Set`.
3. **Saved page wired to DB**
   - `/app/saved` shows real saved images + bookmarked tools.
4. **Settings page — real profile**
   - Editable display name, bio, avatar URL → `profiles` table.
   - Email shown (read-only), Save button with toast, loads on mount.
   - Light/dark toggle (persists in `localStorage` — Taara stays dark-first).

## Phase B — Content expansion
5. **+50 new AI tools** across the requested categories (Voice, Automation, Research, Education, Finance, Resume, Website Builders, Agents, Presentations, Productivity, Translation, Data, Fashion, Interior, Health) added to `src/data/tools.ts` with name, category, pricing, rating, description, brand-colored initials tile, real URL. (Official logos require per-brand asset hosting — I'll use the existing branded initials tiles which already look premium; happy to swap to remote favicons if you want.)
6. **New categories** added to `CATEGORIES` and filterable in the directory.
7. **Blog featured images** — each post in `src/data/blog.ts` gets a Unsplash cover URL; cards + modal show responsive thumbnails with hover zoom.

## Phase C — Community reviews + UX polish
8. **Reviews system**
   - New `reviews` table (rating 1–5, body, user_id) with RLS (anyone can read, only author can write/delete).
   - Landing page gets a "Loved by builders" section: animated cards from DB + a "Write a review" glass modal (auth-gated).
9. **Animation polish** — loading skeletons on chat/image/tools, hover glow on tool cards, animated dropdowns (already mostly there via Framer Motion).

## Explicitly out of scope (with reason)
- **Real Stability/Leonardo/Runway/Pika/Luma API integrations.** Each needs a paid API key + per-provider billing. Image generation already works via Lovable AI (Gemini nano-banana). For the others I'll add clearly-labeled "Launch in new tab" buttons as you requested for the fallback case. If you want a specific provider wired up, give me the key and I'll integrate it.
- **Video generation.** Same reason — keeping the "Coming soon" page until a provider is chosen.
- **Subscriptions/payments.** Already scaffolded; needs Stripe enable + your products. Say the word and I'll wire it.
- **Rate limiting / advanced security.** Supabase RLS + auth-middleware already protect every table. Real rate limiting needs an edge KV store; can add later if abuse appears.

## Technical notes
- New migration: `reviews` table + RLS + trigger.
- No changes to existing UI primitives, theme tokens, or routing structure.
- All new reads use the browser Supabase client (RLS-protected) — no new server functions needed for Phase A/C.
- Phase B is pure data + small JSX additions.

**Approve and I'll ship Phase A first**, then B, then C in follow-up turns. Or tell me to reorder/drop phases.