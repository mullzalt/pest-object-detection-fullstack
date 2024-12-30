import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./utils";
import type { Detection } from "@hama/types";
import { reports } from "./reports";

export const reportDetails = pgTable("report_details", {
  id,
  reportId: uuid("report_id")
    .references(() => reports.id)
    .notNull(),
  image: text("image").notNull(),
  detections: jsonb("detections").$type<Detection[]>().default([]).notNull(),
  createdAt,
  updatedAt,
});
