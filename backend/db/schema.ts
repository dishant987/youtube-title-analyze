import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  youtubeId: varchar("youtube_id", { length: 64 }).notNull(),
  channelId: varchar("channel_id", { length: 64 }).notNull(),
  originalTitle: text("original_title").notNull(),
  newTitle: text("new_title").notNull(),
  reason: text("reason").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
