/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'app/components/**/*.{vue,js,ts}',
    'app/composables/**/*.{js,ts}',
    'app/content/**/*.md',
    'app/layouts/**/*.vue',
    'app/pages/**/*.vue',
    'app/plugins/**/*.{js,ts}',
    'app/App.{js,ts,vue}',
    'app/app.{js,ts,vue}',
    'app/Error.{js,ts,vue}',
    'app/error.{js,ts,vue}',
  ],

  safelist: [
    // Swiss Grid System - Responsive grid classes for BaseGridItem
    // Supports col-start-*, col-span-*, row-start-*, row-span-* with md: and lg: prefixes
    {
      pattern: /^(md|lg):(col|row)-(start|span)-[0-9]+$/,
    },
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}
