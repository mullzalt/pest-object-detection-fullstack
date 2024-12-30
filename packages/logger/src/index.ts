import { env } from "@hama/config";
import pino from "pino";
import { PinoPretty } from "pino-pretty";

const stream =
  env.NODE_ENV === "production"
    ? undefined
    : PinoPretty({
        colorize: true,
      });

export const logger = pino(
  {
    level: env.LOG_LEVEL || "info",
  },
  stream,
);
