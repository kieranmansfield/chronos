---
title: Atlas Design System
description: A comprehensive component library and design token system built for a SaaS platform with 12 product teams.
image: https://picsum.photos/seed/portfolio2/800/400
tags:
  - design-systems
  - components
  - tokens
client: Atlas Technologies
year: 2025
url: https://example.com
featured: true
colors:
  - name: Atlas Blue
    value: '#0066FF'
    usage: Primary actions
  - name: Midnight
    value: '#0A0E1A'
    usage: Dark backgrounds
  - name: Cloud
    value: '#F5F7FA'
    usage: Light backgrounds
  - name: Slate
    value: '#475569'
    usage: Body text
  - name: Emerald
    value: '#10B981'
    usage: Success states
  - name: Amber
    value: '#F59E0B'
    usage: Warning states
typography:
  - name: Inter
    weights:
      - '400'
      - '500'
      - '600'
      - '700'
    usage: All UI text
  - name: JetBrains Mono
    weights:
      - '400'
      - '500'
    usage: Code & data display
---

# Atlas Design System

Twelve product teams. One design language. No common components. That was the situation when Atlas Technologies brought us in.

Every team had built their own buttons, their own form inputs, their own notification patterns. The result was a product that felt like twelve different apps stitched together. Users noticed.

::callout{icon="i-lucide-target" color="primary"}
The goal: a single source of truth for UI components that works for web, mobile web, and the internal tooling dashboard — without forcing a complete rewrite.
::

## Audit First

Before touching a single component, we spent three weeks cataloguing what existed. We used a custom script to extract every unique button variant, input style, and spacing value across all twelve codebases.

The numbers were sobering:

- **47** distinct button styles
- **23** different border-radius values
- **11** conflicting primary colour values
- **6** different type scale implementations

::figure{src="https://picsum.photos/seed/atlas-audit/1000/500" alt="Component audit spreadsheet showing variants across teams" caption="The audit: every component variant catalogued before a single token was defined"}
::

## The Token Architecture

We structured tokens in three tiers:

::steps

### Primitive tokens

Raw values — the full colour palette, every spacing unit, every font size. No semantics attached.

```ts
// primitives.ts
export const color = {
  blue: {
    50: '#EFF6FF',
    // ...
    600: '#0066FF',
    // ...
  },
}
```

### Semantic tokens

Meanings assigned to primitives. Light and dark mode live here.

```ts
// semantic.ts
export const token = {
  'color.action.primary': {
    light: color.blue[600],
    dark: color.blue[400],
  },
}
```

### Component tokens

Component-specific overrides that reference semantic tokens.

::

## Adoption

Adoption was the hardest part — not technically, but politically. Each team had invested in their own patterns. The system needed to earn trust before it demanded migration.

::tip
We shipped a compatibility layer that let teams use the new tokens alongside their existing styles. Zero forced rewrites in year one.
::

The payoff came in year two: when product redesigned the primary action colour, one token change propagated across every team, every product, every platform in a single deploy.
