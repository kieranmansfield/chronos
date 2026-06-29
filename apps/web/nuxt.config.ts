import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import layerConfig, { type LayerName } from './layers.config'

// Resolve the installed kmcom-nuxt-layers package path
const layersRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  'node_modules/kmcom-nuxt-layers/layers'
)

// Load order matters — dependencies must come before dependents
const LAYER_ORDER: LayerName[] = [
  'core',
  'ui',
  'layout',
  'motion',
  'forms',
  'theme',
  'content',
  'seo',
  'scripts',
  'routing',
  'feeds',
  'canvas',
  'shader',
  'starter',
]

const enabledLayers = LAYER_ORDER.filter((name) => layerConfig[name]).map((name) =>
  join(layersRoot, name)
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: enabledLayers,

  modules: [
    '@nuxt/eslint',
    // '@nuxt/ui',      // Provided by core layer
    '@nuxt/a11y',
    '@nuxt/hints',
    '@nuxt/test-utils/module',
    '@nuxtjs/html-validator',
    // '@nuxt/scripts', // Provided by scripts layer
    // '@nuxt/content', // Provided by content layer
  ],

  htmlValidator: {
    usePrettier: true,
    logLevel: 'verbose',
    failOnError: false,
  },

  // Expose active layer config to the app
  appConfig: {
    layers: layerConfig,
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      titleTemplate: '%s — kmcom Starter',
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
  },

  vite: {
    optimizeDeps: {
      include: ['@unhead/schema-org/vue', 'locomotive-scroll'],
    },
  },

  nitro: {
    preset: 'netlify',
    rollupConfig: {
      plugins: [
        {
          // kmcom-nuxt-layers ships TypeScript source and relies on Nuxt/Nitro
          // auto-imports. Neither works when Nitro bundles files directly from
          // node_modules. This plugin bridges the gap:
          //   1. Converts TypeScript → JavaScript so Rollup can parse the files.
          //   2. Injects explicit ESM imports for every auto-import the layer uses,
          //      so Rollup can wire up the real implementations.
          // The proper long-term fix is to add these imports in kmcom-nuxt-layers itself.
          name: 'kmcom-layers-compat',
          transform: {
            order: 'pre' as const,
            // fallow-ignore-next-line complexity
            async handler(code: string, id: string) {
              if (!id.includes('kmcom-nuxt-layers') || !id.endsWith('.ts')) return null

              const { transform } = await import('esbuild')
              const result = await transform(code, { loader: 'ts', sourcemap: true })
              let js = result.code

              // Inject missing explicit imports so Rollup can resolve each function
              // to its real implementation rather than leaving bare undefined references.
              // app.config.ts files live on the app/Nuxt side — defineAppConfig must not
              // cross into server runtime via #app (blocked by the impound plugin).
              // Use a local no-op instead; Nuxt already merged the real config at build time.
              const prepend: string[] = []
              if (/\bdefineAppConfig\b/.test(js))
                prepend.push(`const defineAppConfig = (c) => c`)
              if (/\bdefineNitroPlugin\b/.test(js))
                prepend.push(`import { defineNitroPlugin } from 'nitropack/runtime'`)
              if (/\bdefineEventHandler\b/.test(js))
                prepend.push(`import { defineEventHandler } from 'h3'`)
              if (/\buseRuntimeConfig\b/.test(js))
                prepend.push(`import { useRuntimeConfig } from 'nitropack/runtime'`)

              if (prepend.length) js = prepend.join('\n') + '\n' + js
              return { code: js, map: result.map }
            },
          },
        },
      ],
    },
  },

  compatibilityDate: '2026-01-20',
})
