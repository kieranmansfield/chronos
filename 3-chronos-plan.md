# Stage 3 — Chronos

> The canonical app plan. Stage 1 (the `database` + `auth` layers) and Stage 2 (the boilerplate scaffolding) are prerequisites; this doc references them rather than repeating them. Supersedes the app scope of the earlier combined `chronos-app-plan.md`.

## Purpose

Chronos is a Nuxt app for chronological reading / watch / listen orders across serialized fiction franchises. It has two halves: a **curated guide** (hand-crafted orders + continuity context per franchise) and an **authoring tool** (users build, save, and later share their own orders). The first franchise pack is **Post-Crisis Batman**; the engine is franchise- and medium-agnostic so Star Wars, Doctor Who, etc. plug into the same model.

The value is the curation and the authoring tool, not raw metadata.

## Repo shape

Chronos is its own thin monorepo. The chronology engine and domain are **not** reusable enough to belong in `kmcom-nuxt-layers`, so they live here.

```txt
chronos/
  packages/
    @chronos/engine        pure TS: domain types, the plan resolver, coverage logic,
                           Store contracts. Zero Nuxt/Vue deps. Unit-tested alone.
  apps/
    web/                   the Nuxt app. extends kmcom-nuxt-layers/layers/{core,content,
                           theme,motion,ui,database,auth}. Holds content.config.ts,
                           content/ packs, app/ components+composables, server/api routes,
                           server/database/schema.ts.
```

The engine stays a package (not dissolved into `web`) because a second consumer exists: the Obsidian→YAML import / curation tooling, and a future mobile shell. A **domain layer is only created if a second app surface appears** (e.g. a separate curation UI); until then the domain lives in `apps/web`.

Consumes from Stage 1: `database` (user data), `auth` (GitHub login). Scaffolded by Stage 2: drizzle config, env, `useDb()` binding.

---

## `@chronos/engine` — the core

Framework-agnostic. Owns the domain contracts, the resolver, and the storage interface.

```ts
// Storage contracts — the engine never touches Nuxt/$fetch
export interface OrderStore {
  list(): Promise<SavedOrder[]>
  get(id: string): Promise<SavedOrder | null>
  save(order: SavedOrder): Promise<void>
  remove(id: string): Promise<void>
}
export interface ProgressStore {
  all(): Promise<ProgressState[]>
  set(state: ProgressState): Promise<void>
}

// The resolver — pure function, fully testable
export function resolveOrder(order: ReadingOrder, catalogue: Catalogue, filters: PlanFilters): ResolvedBlock[]
```

The Nuxt app provides the single adapter: `ApiOrderStore` → `$fetch('/api/orders')` → server route → `useDb()` (Drizzle/Neon).

---

## Domain model (condensed)

Provenance lets curated and user content coexist:

```ts
export type ContentSource = 'curated' | 'user' | 'community'
export type Visibility = 'private' | 'unlisted' | 'public'
export type Ownership = {
  source: ContentSource; ownerId?: string; visibility?: Visibility
  forkedFromId?: string; createdAt?: string; updatedAt?: string
}
```

Top-level + entities:

```ts
export type Medium = 'comics' | 'film' | 'tv' | 'audio' | 'prose' | 'game' | 'mixed'

export type Franchise = {
  id: string; name: string; publisher?: string; medium: Medium
  canonModel?: string; scopes?: { id: string; name: string; parentId?: string }[]
}

export type Work = {
  id: string; franchiseId: string; title: string; medium?: Medium
  formFactor: FormFactor; atomicUnitIds?: string[]; storyConceptIds?: string[]
  continuityIds?: string[]; labels?: StoryLabel[]; ownership?: Ownership
}

export type FormFactor =
  | 'issue' | 'arc' | 'story' | 'graphic-novel' | 'trade' | 'omnibus'   // comics
  | 'episode' | 'serial' | 'season' | 'film' | 'tv-movie' | 'short' | 'special' // screen
  | 'audio-story' | 'audio-box-set' | 'audio-drama'                     // audio
  | 'novel' | 'novella' | 'short-story' | 'anthology'                   // prose

export type StorySegment = {           // sub-unit inside a container Work
  id: string; title: string; parentWorkId: string; orderInParent: number
  partNumber?: number; pageStart?: number; pageEnd?: number
  storyConceptIds?: string[]; continuityIds?: string[]; labels?: StoryLabel[]
}

export type Continuity = {             // Legends vs Canon, Post-Crisis vs New 52, ...
  id: string; franchiseId: string; name: string; parentId?: string
  startYear?: number; endYear?: number; description?: string
}

export type CanonStatus =
  | 'canon' | 'semi-canon' | 'alternate' | 'retconned' | 'contradicted' | 'unknown'

export type ReadingOrder = {
  id: string; franchiseId: string; title: string; description?: string
  continuityIds?: string[]; defaultMode: ReadingOrderMode; blocks: ReadingOrderBlock[]
  source: ContentSource; ownerId?: string; visibility?: Visibility
  forkedFromId?: string; createdAt?: string; updatedAt?: string
}
export type ReadingOrderMode =
  | 'chronological' | 'publication' | 'recommended' | 'trade-first' | 'issue-by-issue'

export type ReadingOrderBlock =
  | { type: 'work'; workId: string; importance: ImportanceLevel; canonStatus?: CanonStatus; order: number }
  | { type: 'story-segment'; storySegmentId: string; importance: ImportanceLevel; canonStatus?: CanonStatus; order: number }
  | { type: 'custom'; title: string; note?: string; formFactor?: FormFactor; importance?: ImportanceLevel; order: number }
  | { type: 'marker'; markerKind: 'year' | 'era' | 'event' | 'milestone'; label: string; order: number }
  | { type: 'annotation'; annotationKind: 'note' | 'warning' | 'continuity' | 'spoiler' | 'editorial'; title?: string; body: string; order: number; relatedWorkIds?: string[] }
  | { type: 'decision'; title: string; body?: string; options: DecisionOption[]; order: number }

export type ImportanceLevel = 'essential' | 'recommended' | 'optional' | 'completionist'
```

Plus: `StoryConcept`, `Milestone`, `StoryLabel`, `Era`, `TimelineYear`, `Relationship`, `Coverage` — unchanged from the combined plan; carried into the engine package. The `custom` block lets users fill catalogue gaps without authoring full Works (Phase A).

---

## Content packs (curated, file-based)

Curated data ships as `@nuxt/content` collections, following the content layer's pattern (exported Zod schemas + `create*Collection` factories) in `apps/web/content.config.ts`. Actual franchise data lives in `apps/web/content/`:

```txt
content/
  batman/      franchise.yml · continuities/ eras/ years/ works/ story-segments/
               story-concepts/ milestones/ reading-orders/ relationships/
  star-wars/   continuities/legends.yml + canon.yml · ...
  doctor-who/  multi-medium: serials, Big Finish audio box sets, novels · ...
```

A new franchise is a sibling folder validated by the same schemas.

Worked fits that stress the model:

```txt
Star Wars    Legends vs Canon = two Continuity records + CanonStatus alternate.
             Works span films/tv/novels/comics → per-Work medium override.
Doctor Who   No formal canon (canonModel note + CanonStatus 'unknown'). Containers:
             serial→episodes, audio box set→audio stories via StorySegment.parentWorkId.
             Most justifies user orders: no single right sequence.
```

---

## Persistence (user state)

Curated content = files. User content = Postgres (the `database` layer). The Chronos app owns these tables in `server/database/schema.ts`:

```txt
users           id (=github providerId), username, avatar_url, created_at
orders          id, owner_id, franchise_id, title, blocks(jsonb), visibility,
                forked_from_id, created_at, updated_at
progress        user_id, target_id, status, updated_at
owned_editions  user_id, work_id, updated_at
```

`server/api/orders/*` routes guard with `requireUserSession()` (auth layer) and read/write via `useDb()` (database layer). The engine's `OrderStore` is implemented by the client `ApiOrderStore` calling those routes.

---

## UI views

```txt
Home · Order (Reading/Watch/Listen by medium) · Order Builder (the authoring surface)
Year View · Era View · Story Concept · Work · Story Segment · Character
Collected Edition · Account (my orders / progress / ownership) · Discover (Phase B+)
```

Built on the reused `kmcom` layers: `ui` (Swiss design system), `motion` (GSAP transitions), `theme` (colour mode / contrast / motion prefs).

---

## MVP (assumes Stage 1 done)

```txt
1.  Scaffold chronos monorepo from the Stage-2 boilerplate; extend database + auth.
2.  @chronos/engine: domain types + Store contracts + resolver + unit tests.
3.  server/database/schema.ts: users + orders + progress (+ migration).
4.  content.config.ts schemas + import Obsidian notes → YAML → Batman pack.
5.  Curated Post-Crisis Batman orders.
6.  Read-only UI: list / era / year views; filters (essential→completionist);
    form-factor toggle (atomic vs collected); annotations.
7.  GitHub login (auth layer).
8.  Order authoring (Phase A): build from catalogue + custom entries → /api/orders.
    Progress tracking.

Then: 2nd pack (Star Wars or Doctor Who) → sharing (Phase B) → metadata enrichment
→ PWA → Capacitor.
```

---

## Phasing & mobile

```txt
Phase A  Users compose orders from the catalogue + CustomEntry. No user-authored Works.
Phase B  Sharing: visibility, share links, forking, Discover.
Phase C  User-authored Works + community moderation (only if warranted).

Mobile   PWA first (static content + small user state = ideal PWA). Capacitor wrapping
         apps/web later for App Store presence — engine + API reused unchanged.
```

---

## Roadmap

```txt
0. Prereqs     Stage 1 layers (database, auth) merged + published; Stage 2 boilerplate ready
1. Engine      @chronos/engine contracts + resolver + tests
2. Data        schema + migrations; Obsidian → YAML → Batman pack
3. Read-only   curated Batman orders + list/era/year views
4. Accounts    GitHub login
5. Authoring   Phase A order builder + progress
6. 2nd pack    Star Wars or Doctor Who (proves medium-generality)
7. Sharing     Phase B
8. Enrichment  Comic Vine / Open Library / TMDB → metadata → cache
9. Reach       PWA → Capacitor
```
