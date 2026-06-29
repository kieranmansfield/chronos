/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  endOfLine: 'lf',
  vueIndentScriptAndStyle: true,
  arrowParens: 'always',
  singleAttributePerLine: false,
  htmlWhitespaceSensitivity: 'css',

  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-tailwind-styled-components',
    'prettier-plugin-organize-attributes',
    'prettier-plugin-css-order',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-glsl',
  ],

  importOrder: [
    '<BUILTIN_MODULES>',
    '^(node:.*)',
    '^vue$',
    '^@vue/(.*)$',
    '^vue-(.*)$',
    '^nuxt$',
    '^#(.*)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/(.*)$',
    '^~/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',

  attributeGroups: [
    '$DEFAULT',
    '^v-(if|else-if|else|for|show|model|on|bind|slot|html|text|pre|cloak|once)$',
  ],

  ignorePath: '.prettierignore',

  overrides: [
    { files: '*.{md,mdx}', options: { proseWrap: 'preserve' } },
    { files: '*.json', options: { printWidth: 200 } },
  ],
}
