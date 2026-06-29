import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: { url: (process.env.DATABASE_URL_UNPOOLED ?? process.env.NUXT_DATABASE_LAYER_URL)! },
})
