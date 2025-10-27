import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (Replit Auth integration - required)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (Replit Auth integration - required)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: varchar("password"), // For email/password auth
  googleId: varchar("google_id").unique(), // For Google OAuth
  authProvider: varchar("auth_provider"), // 'email', 'google', or 'replit'
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionPlan: varchar("subscription_plan").default('free'), // 'free', 'pro', 'enterprise'
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status"), // 'active', 'cancelled', 'past_due'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Conversions table - tracks all document-to-PDF conversion jobs
export const conversions = pgTable("conversions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  originalFileName: varchar("original_file_name").notNull(),
  convertedFileName: varchar("converted_file_name"),
  fileSize: integer("file_size").notNull(), // in bytes
  status: varchar("status", { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
  errorMessage: varchar("error_message"),
  r2Key: varchar("r2_key"), // Cloudflare R2 storage key for the converted PDF
  r2Url: varchar("r2_url"), // Public URL if available
  storageType: varchar("storage_type").default('local'), // 'local' or 'r2'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversions: many(conversions),
}));

export const conversionsRelations = relations(conversions, ({ one }) => ({
  user: one(users, {
    fields: [conversions.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertConversionSchema = createInsertSchema(conversions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// TypeScript types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Conversion = typeof conversions.$inferSelect;
export type InsertConversion = z.infer<typeof insertConversionSchema>;