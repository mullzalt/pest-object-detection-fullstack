import { logger } from "@hama/logger";

export const appLogger = (message: string, ...rest: string[]) => {
  logger.info(message, ...rest);
};
