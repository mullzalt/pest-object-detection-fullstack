import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./utils";
import { users } from "./users";

export const reports = pgTable("reports", {
  id,
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt,
  updatedAt,
});
