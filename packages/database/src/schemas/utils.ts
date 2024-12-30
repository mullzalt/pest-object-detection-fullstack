import { timestamp, uuid } from "drizzle-orm/pg-core";

export const createdAt = timestamp("created_at", {
  withTimezone: true,
  mode: "date",
})
  .defaultNow()
  .notNull();

export const updatedAt = timestamp("updated_at", {
  withTimezone: true,
  mode: "date",
})
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull();

export const deletedAt = timestamp("deletedAt", {
  withTimezone: true,
  mode: "date",
});

export const id = uuid("id").defaultRandom().primaryKey();
