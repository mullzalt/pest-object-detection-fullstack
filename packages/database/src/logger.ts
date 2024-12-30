import { type Logger as DrizzleLogger } from "drizzle-orm";
import { logger as pinoLogger } from "@hama/logger";

class DBLogger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    pinoLogger.debug({ params: params.join(", ") }, query);
  }
}

export const logger = new DBLogger();
