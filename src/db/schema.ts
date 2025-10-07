/**
 * Database schema definitions using Drizzle ORM
 *
 * @fileoverview Defines PostgreSQL table schemas for clients and projects.
 * Uses Drizzle ORM's type-safe schema builder with full TypeScript inference.
 *
 * @module db/schema
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  index,
} from 'drizzle-orm/pg-core';

/**
 * Clients table schema
 *
 * Stores client/customer information with multi-tenant isolation,
 * soft delete support, and optimistic locking for concurrent updates.
 *
 * Indexes:
 * - idx_clients_org_id: Fast lookup by organization
 * - idx_clients_org_deleted: Filtered index for active clients only
 * - idx_clients_version: Optimistic locking version checks
 */
export const clients = pgTable(
  'clients',
  {
    // Primary Key
    id: uuid('id').primaryKey().defaultRandom(),

    // Multi-tenant Isolation
    organizationId: varchar('organization_id', { length: 255 }).notNull(),

    // Core Attributes
    companyName: varchar('company_name', { length: 200 }).notNull(),
    contactPerson: varchar('contact_person', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),

    // Optional Attributes
    address: varchar('address', { length: 500 }),
    notes: text('notes'),

    // Optimistic Locking
    version: integer('version').notNull().default(1),

    // Soft Delete Support
    deletedAt: timestamp('deleted_at', { withTimezone: true }),

    // Audit Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Index for organization-based queries
    orgIdIdx: index('idx_clients_org_id').on(table.organizationId),

    // Partial index for active clients only (deleted_at IS NULL)
    // Note: Drizzle doesn't support WHERE clause in indexes yet,
    // so this will need to be added manually in migration
    orgDeletedIdx: index('idx_clients_org_deleted').on(
      table.organizationId,
      table.deletedAt
    ),

    // Index for optimistic locking checks
    versionIdx: index('idx_clients_version').on(table.id, table.version),
  })
);

/**
 * Projects table schema
 *
 * Stores project information with client relationships, status tracking,
 * multi-tenant isolation, and optimistic locking.
 *
 * Foreign Keys:
 * - clientId references clients(id) ON DELETE SET NULL
 *
 * Indexes:
 * - idx_projects_org_id: Fast lookup by organization
 * - idx_projects_client_id: Fast lookup by client
 * - idx_projects_status: Status-based filtering
 * - idx_projects_dates: Date range queries
 * - idx_projects_version: Optimistic locking version checks
 */
export const projects = pgTable(
  'projects',
  {
    // Primary Key
    id: uuid('id').primaryKey().defaultRandom(),

    // Multi-tenant Isolation
    organizationId: varchar('organization_id', { length: 255 }).notNull(),

    // Core Attributes
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),

    // Foreign Key Relationship
    // ON DELETE SET NULL: When client is soft-deleted, project.clientId becomes NULL
    clientId: uuid('client_id').references(() => clients.id, {
      onDelete: 'set null',
    }),

    // Status & Lifecycle
    status: varchar('status', { length: 50 }).notNull().default('Planning'),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }),

    // Financial (Optional)
    // Stored in cents (smallest currency unit) to avoid floating point issues
    budget: integer('budget'),

    // Additional Details
    notes: text('notes'),

    // Optimistic Locking
    version: integer('version').notNull().default(1),

    // Audit Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Index for organization-based queries
    orgIdIdx: index('idx_projects_org_id').on(table.organizationId),

    // Index for client-based queries
    clientIdIdx: index('idx_projects_client_id').on(table.clientId),

    // Composite index for status filtering within organization
    statusIdx: index('idx_projects_status').on(
      table.organizationId,
      table.status
    ),

    // Composite index for date range queries
    datesIdx: index('idx_projects_dates').on(
      table.organizationId,
      table.startDate,
      table.endDate
    ),

    // Index for optimistic locking checks
    versionIdx: index('idx_projects_version').on(table.id, table.version),
  })
);

/**
 * Inferred types from Drizzle schema
 */
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
