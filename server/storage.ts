import {
  users,
  conversions,
  type User,
  type UpsertUser,
  type Conversion,
  type InsertConversion,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Conversion operations
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getUserConversions(userId: string): Promise<Conversion[]>;
  getConversionById(id: string): Promise<Conversion | undefined>;
  updateConversionStatus(
    id: string,
    status: string,
    convertedFileName?: string,
    errorMessage?: string,
    r2Key?: string,
    r2Url?: string,
    storageType?: string
  ): Promise<Conversion>;
  getConversionStats(userId: string): Promise<{
    totalConversions: number;
    completedConversions: number;
    todayConversions: number;
  }>;

  // New methods for custom auth and subscriptions
  createUser(user: {
    email: string;
    password?: string;
    googleId?: string;
    firstName?: string;
    lastName?: string;
    authProvider: string;
  }): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  updateUserSubscription(userId: string, data: {
    subscriptionPlan: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
  }): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    // If user has an id, try to find and update existing user
    if (user.id) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (existingUser) {
        const [updatedUser] = await db
          .update(users)
          .set({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
          })
          .where(eq(users.id, user.id))
          .returning();
        return updatedUser;
      }
    }

    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Conversion operations
  async createConversion(conversionData: InsertConversion): Promise<Conversion> {
    const [conversion] = await db
      .insert(conversions)
      .values(conversionData)
      .returning();
    return conversion;
  }

  async getUserConversions(userId: string): Promise<Conversion[]> {
    return await db
      .select()
      .from(conversions)
      .where(eq(conversions.userId, userId))
      .orderBy(desc(conversions.createdAt));
  }

  async getConversionById(id: string): Promise<Conversion | undefined> {
    const [conversion] = await db
      .select()
      .from(conversions)
      .where(eq(conversions.id, id));
    return conversion;
  }

  async updateConversionStatus(
    id: string,
    status: string,
    convertedFileName?: string,
    errorMessage?: string,
    r2Key?: string,
    r2Url?: string,
    storageType?: string
  ): Promise<Conversion> {
    const [conversion] = await db
      .update(conversions)
      .set({
        status,
        convertedFileName,
        errorMessage,
        r2Key,
        r2Url,
        storageType,
        updatedAt: new Date(),
      })
      .where(eq(conversions.id, id))
      .returning();
    return conversion;
  }

  async getConversionStats(userId: string): Promise<{
    totalConversions: number;
    completedConversions: number;
    todayConversions: number;
  }> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [stats] = await db
      .select({
        totalConversions: sql<number>`count(*)::int`,
        completedConversions: sql<number>`count(*) filter (where status = 'completed')::int`,
        todayConversions: sql<number>`count(*) filter (where created_at >= ${oneDayAgo})::int`,
      })
      .from(conversions)
      .where(eq(conversions.userId, userId));

    return stats || { totalConversions: 0, completedConversions: 0, todayConversions: 0 };
  }

  // New methods for custom auth and subscriptions
  async createUser(user: {
    email: string;
    password?: string;
    googleId?: string;
    firstName?: string;
    lastName?: string;
    authProvider: string;
  }): Promise<User> {
    const id = crypto.randomUUID();
    const [newUser] = await db.insert(users).values({ id, ...user }).returning();
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);
    return user;
  }

  async updateUserSubscription(userId: string, data: {
    subscriptionPlan: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
  }): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();