---
title: The Nuxt Layers Architecture
description: How composable Nuxt layers enable scalable, maintainable Vue applications — and why it beats copying code between projects.
date: '2026-02-10'
image: https://picsum.photos/seed/blog2/800/400
authors:
  - name: Kieran Mansfield
    avatar: https://i.pravatar.cc/150?u=kieran
    url: https://github.com/kieranmansfield
tags:
  - architecture
  - nuxt
  - layers
draft: false
readingTime: 5
---

# The Nuxt Layers Architecture

Nuxt layers solve a real problem: how do you share code, components, and configuration between projects without copy-pasting? The answer is a composable, versioned package that any Nuxt app can extend.

## The Problem With Monoliths

A typical starter template ships everything in one bundle. You clone it, strip out what you don't need, and slowly diverge from the original. When upstream fixes a bug, you either cherry-pick it manually or give up and stay behind.

::warning
Diverging from a template base means you're on your own the moment you push the first commit.
::

## The Layer Approach

With kmcom-nuxt-layers, each layer is an independent npm package:

::card-group

## ::card

title: Core
icon: i-lucide-box

---

Foundation utilities — device detection, browser info, loading states. Everything else builds on this.
::

## ::card

title: UI
icon: i-lucide-palette

---

Typography system and colour tokens. Used by layout, content, and your own components.
::

## ::card

title: Layout
icon: i-lucide-layout

---

Swiss grid, hero sections, split sections. Depends on core.
::

## ::card

title: Content
icon: i-lucide-file-text

---

Blog, portfolio, gallery. Depends on core and UI.
::

::

### How the extends chain works

::note
Nuxt merges layer configs in order — later layers override earlier ones. Your app config always wins.
::

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: [
    'kmcom-nuxt-layers/layers/core', // 1. Foundation
    'kmcom-nuxt-layers/layers/ui', // 2. Builds on core
    'kmcom-nuxt-layers/layers/layout', // 3. Uses UI components
    'kmcom-nuxt-layers/layers/content', // 4. Uses UI + layout
  ],
})
```

Each layer's `nuxt.config.ts` declares its own modules, plugins, CSS, and aliases. You get all of that by extending it — no manual wiring.

## The Composable Pattern

All data fetching is wrapped in thin composables, keeping components focused on presentation:

::code-group

```ts [Content Layer]
// Auto-imported composable
export function useBlogPosts(options = {}) {
  return useAsyncData('blog-posts', async () => {
    let posts = await queryCollection('blog').order('date', 'DESC').all()
    if (options.excludeDrafts) {
      posts = posts.filter((p) => !p.draft)
    }
    if (options.limit) {
      posts = posts.slice(0, options.limit)
    }
    return posts
  })
}
```

```ts [In a component]
// Fetch the 3 most recent non-draft posts
const { data: posts } = await useBlogPosts({
  excludeDrafts: true,
  limit: 3,
})
```

::

## Upgrading Is a Single Command

When a fix or feature lands in `kmcom-nuxt-layers`, upgrading is:

```bash
pnpm update kmcom-nuxt-layers
```

Your app stays current without any manual migration.

::tip
Pin to a minor version (`^1.1.0`) for automatic patch updates, or a patch version (`~1.1.5`) if you want full control.
::
