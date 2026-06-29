// Domain types — zero Nuxt/Vue deps
export type Medium = 'comics' | 'film' | 'tv' | 'audio' | 'prose' | 'game' | 'mixed'

export type ContentSource = 'curated' | 'user' | 'community'
export type Visibility = 'private' | 'unlisted' | 'public'

export type Ownership = {
  source: ContentSource
  ownerId?: string
  visibility?: Visibility
  forkedFromId?: string
  createdAt?: string
  updatedAt?: string
}

export type FormFactor =
  | 'issue' | 'arc' | 'story' | 'graphic-novel' | 'trade' | 'omnibus'
  | 'episode' | 'serial' | 'season' | 'film' | 'tv-movie' | 'short' | 'special'
  | 'audio-story' | 'audio-box-set' | 'audio-drama'
  | 'novel' | 'novella' | 'short-story' | 'anthology'

export type ImportanceLevel = 'essential' | 'recommended' | 'optional' | 'completionist'

export type CanonStatus =
  | 'canon' | 'semi-canon' | 'alternate' | 'retconned' | 'contradicted' | 'unknown'

export type StoryLabel = {
  id: string
  label: string
  color?: string
}

export type Franchise = {
  id: string
  name: string
  publisher?: string
  medium: Medium
  canonModel?: string
  scopes?: { id: string; name: string; parentId?: string }[]
}

export type Work = {
  id: string
  franchiseId: string
  title: string
  medium?: Medium
  formFactor: FormFactor
  atomicUnitIds?: string[]
  storyConceptIds?: string[]
  continuityIds?: string[]
  labels?: StoryLabel[]
  ownership?: Ownership
}

export type StorySegment = {
  id: string
  title: string
  parentWorkId: string
  orderInParent: number
  partNumber?: number
  pageStart?: number
  pageEnd?: number
  storyConceptIds?: string[]
  continuityIds?: string[]
  labels?: StoryLabel[]
}

export type Continuity = {
  id: string
  franchiseId: string
  name: string
  parentId?: string
  startYear?: number
  endYear?: number
  description?: string
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

export type DecisionOption = {
  label: string
  description?: string
  blockIds: string[]
}

export type ReadingOrder = {
  id: string
  franchiseId: string
  title: string
  description?: string
  continuityIds?: string[]
  defaultMode: ReadingOrderMode
  blocks: ReadingOrderBlock[]
  source: ContentSource
  ownerId?: string
  visibility?: Visibility
  forkedFromId?: string
  createdAt?: string
  updatedAt?: string
}

export type Catalogue = {
  franchise: Franchise
  works: Work[]
  storySegments: StorySegment[]
  continuities: Continuity[]
}

export type PlanFilters = {
  importance?: ImportanceLevel[]
  continuityIds?: string[]
  formFactors?: FormFactor[]
}

export type ResolvedBlock = ReadingOrderBlock & { resolved?: Work | StorySegment }

export type SavedOrder = ReadingOrder

export type ProgressStatus = 'unread' | 'in-progress' | 'completed'

export type ProgressState = {
  userId: string
  targetId: string
  status: ProgressStatus
  updatedAt: string
}

// Storage contracts — implemented by the Nuxt app, never touched by the engine
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

const IMPORTANCE_RANK: Record<ImportanceLevel, number> = {
  essential: 0,
  recommended: 1,
  optional: 2,
  completionist: 3,
}

// Pure resolver — no side effects, fully testable
export function resolveOrder(
  order: ReadingOrder,
  _catalogue: Catalogue,
  filters: PlanFilters,
): ResolvedBlock[] {
  const minRank = filters.importance
    ? Math.max(...filters.importance.map((i) => IMPORTANCE_RANK[i]))
    : IMPORTANCE_RANK.completionist

  return order.blocks
    // fallow-ignore-next-line complexity
    .filter((block) => {
      if (block.type === 'marker' || block.type === 'annotation' || block.type === 'decision') return true
      const rank = IMPORTANCE_RANK[block.importance ?? 'completionist']
      return rank <= minRank
    })
    .sort((a, b) => a.order - b.order)
}
