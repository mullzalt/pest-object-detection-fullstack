import { env } from "@hama/config";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "@hama/database";
import type { User } from "@hama/data-access";
import { users, userSessions } from "@hama/database/schemas";

const adapter = new DrizzlePostgreSQLAdapter(db, userSessions, users);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => attributes,
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}

export { lucia };
