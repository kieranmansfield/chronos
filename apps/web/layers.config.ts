/**
 * Layer configuration for this Nuxt starter.
 *
 * Powered by kmcom-nuxt-layers — https://github.com/kieranmansfield/nuxt-layers
 *
 * ─── Core Layers ──────────────────────────────────────────────────────────────
 * The solid foundation. These layers work together out of the box with no
 * additional peer dependencies. Disable only if you know what you're removing.
 *
 * ─── Add-on Layers ────────────────────────────────────────────────────────────
 * Optional capabilities. Each has peer dependencies you must install before
 * enabling — see the comments for the required packages.
 */

// ── Core ──────────────────────────────────────────────────────────────────────

const coreLayers = {
  /** Foundation utilities, device detection, PWA, error handling */
  core: true,
  /** Typography, navigation, visual primitives, design system */
  ui: true,
  /** Swiss Grid system, sections, page containers */
  layout: true,
  /** GSAP, Lenis smooth scroll, page transitions, marquee, cursor effects */
  motion: true,
  /** Config-driven forms with Zod validation */
  forms: true,
  /** Dark mode, accent colors, color tokens */
  theme: true,
  /** Markdown CMS via @nuxt/content with typed collections */
  content: true,
  /** SEO meta, Open Graph, JSON-LD, sitemap via @nuxtjs/seo */
  seo: true,
  /** Analytics and third-party script management via @nuxt/scripts */
  scripts: true,
  /** Advanced routing utilities, typed middleware */
  routing: true,
  /**
   * RSS/feed aggregation and display.
   * Requires: content layer (already included in core)
   */
  feeds: true,
  /** Starter page components — StarterHome and StarterDesignSystem */
  starter: true,
} as const

// ── Add-ons ───────────────────────────────────────────────────────────────────

const addonLayers = {
  /**
   * WebGL/WebGPU canvas foundation — required by shader layer.
   * No additional peer dependencies.
   */
  canvas: false,

  /**
   * Three.js + TresJS shader system with TSL, noise, post-processing.
   * Requires: canvas layer (above) and the following packages —
   *   pnpm add three @tresjs/nuxt @tresjs/core @tresjs/cientos @tresjs/post-processing
   */
  shader: false,
} as const

// ── Export ────────────────────────────────────────────────────────────────────

const layersConfig = { ...coreLayers, ...addonLayers }

export type LayerName = keyof typeof layersConfig

export default layersConfig
