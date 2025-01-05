import { reports } from "@hama/database/schemas";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const insertReportSchema = createInsertSchema(reports);

export const createReportSchema = insertReportSchema.pick({
  userId: true,
});

export type CreateReport = z.infer<typeof createReportSchema>;
