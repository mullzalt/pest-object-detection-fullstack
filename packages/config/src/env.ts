import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";

import { z } from "zod";

expand(config({ path: path.resolve(__dirname, "../../../.env") }));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().regex(/\d+/, "PORT must be a number").transform(Number),
  LOG_LEVEL: z.enum([
    "warn",
    "info",
    "fatal",
    "error",
    "debug",
    "trace",
    "silent",
  ]),

  BASE_URL: z.string(),

  DATABASE_HOST: z.string(),
  DATABASE_PORT: z
    .string()
    .regex(/\d+/, "DATABASE_PORT be a number")
    .transform(Number),

  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
