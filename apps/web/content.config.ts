import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const mediumSchema = z.enum(['comics', 'film', 'tv', 'audio', 'prose', 'game', 'mixed'])
const importanceLevelSchema = z.enum(['essential', 'recommended', 'optional', 'completionist'])
const canonStatusSchema = z.enum(['canon', 'semi-canon', 'alternate', 'retconned', 'contradicted', 'unknown'])
const formFactorSchema = z.enum([
  'issue', 'arc', 'story', 'graphic-novel', 'trade', 'omnibus',
  'episode', 'serial', 'season', 'film', 'tv-movie', 'short', 'special',
  'audio-story', 'audio-box-set', 'audio-drama',
  'novel', 'novella', 'short-story', 'anthology',
])
const storyLabelSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string().optional(),
})
const decisionOptionSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  blockIds: z.array(z.string()),
})
const readingOrderBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('work'), workId: z.string(), importance: importanceLevelSchema, canonStatus: canonStatusSchema.optional(), order: z.number() }),
  z.object({ type: z.literal('story-segment'), storySegmentId: z.string(), importance: importanceLevelSchema, canonStatus: canonStatusSchema.optional(), order: z.number() }),
  z.object({ type: z.literal('custom'), title: z.string(), note: z.string().optional(), formFactor: formFactorSchema.optional(), importance: importanceLevelSchema.optional(), order: z.number() }),
  z.object({ type: z.literal('marker'), markerKind: z.enum(['year', 'era', 'event', 'milestone']), label: z.string(), order: z.number() }),
  z.object({ type: z.literal('annotation'), annotationKind: z.enum(['note', 'warning', 'continuity', 'spoiler', 'editorial']), title: z.string().optional(), body: z.string(), order: z.number(), relatedWorkIds: z.array(z.string()).optional() }),
  z.object({ type: z.literal('decision'), title: z.string(), body: z.string().optional(), options: z.array(decisionOptionSchema), order: z.number() }),
])

export default defineContentConfig({
  collections: {
    franchises: defineCollection({
      type: 'data',
      source: '**/franchise.yml',
      schema: z.object({
        id: z.string(),
        name: z.string(),
        publisher: z.string().optional(),
        medium: mediumSchema,
        canonModel: z.string().optional(),
        scopes: z.array(z.object({
          id: z.string(),
          name: z.string(),
          parentId: z.string().optional(),
        })).optional(),
      }),
    }),
    works: defineCollection({
      type: 'data',
      source: '**/works/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        title: z.string(),
        medium: mediumSchema.optional(),
        formFactor: formFactorSchema,
        atomicUnitIds: z.array(z.string()).optional(),
        storyConceptIds: z.array(z.string()).optional(),
        continuityIds: z.array(z.string()).optional(),
        labels: z.array(storyLabelSchema).optional(),
        publishedYear: z.number().optional(),
        publishedMonth: z.number().optional(),
        issueNumber: z.number().optional(),
        seriesTitle: z.string().optional(),
        writers: z.array(z.string()).optional(),
        artists: z.array(z.string()).optional(),
      }),
    }),
    storySegments: defineCollection({
      type: 'data',
      source: '**/story-segments/*.yml',
      schema: z.object({
        id: z.string(),
        title: z.string(),
        parentWorkId: z.string(),
        orderInParent: z.number(),
        partNumber: z.number().optional(),
        pageStart: z.number().optional(),
        pageEnd: z.number().optional(),
        storyConceptIds: z.array(z.string()).optional(),
        continuityIds: z.array(z.string()).optional(),
        labels: z.array(storyLabelSchema).optional(),
      }),
    }),
    continuities: defineCollection({
      type: 'data',
      source: '**/continuities/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        name: z.string(),
        parentId: z.string().optional(),
        startYear: z.number().optional(),
        endYear: z.number().optional(),
        description: z.string().optional(),
      }),
    }),
    eras: defineCollection({
      type: 'data',
      source: '**/eras/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        startYear: z.number().optional(),
        endYear: z.number().optional(),
        continuityIds: z.array(z.string()).optional(),
      }),
    }),
    timelineYears: defineCollection({
      type: 'data',
      source: '**/years/*.yml',
      schema: z.object({
        franchiseId: z.string(),
        year: z.number(),
        label: z.string().optional(),
        eraId: z.string().optional(),
      }),
    }),
    storyConcepts: defineCollection({
      type: 'data',
      source: '**/story-concepts/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        labels: z.array(storyLabelSchema).optional(),
      }),
    }),
    milestones: defineCollection({
      type: 'data',
      source: '**/milestones/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        label: z.string(),
        description: z.string().optional(),
        year: z.number().optional(),
        eraId: z.string().optional(),
      }),
    }),
    readingOrders: defineCollection({
      type: 'data',
      source: '**/reading-orders/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        continuityIds: z.array(z.string()).optional(),
        defaultMode: z.enum(['chronological', 'publication', 'recommended', 'trade-first', 'issue-by-issue']),
        blocks: z.array(readingOrderBlockSchema),
        source: z.enum(['curated', 'user', 'community']).default('curated'),
        visibility: z.enum(['private', 'unlisted', 'public']).optional(),
      }),
    }),
    relationships: defineCollection({
      type: 'data',
      source: '**/relationships/*.yml',
      schema: z.object({
        id: z.string(),
        franchiseId: z.string(),
        fromWorkId: z.string(),
        toWorkId: z.string(),
        kind: z.enum(['sequel', 'prequel', 'tie-in', 'crossover', 'adaptation', 'retelling', 'spin-off']),
        description: z.string().optional(),
      }),
    }),
  },
})
