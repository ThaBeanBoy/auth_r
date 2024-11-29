// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

function generateKey(length = 24) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const createTable = pgTableCreator((name) => `auth_r_${name}`);

export const apps = createTable("application", {
  ID: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  ownerID: varchar("owner_id").references((): AnyPgColumn => users.ID),
  name: varchar("name", { length: 256 }).notNull(),
  publicKey: varchar("public_key")
    .notNull()
    .unique()
    .$defaultFn(() => generateKey()),
  privateKey: varchar("private_key")
    .notNull()
    .unique()
    .$defaultFn(() => generateKey()),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const appsRelations = relations(apps, ({ many, one }) => ({
  users: many(users),
  owner: one(users, {
    fields: [apps.ownerID],
    references: [users.ID],
  }),
}));

export const users = createTable("user", {
  ID: varchar("user_id")
    .primaryKey()
    .$defaultFn(() => generateKey()),
  appID: integer("app_id")
    .notNull()
    .references((): AnyPgColumn => apps.ID),
  email: varchar("email"),
  password: varchar("password"),
  name: varchar("name"),
  surname: varchar("surname"),
  profilePicture: varchar("profile_picture"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  app: one(apps, {
    fields: [users.appID],
    references: [apps.ID],
  }),
  ownedApps: many(apps),
}));

export const sessions = createTable("session", {
  ID: varchar("ID")
    .primaryKey()
    .$defaultFn(() => generateKey()),
  userID: varchar("user_id")
    .notNull()
    .references((): AnyPgColumn => users.ID),
  expiresAt: timestamp("expires_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userID],
    references: [users.ID],
  }),
}));
