export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate',
    },
  },

  // ── Core Layer ──────────────────────────────────────────────────────────────
  coreLayer: {
    // Loading screen shown during initial hydration
    loading: {
      // enabled: false,
    },
  },

  // ── Theme Layer ─────────────────────────────────────────────────────────────
  themeLayer: {
    defaultAccent: 'green',
  },
})
