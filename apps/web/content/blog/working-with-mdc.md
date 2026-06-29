---
title: Working with MDC Components
description: A practical guide to using Markdown Components (MDC) in your content — callouts, tabs, steps, code groups, card groups, and figures.
date: '2026-02-15'
image: https://picsum.photos/seed/blog3/800/400
authors:
  - name: Kieran Mansfield
    avatar: https://i.pravatar.cc/150?u=kieran
tags:
  - mdc
  - markdown
  - content
draft: false
readingTime: 4
---

# Working with MDC Components

MDC (Markdown Components) extends standard markdown with Vue components using a clean `::component-name` syntax. The content layer ships with all Nuxt UI prose components pre-configured.

## Inline Components

Use single colons for inline components:

`:badge[New]{color="success"}` renders as an inline badge.

## Block Components

Use double colons for block-level components:

### Callouts

::callout{icon="i-lucide-info" color="primary"}
A primary callout with a custom icon.
::

::tip
A tip callout — shorthand for `::callout{color="success"}`.
::

::warning
A warning callout — shorthand for `::callout{color="warning"}`.
::

::note
A note callout — shorthand for `::callout{color="neutral"}`.
::

```md
::tip
Tip text here.
::

::warning
Warning text here.
::
```

### Steps

Use `::steps` for numbered sequences. Each `###` heading becomes a step:

::steps

### Install dependencies

```bash
pnpm install
```

### Configure your layer

Add the layer path to `extends` in `nuxt.config.ts`.

### Create your first content file

Drop a `.md` file into `content/blog/` with the required frontmatter.

### Run the dev server

```bash
pnpm dev
```

::

### Code Groups

Show multiple code snippets in a tabbed interface:

::code-group

```ts [TypeScript]
const post = await useBlogPost('hello-world')
console.log(post.data.value?.title)
```

```vue [Vue Component]
<script setup lang="ts">
const { data: post } = await useBlogPost('hello-world')
</script>
<template>
  <h1>{{ post?.title }}</h1>
</template>
```

```md [Markdown Frontmatter]
---
title: My Post
date: '2026-01-01'
draft: false
---
```

::

### Card Groups

Arrange cards in a responsive grid:

::card-group

## ::card

title: Blog
icon: i-lucide-pen-line
to: /blog

---

Articles with authors, tags, and surround navigation.
::

## ::card

title: Portfolio
icon: i-lucide-briefcase
to: /portfolio

---

Projects with client info, colour palettes, and typography specs.
::

## ::card

title: Gallery
icon: i-lucide-images
to: /gallery

---

Photo collections with lightbox and ambient blur effects.
::

::

### Tabs

::tabs

:::tabs-item{label="Usage" icon="i-lucide-code-2"}

```md
::tabs
:::tabs-item{label="First tab" icon="i-lucide-star"}
Tab one content here.
:::
:::tabs-item{label="Second tab" icon="i-lucide-heart"}
Tab two content here.
:::
::
```

:::

:::tabs-item{label="Result" icon="i-lucide-eye"}

Tabs render as an interactive `UTabs` component with icons, exactly as shown in this demo.

:::

::

### Figures

The `::figure` component wraps images with an optional caption:

::figure{src="https://picsum.photos/seed/mdc-demo/800/400" alt="Demo image showing a landscape" caption="A placeholder image rendered via the ContentFigure component"}
::

```md
::figure{src="/my-image.jpg" alt="Description" caption="Optional caption text"}
::
```

## Nesting Components

You can nest components using three colons for the outer wrapper:

```md
::card-group

## :::card

## title: Nested Card

Content here
:::

::
```

::tip
Use `::` (two colons) for the outer component and `:::` (three colons) for nested children to avoid ambiguity.
::
