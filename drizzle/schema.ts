import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

export const communityPhotos = mysqlTable("community_photos", {
  id: int("id").autoincrement().primaryKey(),
  riderName: varchar("riderName", { length: 128 }).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR"]).notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  venue: varchar("venue", { length: 256 }),
  mootsModel: varchar("mootsModel", { length: 128 }),
  caption: text("caption"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: text("imageKey").notNull(),
  approved: mysqlEnum("approved", ["pending", "approved", "rejected"]).default("pending").notNull(),
  /** JSON-encoded array of tag slugs (e.g. ["gravel","coffee","sunrise"]). Nullable to preserve existing rows. */
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityPhoto = typeof communityPhotos.$inferSelect;
export type InsertCommunityPhoto = typeof communityPhotos.$inferInsert;

export const eventRsvps = mysqlTable("event_rsvps", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  eventTitle: varchar("eventTitle", { length: 256 }).notNull(),
  eventDate: varchar("eventDate", { length: 32 }).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR"]).notNull(),
  riderName: varchar("riderName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventRsvp = typeof eventRsvps.$inferSelect;
export type InsertEventRsvp = typeof eventRsvps.$inferInsert;

export const configuratorLeads = mysqlTable("configurator_leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR"]).notNull(),
  useCase: varchar("useCase", { length: 64 }).notNull(),
  terrain: varchar("terrain", { length: 64 }).notNull(),
  budget: varchar("budget", { length: 32 }).notNull(),
  recommendedModel: varchar("recommendedModel", { length: 128 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConfiguratorLead = typeof configuratorLeads.$inferSelect;
export type InsertConfiguratorLead = typeof configuratorLeads.$inferInsert;

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  riderName: varchar("riderName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR"]).notNull(),
  popUpCity: varchar("popUpCity", { length: 128 }),
  popUpVenue: varchar("popUpVenue", { length: 256 }),
  popUpDate: varchar("popUpDate", { length: 32 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR"]),
  source: varchar("source", { length: 64 }),
  unsubscribedAt: timestamp("unsubscribedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["rsvp", "booking", "upload", "lead"]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  message: text("message").notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH", "ALL"]).default("ALL").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  emailNotifications: tinyint("emailNotifications").default(1).notNull(),
  inAppNotifications: tinyint("inAppNotifications").default(1).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH", "ALL"]).default("ALL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
