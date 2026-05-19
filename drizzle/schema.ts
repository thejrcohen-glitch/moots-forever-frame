import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

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
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH"]).notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  venue: varchar("venue", { length: 256 }),
  mootsModel: varchar("mootsModel", { length: 128 }),
  caption: text("caption"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: text("imageKey").notNull(),
  approved: mysqlEnum("approved", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityPhoto = typeof communityPhotos.$inferSelect;
export type InsertCommunityPhoto = typeof communityPhotos.$inferInsert;

export const eventRsvps = mysqlTable("event_rsvps", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  eventTitle: varchar("eventTitle", { length: 256 }).notNull(),
  eventDate: varchar("eventDate", { length: 32 }).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH"]).notNull(),
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
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH"]).notNull(),
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
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH"]).notNull(),
  popUpDate: varchar("popUpDate", { length: 32 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["rsvp", "booking", "community_upload", "lead", "admin_message", "event_reminder", "dealer_announcement"]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  message: text("message").notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "ALL"]).default("ALL").notNull(),
  relatedId: int("relatedId"), // ID of related RSVP, booking, lead, etc.
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailNotifications: tinyint("emailNotifications").default(1).notNull(),
  inAppNotifications: tinyint("inAppNotifications").default(1).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "ALL"]).default("ALL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;


// ============================================================================
// PHASE 1: SWITZERLAND EXPANSION & COMMUNITY FEATURES
// ============================================================================

// Routes table: Swiss gravel routes with verification-ready fields
export const routes = mysqlTable("routes", {
  id: int("id").autoincrement().primaryKey(),
  routeId: varchar("routeId", { length: 50 }).unique().notNull(), // e.g., "CH_TREMOLA"
  name: varchar("name", { length: 256 }).notNull(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH"]).notNull(),
  region: varchar("region", { length: 256 }).notNull(),
  
  // Factual fields (verified before publishing)
  distanceKm: varchar("distanceKm", { length: 32 }),
  elevationGainM: varchar("elevationGainM", { length: 32 }),
  terrainType: varchar("terrainType", { length: 256 }),
  gpxSourceUrl: text("gpxSourceUrl"),
  
  // Editorial copy (separate from facts for verification)
  description: text("description"),
  mootsInsiderTip: text("mootsInsiderTip"),
  
  // Verification fields for Phase 2
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "verified", "disputed"]).default("unverified").notNull(),
  verifiedBy: varchar("verifiedBy", { length: 128 }),
  verifiedAt: timestamp("verifiedAt"),
  verificationNotes: text("verificationNotes"),
  
  // Source tracking
  sourceUrl: text("sourceUrl"),
  sourceAttribution: varchar("sourceAttribution", { length: 256 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

// Testimonials table: Dealer quotes and feedback
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  dealerName: varchar("dealerName", { length: 256 }).notNull(),
  company: varchar("company", { length: 256 }),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH"]).notNull(),
  quote: text("quote").notNull(),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  featured: tinyint("featured").default(0).notNull(),
  displayOrder: varchar("displayOrder", { length: 32 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Newsletter subscribers table: Email capture
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  territory: mysqlEnum("territory", ["TX", "OK", "AR", "CH", "ALL"]).default("ALL").notNull(),
  subscribed: tinyint("subscribed").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Bike models table: Official Moots framesets
export const bikeModels = mysqlTable("bike_models", {
  id: int("id").autoincrement().primaryKey(),
  modelId: varchar("modelId", { length: 50 }).unique().notNull(), // e.g., "routt_45"
  name: varchar("name", { length: 256 }).notNull(), // e.g., "Routt 45"
  category: mysqlEnum("category", ["gravel", "adventure", "legacy"]).notNull(),
  
  // Specs
  description: text("description"),
  useCase: varchar("useCase", { length: 256 }),
  terrainFocus: varchar("terrainFocus", { length: 256 }),
  keyFeatures: text("keyFeatures"), // JSON array or pipe-separated
  
  // Pricing & availability
  priceUsd: varchar("priceUsd", { length: 32 }),
  
  // Media
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BikeModel = typeof bikeModels.$inferSelect;
export type InsertBikeModel = typeof bikeModels.$inferInsert;

// Photo tags table: Many-to-many tagging system
export const photoTags = mysqlTable("photo_tags", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photoId").notNull().references(() => communityPhotos.id, { onDelete: "cascade" }),
  tagName: varchar("tagName", { length: 100 }).notNull(), // e.g., "pass_sign_2000m", "bikepacking", "titanium_vs_texture"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhotoTag = typeof photoTags.$inferSelect;
export type InsertPhotoTag = typeof photoTags.$inferInsert;

// Add routeId to community_photos for event gallery linking
// This is a schema extension, applied via migration
