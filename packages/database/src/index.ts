import { config } from "@hama/config";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import * as schema from "./schemas";

import { Pool } from "pg";
import { logger } from "./logger";

export const pool = new Pool({
  connectionString: config.database.url,
});

export type DatabaseSchemas = {
  [K in keyof typeof schema]: (typeof schema)[K];
};

export const db = drizzle<DatabaseSchemas>(pool, {
  schema,
  logger,
});

export type Transaction = PgTransaction<
  PgQueryResultHKT,
  DatabaseSchemas,
  ExtractTablesWithRelations<DatabaseSchemas>
>;

export type Database = typeof db;
