---
title: Welcome to the Starter Template
description: A production-ready Nuxt starter built on composable layers — typography, layout, motion, forms, and content all included.
---

# Welcome to the Starter Template

This template is built on **kmcom-nuxt-layers** — a composable layer architecture for Nuxt 4. Each layer is an independent, versioned package you can enable or disable.

## What's Included

::card-group

## ::card

title: Core
icon: i-lucide-box

---

Foundation utilities: device detection, browser info, network status, loading states, and PWA support.
::

## ::card

title: UI
icon: i-lucide-palette

---

Typography system, colour tokens, text stroke, code blocks, and the `LinksGroup` hover-focus component.
::

## ::card

title: Layout
icon: i-lucide-layout

---

18-column Swiss grid, hero/split/gallery section components, and a grid debug overlay (⌘G).
::

## ::card

title: Motion
icon: i-lucide-sparkles

---

GSAP, ScrollTrigger, Locomotive Scroll v5, and staggered animation utilities.
::

## ::card

title: Forms
icon: i-lucide-file-input

---

Config-driven form fields with Zod validation, type inference, and auto icons.
::

## ::card

title: Content
icon: i-lucide-file-text

---

This layer — blog, portfolio, and gallery collections, typed with Zod and rendered with Nuxt UI prose components.
::

::

## Getting Started

::steps

### Clone the repo

```bash
git clone https://github.com/kieranmansfield/starter-template.git my-app
cd my-app
```

### Install dependencies

```bash
pnpm install
```

### Start the dev server

```bash
pnpm dev
```

### Start writing content

Drop markdown files in `content/blog/`, `content/portfolio/`, or `content/gallery/` — they'll be picked up automatically.

::

## MDC Components

Markdown files support Nuxt UI's MDC components out of the box.

::callout{icon="i-lucide-info" color="primary"}
MDC (Markdown Components) lets you use Vue components directly inside markdown files using the `::component-name` syntax.
::

::tip
Use `::tip`, `::warning`, `::note`, and `::callout` for highlighted content blocks.
::

::warning
Frontmatter fields are validated by Zod at build time — mismatched types will cause a build error.
::

::code-group

```md [Callout]
::callout{icon="i-lucide-rocket" color="primary"}
Content here
::
```

```md [Card Group]
::card-group
::card

---

title: My Card
icon: i-lucide-star
to: /somewhere

---

Card body text here.
::
::
```

```md [Steps]
::steps

### Step one

Do the first thing.

### Step two

Do the second thing.
::
```

::
