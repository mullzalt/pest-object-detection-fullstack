import { env } from "@hama/config";
import { app } from "./app";
import { logger } from "@hama/logger";

const server = Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
});

logger.info(`Server is running on ${server.url.origin}, env: ${env.NODE_ENV}`);

process.on("SIGINT", async () => {
  server.stop(true);
  logger.info("Exiting...");
  process.exit(0);
});
