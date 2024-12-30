import { relations } from "drizzle-orm";
import { users } from "./users";
import { reports } from "./reports";
import { reportDetails } from "./report-details";

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ many, one }) => ({
  details: many(reportDetails),
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));
