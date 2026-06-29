# Fix: Theme Layer Default Accent Not Configurable

## Problem

The `theme` layer in `kmcom-nuxt-layers` manages primary colors via a `data-theme-colour`
HTML attribute system — not via Nuxt UI's `ui.colors.primary` in `app.config.ts`. This means
setting `ui.colors.primary: 'green'` in the consuming app has no effect because the theme
layer's CSS overrides `--ui-color-primary-*` variables with attribute-scoped rules like
`html[data-theme-colour="green"]{ ... }`.

The actual default is controlled by `themeLayer.defaultAccent` in `app.config.ts`. However,
even when a consuming app sets `themeLayer.defaultAccent: 'green'`, first-time visitors
(no localStorage) still see blue, because the blocking init script in the Nitro server plugin
has `'blue'` hardcoded as the fallback:

```ts
// layers/theme/server/plugins/theme-fouc.ts (line 35)
h.setAttribute('data-theme-colour', c ? JSON.parse(c) : 'blue')
```

This hardcoded `'blue'` cannot be overridden by a consuming app.

## Root Cause

`theme-fouc.ts` generates `initScript` as a **module-level string constant** at startup,
so it can never read app config or runtime config. The default accent is hardcoded rather
than derived from configuration.

## Fix Required

**Repository:** `/Users/kieranmansfield/Developer/layers/nuxt-layers`
**File to change:** `layers/theme/server/plugins/theme-fouc.ts`

### Approach

Move `initScript` generation inside the `render:html` hook so the default accent can be
read from the event's runtime config. Expose a new public runtime config key
`themeDefaultAccent` in the theme layer's `nuxt.config.ts`, and use it in the script.

### Step 1 — Add runtimeConfig to `layers/theme/nuxt.config.ts`

Add a `runtimeConfig.public` entry so consuming apps can override the default:

```ts
runtimeConfig: {
  public: {
    themeDefaultAccent: 'blue',  // consuming app overrides this
  },
},
```

### Step 2 — Update `layers/theme/server/plugins/theme-fouc.ts`

Change `initScript` from a module-level const to a function that accepts the default accent,
then generate it inside the `render:html` hook using `useRuntimeConfig(event)`:

```ts
import { buildAccentCSS } from '../utils/accent-css'

const accentCSS = buildAccentCSS()  // still fine as a module-level const

function buildInitScript(defaultAccent: string) {
  return `(function(){
    try{
      var h=document.documentElement;
      var c=localStorage.getItem('theme-colour');
      h.setAttribute('data-theme-colour',c?JSON.parse(c):'${defaultAccent}');
      // ... rest of the script unchanged ...
    }catch(e){}
  })()`.replace(/\n\s*/g, '')
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const config = useRuntimeConfig(event)
    const defaultAccent = (config.public.themeDefaultAccent as string) || 'blue'
    const initScript = buildInitScript(defaultAccent)
    html.head.unshift(
      `<style id="theme-accent-css">${accentCSS}</style><script>${initScript}</script>`
    )
  })
})
```

Make sure to keep the full existing init script body — only the default value for
`data-theme-colour` changes (from the hardcoded string `'blue'` to the template variable).

### Step 3 — Verify the fix in the consuming app

In `/Users/kieranmansfield/Developer/boilerplate/frontend`, the consuming app should be
able to configure the default by adding to `nuxt.config.ts`:

```ts
runtimeConfig: {
  public: {
    themeDefaultAccent: 'green',
  },
},
```

Or via environment variable: `NUXT_PUBLIC_THEME_DEFAULT_ACCENT=green`.

After the fix, first-time visitors (no localStorage) should see green, not blue.

## Acceptance Criteria

- [ ] `layers/theme/nuxt.config.ts` exposes `runtimeConfig.public.themeDefaultAccent: 'blue'`
- [ ] `layers/theme/server/plugins/theme-fouc.ts` reads the value via `useRuntimeConfig(event)` inside the hook
- [ ] The `initScript` default falls back to `'blue'` if the config key is absent
- [ ] The existing full init script body (contrast, motion, transparency, dark mode) is preserved exactly
- [ ] `accentCSS` remains a module-level const (it's not per-request)
- [ ] A consuming app setting `runtimeConfig.public.themeDefaultAccent: 'green'` sees green on first visit with no localStorage

## Notes

- The `useAccentColor` composable already reads `appConfig.themeLayer.defaultAccent` for
  post-hydration state — that part works correctly. This fix only addresses the pre-hydration
  FOUC script that runs in the browser before Vue mounts.
- `useRuntimeConfig(event)` is the correct Nitro API for per-request runtime config access.
- Do not use `useAppConfig()` in a Nitro plugin — it is not available in the server runtime.
