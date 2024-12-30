import { env } from "./env";

export const config = {
  server: {
    port: env.PORT,
    url: env.BASE_URL,
  },
  logger: {
    level: env.LOG_LEVEL,
  },
  database: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    name: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    url: env.DATABASE_URL,
  },
};
