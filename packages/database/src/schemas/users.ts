import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./utils";

export const users = pgTable("users", {
  id,
  email: text("email").notNull().unique(),
  passwordHashed: text("password_hashed").notNull(),
  createdAt,
  updatedAt,
});
