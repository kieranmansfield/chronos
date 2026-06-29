/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
    'stylelint-config-recommended-vue',
  ],

  plugins: [
    'stylelint-prettier',
    'stylelint-no-unsupported-browser-features',
  ],

  overrides: [
    {
      files: ['**/*.vue', '**/*.html'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.css'],
      customSyntax: 'postcss',
    },
    {
      files: ['**/tokens.css', '**/design-tokens.css', '**/_tokens.css'],
      rules: {
        'color-no-hex': null,
        'function-disallowed-list': [],
      },
    },
  ],

  rules: {
    'prettier/prettier': true,

    'color-function-notation': 'modern',
    'alpha-value-notation': 'number',
    'media-feature-range-notation': 'context',
    'hue-degree-notation': 'angle',

    'selector-class-pattern': [
      '^([a-z][a-zA-Z0-9]*|[a-z]+(-[a-z0-9]+)*)$',
      {
        message:
          'Expected class selector to be camelCase (e.g., "redBorder") or kebab-case (e.g., "red-border")',
      },
    ],

    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'lab', 'lch'],
    'color-named': ['never', { ignore: ['inside-function'] }],

    'max-nesting-depth': [3, { ignoreAtRules: ['media', 'supports', 'include'] }],
    'selector-max-compound-selectors': 4,
    'selector-no-qualifying-type': [true, { ignore: ['attribute', 'class'] }],
    'no-descending-specificity': null,
    'selector-max-id': 0,

    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: [
          'consecutive-duplicates-with-different-values',
          'consecutive-duplicates-with-same-prefixless-values',
        ],
      },
    ],
    'declaration-block-no-duplicate-custom-properties': true,
    'declaration-no-important': [true, { severity: 'warning' }],

    'font-family-no-duplicate-names': true,
    'no-duplicate-selectors': true,
    'no-empty-source': null,

    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'stylelint-commands'],
      },
    ],

    'at-rule-no-deprecated': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'reference',
          'theme',
          'config',
          'utility',
          'custom-variant',
          'source',
          'plugin',
          'variant',
        ],
      },
    ],

    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: [
          'css-variables',
          'css-cascade-layers',
          'css-nesting',
          'subgrid',
          'css-grid',
          'viewport-unit-variants',
        ],
      },
    ],

    'custom-property-pattern': null,
  },

  ignoreFiles: ['node_modules/**', '.nuxt/**', '.output/**', '.data', '.playground/**'],
}
