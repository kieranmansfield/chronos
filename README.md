# kmcom-nuxt-layers Starter

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&labelColor=020420)](https://nuxt.com)
[![kmcom-nuxt-layers](https://img.shields.io/badge/kmcom--nuxt--layers-2.x-7c3aed)](https://github.com/kieranmansfield/nuxt-layers)

A production-ready Nuxt 4 starter built on [kmcom-nuxt-layers](https://github.com/kieranmansfield/nuxt-layers) — a composable layer system for building scalable Vue applications.

## Requirements

- **Node** `>=24 <25`
- **pnpm** `>=11`

## Quick Start

```bash
pnpm install
pnpm dev
```

## Layer System

Layers are configured in [`layers.config.ts`](./layers.config.ts) at the project root. Toggle any layer by setting it to `true` or `false` — no other config changes needed.

### Core Layers

Enabled by default. No additional peer dependencies required.

| Layer | Description |
| ----- | ----------- |
| `core` | Foundation utilities, device detection, PWA, error handling |
| `ui` | Typography, navigation, visual primitives, design system |
| `layout` | Swiss Grid system, sections, page containers |
| `motion` | GSAP, Lenis smooth scroll, page transitions, marquee, cursor effects |
| `forms` | Config-driven forms with Zod validation |
| `theme` | Dark mode, accent colors, design token system |
| `content` | Markdown CMS with typed collections via @nuxt/content |
| `seo` | Meta, Open Graph, JSON-LD, sitemap via @nuxtjs/seo |
| `scripts` | Third-party script management via @nuxt/scripts |
| `routing` | Advanced routing utilities and typed middleware |
| `feeds` | RSS/feed aggregation (requires `content` layer) |
| `starter` | Starter page components — StarterHome and StarterDesignSystem |

### Add-on Layers

Disabled by default. Enable in `layers.config.ts` and install the listed packages.

| Layer | Description | Peer Dependencies |
| ----- | ----------- | ----------------- |
| `canvas` | WebGL/WebGPU canvas foundation | *(none)* |
| `shader` | Three.js + TresJS shader system | `three @tresjs/nuxt @tresjs/core @tresjs/cientos @tresjs/post-processing` |

#### Enabling the shader layer

```bash
# 1. Install peer dependencies
pnpm add three @tresjs/nuxt @tresjs/core @tresjs/cientos @tresjs/post-processing

# 2. Enable in layers.config.ts
# canvas: true
# shader: true
```

## Development

```bash
pnpm dev              # Start dev server on http://localhost:3000
pnpm build            # Production build
pnpm build:analyze    # Production build with bundle analysis
pnpm generate         # Static site generation
pnpm preview          # Preview production build
pnpm typecheck        # TypeScript type checking
pnpm lint             # Lint JS and CSS
pnpm lint:js          # Lint JavaScript/TypeScript only
pnpm lint:style       # Lint CSS/SCSS only
pnpm lint:all         # Lint + typecheck + format check
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting without writing
pnpm fix              # Auto-fix formatting and lint issues
pnpm validate         # Full validation (lint + typecheck)
pnpm clean            # Full reset — removes node_modules, lockfile, caches
```

### Syncing shared config

Tooling configs (ESLint, Prettier, Stylelint, EditorConfig) and VSCode settings are maintained in separate repositories and can be pulled in via pnpm scripts:

```bash
pnpm vscode:sync   # Pull latest .vscode/ from kieranmansfield/vscode-config
pnpm lint:sync     # Pull latest lint/format configs from kieranmansfield/tooling-config
```

## Project Structure

```text
├── layers.config.ts      # ← Toggle layers here
├── nuxt.config.ts        # Nuxt config (reads layers.config.ts)
├── app.config.ts         # Runtime app config (theme, layer options)
├── eslint.config.mjs     # ESLint flat config
├── prettier.config.cjs   # Prettier config
├── stylelint.config.mjs  # Stylelint config
├── .editorconfig         # Editor formatting defaults
├── patches/              # pnpm patches (e.g. @unhead/vue SEO fix)
├── app/
│   ├── pages/            # Application pages
│   ├── components/       # Application components
│   ├── composables/      # Custom composables
│   ├── layouts/          # App layouts
│   ├── middleware/        # Route middleware
│   ├── plugins/           # Nuxt plugins
│   ├── server/            # Server routes and API
│   ├── stores/            # Pinia stores
│   ├── utils/             # Utility functions
│   └── assets/css/        # Global styles
├── content/              # Markdown content (blog, portfolio, gallery)
└── public/               # Static assets
```

## Patches

This project includes a pnpm patch for `@unhead/vue` that adds a global head instance fallback. This resolves a compatibility issue with `@nuxtjs/seo` (schema-org and og-image modules) under `@unhead/vue` v2 when running in Nuxt plugin contexts outside of component setup.

The patch is applied automatically on `pnpm install`.

## Deployment

Configured for Netlify with hybrid rendering out of the box. See [`netlify.toml`](./netlify.toml).

```bash
pnpm build
```
