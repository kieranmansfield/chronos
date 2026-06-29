import { pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import type { ReadingOrderBlock } from '@chronos/engine'

export const visibilityEnum = pgEnum('visibility', ['private', 'unlisted', 'public'])
export const progressStatusEnum = pgEnum('progress_status', ['unread', 'in-progress', 'completed'])

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  franchiseId: text('franchise_id').notNull(),
  title: text('title').notNull(),
  blocks: text('blocks').notNull().$type<ReadingOrderBlock[]>(),
  visibility: visibilityEnum('visibility').notNull().default('private'),
  forkedFromId: text('forked_from_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const progress = pgTable(
  'progress',
  {
    userId: text('user_id').notNull().references(() => users.id),
    targetId: text('target_id').notNull(),
    status: progressStatusEnum('status').notNull().default('unread'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.targetId] })],
)

export const ownedEditions = pgTable(
  'owned_editions',
  {
    userId: text('user_id').notNull().references(() => users.id),
    workId: text('work_id').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.workId] })],
)
