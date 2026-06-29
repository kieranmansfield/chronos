import { fileURLToPath } from 'node:url'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import compat from 'eslint-plugin-compat'
// import pluginOxlint from 'eslint-plugin-oxlint'
import { configs as pnpmConfigs } from 'eslint-plugin-pnpm'
import prettier from 'eslint-plugin-prettier'
// import pluginUnicorn from 'eslint-plugin-unicorn'
import vue from 'eslint-plugin-vue'

// import glsl from 'eslint-plugin-glsl'

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfigWithVueTs(
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.vscode/**',
      '**/.turbo/**',
      '**/.playground/**',
      '**/.netlify/**',
      '**/dist/**',
      '**/oldApp/**',
      '**/package-lock.json',
      // Vendored agent-skill content — not project source
      '.agents/**',
      '.claude/**',
      // Vendored TSL shader reference dumps (tracked for removal in #42)
      'layers/shader/modular-tsl-shaders-for-claude/**',
      'layers/shader/additional-modular-tsl-shaders-for-claude/**',
      // jiti reproduction scratch file
      'layers/content/_jiti_test.ts',
      // tsconfig files use JSONC comments the JSON language parser rejects
      '**/tsconfig.json',
      '**/tsconfig.*.json',
      '**/jsconfig.json',
    ],
  },

  ...vue.configs['flat/essential'].map((config) => ({ ...config, files: ['**/*.vue'] })),
  ...vue.configs['flat/recommended'].map((config) => ({ ...config, files: ['**/*.vue'] })),
  vueTsConfigs.recommended,
  // pluginUnicorn.configs.recommended,

  // Layer `tsconfig.json` files extend the playground's, which only declares
  // `references` (not inherited via `extends`) — so the TS project service
  // can't resolve layer files from their nearest tsconfig. Point type-aware
  // linting at the root project file that already covers every layer instead.
  // Scoped to `layers/**` only — apps keep their own working `.nuxt` project chain,
  // which `tsconfig.typecheck.json` does not include.
  // Scoped to `layers/*/app/**` — that's what tsconfig.typecheck.json includes;
  // layer `server/` files are not part of that project and would fail to parse.
  {
    files: [
      'layers/*/app/**/*.ts',
      'layers/*/app/**/*.tsx',
      'layers/*/app/**/*.mts',
      'layers/*/app/**/*.vue',
    ],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: ['./tsconfig.typecheck.json'],
        tsconfigRootDir,
      },
    },
  },

  // Vue/Nuxt
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: typescriptParser,
      },
    },
    plugins: {
      vue,

      prettier,
      compat,
    },
    rules: {
      'prettier/prettier': ['error'],
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disable formatting rules that conflict with Prettier
      'vue/html-closing-bracket-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multi-word-component-names': 'off',

      // Code quality
      'vue/block-spacing': ['error', 'always'],
      'vue/v-bind-style': ['error', 'shorthand', { sameNameShorthand: 'always' }],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-useless-v-bind': 'error',
      'vue/no-unused-refs': 'error',
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/html-comment-content-spacing': ['error', 'always'],
      'vue/no-empty-component-block': 'error',

      // TypeScript and type-based syntax
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'vue/no-duplicate-attr-inheritance': 'error',
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-on-event-hyphenation': ['error', 'always'],

      // Macros
      'vue/define-macros-order': [
        'error',
        { order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots', 'defineExpose'] },
      ],
      'vue/define-props-destructuring': ['error', { destructure: 'always' }],
      'vue/require-macro-variable-name': [
        'error',
        { defineProps: 'props', defineEmits: 'emit', defineSlots: 'slots' },
      ],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/no-unused-properties': [
        'error',
        { groups: ['props', 'data', 'computed', 'methods', 'setup'] },
      ],
      'vue/prefer-use-template-ref': 'error',
      'vue/max-template-depth': ['error', { maxDepth: 8 }],

      // Composition API enforcement
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/prefer-define-options': 'error',
      'vue/no-export-in-script-setup': 'error',
      'vue/no-deprecated-slot-attribute': 'error',
      'vue/no-deprecated-slot-scope-attribute': 'error',
      'vue/no-deprecated-v-bind-sync': 'error',
      'vue/prefer-prop-type-boolean-first': 'error',
      'vue/no-required-prop-with-default': 'error',
      // Off: the rule demands named wrapper methods for every trivial handler
      // (`@click="emit('close')"` etc.) — noise for demo-heavy pages.
      'vue/v-on-handler-style': 'off',
      'vue/no-this-in-before-route-enter': 'error',
      'vue/require-emit-validator': 'warn',
      'vue/require-typed-object-prop': 'error',

      // Reactivity safety
      'vue/no-ref-object-reactivity-loss': 'error',
      'vue/max-lines-per-block': ['error', { template: 300, script: 300, style: 200 }],
      'vue/require-typed-ref': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/no-ref-as-operand': 'error',
      'vue/no-lifecycle-after-await': 'error',
      'vue/no-watch-after-await': 'error',
      'vue/no-expose-after-await': 'error',
      'vue/require-name-property': 'error',
      // The component APIs intentionally ship default-true booleans
      // (e.g. `antialias`, `windowSize`) — flipping them would break consumers.
      'vue/no-boolean-default': 'off',
      'vue/no-unused-emit-declarations': 'error',
      'vue/no-unused-vars': 'error',
      'vue/no-template-shadow': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',
      'vue/no-async-in-computed-properties': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-restricted-call-after-await': [
        'error',
        { module: 'vue', path: 'provide', message: 'provide() must be called before any await.' },
        { module: 'vue', path: 'inject', message: 'inject() must be called before any await.' },
      ],

      // The @typescript-eslint variant allows `import type { ... } from 'vue'` —
      // Vue *types* are not auto-imported by Nuxt, only runtime APIs are.
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vue',
              message: 'Vue APIs are auto-imported by Nuxt. Remove this import.',
              allowTypeImports: true,
            },
            { name: '#imports', message: 'Already auto-imported by Nuxt.' },
            { name: '#components', message: 'Components are auto-imported by Nuxt.' },
          ],
          patterns: ['@/components/**', '~/components/**'],
        },
      ],

      'unicorn/filename-case': 'off',
    },
  },

  // TypeScript
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier,
      compat,
    },
    rules: {
      complexity: ['warn', { max: 10 }],
      'no-nested-ternary': 'error',
      eqeqeq: ['error', 'always'],
      'no-implicit-coercion': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-unneeded-ternary': 'error',
      'max-params': ['warn', { max: 3 }],

      // 'never' is unworkable here: TSL node graphs, Nuxt app-config generics and
      // h3 utilities all need occasional `as` bridges. Ban only angle-bracket style.
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-find': 'error',

      'no-restricted-syntax': [
        'error',
        { selector: 'TSEnumDeclaration', message: 'Use literal unions instead of enums.' },
        {
          selector: 'IfStatement > :not(IfStatement).alternate',
          message: 'Avoid else. Use early returns.',
        },
        // (TryStatement ban removed — the prescribed tryCatch() helper was never
        // implemented, so the rule was unsatisfiable and only generated disables.)
        {
          selector:
            "VariableDeclarator[id.type='Identifier'][id.name='props'][init.callee.name='defineProps']",
          message:
            'Avoid `const props = defineProps()`. Destructure: `const { foo } = defineProps<...>()`.',
        },
        {
          selector: "VariableDeclarator[init.callee.name='reactive'] > ObjectPattern",
          message:
            'Do not destructure reactive() — it breaks reactivity. Use toRefs() or keep the object reference.',
        },
        {
          selector:
            "CallExpression[callee.name='watch'] > MemberExpression.arguments:first-child[object.name='props']",
          message:
            'watch(props.x, …) captures the value once. Use a getter: watch(() => props.x, …).',
        },
        {
          selector:
            "CallExpression[callee.name='watch'] > MemberExpression.arguments:first-child[property.name='value']",
          message:
            'watch(ref.value, …) captures the value once. Pass the ref itself or a getter: watch(ref, …).',
        },
        {
          selector: "MemberExpression[object.name='process'][property.name='client']",
          message: 'Use import.meta.client (Nuxt 3) — process.client is deprecated.',
        },
        {
          selector: "MemberExpression[object.name='process'][property.name='server']",
          message: 'Use import.meta.server (Nuxt 3) — process.server is deprecated.',
        },
        {
          selector: "CallExpression[callee.name='useState'][arguments.length=0]",
          message: 'useState requires an explicit key for SSR-safe state.',
        },
        {
          selector: "CallExpression[callee.name='useFetch'][arguments.length=0]",
          message: 'useFetch must be called with at least a URL.',
        },
        {
          selector: "CallExpression[callee.name='useAsyncData'][arguments.length=0]",
          message: 'useAsyncData must be called with at least a key + handler.',
        },
        {
          selector:
            "ExportDefaultDeclaration > CallExpression[callee.name='defineNuxtPlugin'] > ArrowFunctionExpression",
          message:
            'Prefer the object syntax for defineNuxtPlugin({ name, hooks }) — Nuxt can statically analyse and parallelize it.',
        },
        {
          selector: 'Program > VariableDeclaration[kind="let"][declarations.0.init]',
          message:
            'Module-level `let` is a cross-request state-pollution risk under SSR. Use `useState(key, …)` or move into a composable.',
        },
      ],
    },
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier,
      compat,
    },
  },

  // TSL files (treat as TypeScript)
  {
    files: ['**/*.tsl'],
    languageOptions: {
      parser: typescriptParser,
    },
  },

  // JSON linting (package.json is handled by the pnpm config below, with its own parser)
  {
    files: ['**/*.json'],
    ignores: ['**/package.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },

  // Markdown linting (`recommended` is an array of configs, not a single config object)
  ...markdown.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.md'],
    language: 'markdown/gfm',
  })),

  // OXLint integration
  // ...pluginOxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  // pnpm catalog enforcement (bundles its own jsonc parser for package.json)
  ...pnpmConfigs.json,

  // Layer/app config files (nuxt.config.ts, etc.) sit outside tsconfig.typecheck.json's
  // `include` — they're not part of the type-checked app, so skip type-aware rules for
  // them. Must come last so it overrides the type-aware rules set above.
  {
    files: ['**/nuxt.config.ts', '**/*.config.ts', '**/*.config.mts'],
    ...typescript.configs['flat/disable-type-checked'],
  },

  // Layer server/ files are Nitro code outside tsconfig.typecheck.json's project,
  // so type-aware rules can't run on them either.
  {
    files: ['layers/*/server/**/*.ts', 'layers/*/shared/**/*.ts'],
    ...typescript.configs['flat/disable-type-checked'],
  },

  // Demo/showcase pages legitimately nest deep and run long — the structural
  // budgets are meant for the reusable layer components, not kitchen-sink demos.
  {
    files: ['apps/*/app/**/*.vue'],
    rules: {
      'vue/max-template-depth': 'off',
      'vue/max-lines-per-block': 'off',
    },
  },

  // Render-function component — needs real `cloneVNode`/`Fragment` imports,
  // which Nuxt does not auto-import.
  {
    files: ['layers/navigation/app/components/Links/Group.vue'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },

  // Module augmentation (`declare module`) only works through interface merging —
  // converting these to `type` aliases silently breaks AppConfig/RuntimeConfig and
  // Nuxt Content collection typing. Keep `interface` allowed in the files that
  // augment external modules.
  {
    files: ['**/*.d.ts', '**/app.config.ts', '**/types/runtime-config.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  }
)
