---
title: Hello World
description: Our first blog post demonstrating the content layer's blog collection with MDC components.
date: '2026-02-01'
image: https://picsum.photos/seed/blog1/800/400
authors:
  - name: Kieran Mansfield
    avatar: https://i.pravatar.cc/150?u=kieran
    url: https://github.com/kieranmansfield
tags:
  - announcement
  - getting-started
badge: New
draft: false
readingTime: 3
---

# Hello World

Welcome to the blog. This post demonstrates the full blog rendering pipeline — frontmatter fields, Zod validation, MDC components, and surround navigation.

## What the Content Layer Provides

::card-group

## ::card

title: Typed Collections
icon: i-lucide-database

---

Zod schemas validate every frontmatter field at build time. Mismatched types fail fast.
::

## ::card

title: Composables
icon: i-lucide-code-2

---

`useBlogPosts()`, `useBlogPost()`, `usePortfolioItems()`, and `useGalleryItems()` handle all data fetching.
::

## ::card

title: Default Pages
icon: i-lucide-layout

---

`/blog`, `/blog/[slug]`, `/portfolio`, `/portfolio/[slug]`, and `/gallery` routes are provided by the layer.
::

## ::card

title: MDC Support
icon: i-lucide-component

---

Callouts, tabs, steps, card groups, and code groups work in markdown out of the box.
::

::

## Setting Up the Content Layer

::steps

### Add the dependency

`@nuxt/content` needs to be in your `devDependencies`.

```bash [pnpm]
pnpm add -D @nuxt/content
```

### Enable the layer

Uncomment the content layer in `nuxt.config.ts`.

```ts [nuxt.config.ts]
extends: [
  join(layersRoot, 'core'),
  join(layersRoot, 'content'), // <- add this
]
```

### Add content.config.ts

Create `content.config.ts` at the project root defining your collections.

```ts [content.config.ts]
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        draft: z.boolean().default(false),
      }),
    }),
  },
})
```

### Start writing

Drop `.md` files in `content/blog/` and navigate to `/blog`.

::

## Fetching Posts in a Component

::tip
All composables are auto-imported — no explicit import statement needed.
::

::code-group

```ts [List view]
const { data: posts } = await useBlogPosts({
  excludeDrafts: true,
  tags: ['announcement'],
  limit: 10,
})
```

```ts [Detail view]
const { data: post } = await useBlogPost(route.params.slug)
```

```ts [Raw query]
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
```

::

## Next Steps

::note
Explore the portfolio and gallery collections to see the full content layer in action.
::

::card-group

## ::card

title: Portfolio
icon: i-lucide-briefcase
to: /portfolio

---

Showcase client projects with colour palettes, typography, and featured filtering.
::

## ::card

title: Gallery
icon: i-lucide-images
to: /gallery

---

Photo collections with lightbox, image metadata, and ambient blur effects.
::

::
