// fallow-ignore-file unused-file
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        image: z.string().optional(),
        authors: z
          .array(
            z.object({
              name: z.string(),
              avatar: z.string().optional(),
              url: z.string().optional(),
            })
          )
          .default([]),
        tags: z.array(z.string()).default([]),
        badge: z.string().optional(),
        draft: z.boolean().default(false),
        readingTime: z.number().optional(),
      }),
    }),
    portfolio: defineCollection({
      type: 'page',
      source: 'portfolio/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        client: z.string().optional(),
        year: z.number().optional(),
        url: z.string().optional(),
        featured: z.boolean().default(false),
        colors: z
          .array(
            z.object({
              name: z.string(),
              value: z.string(),
              usage: z.string().optional(),
            })
          )
          .default([]),
        typography: z
          .array(
            z.object({
              name: z.string(),
              weights: z.array(z.string()).default([]),
              usage: z.string().optional(),
            })
          )
          .default([]),
      }),
    }),
    gallery: defineCollection({
      type: 'page',
      source: 'gallery/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        images: z
          .array(
            z.object({
              src: z.string(),
              alt: z.string(),
              width: z.number().optional(),
              height: z.number().optional(),
              caption: z.string().optional(),
              title: z.string().optional(),
              ambient: z.boolean().default(false),
            })
          )
          .default([]),
        tags: z.array(z.string()).default([]),
        date: z.string().optional(),
      }),
    }),
  },
})
