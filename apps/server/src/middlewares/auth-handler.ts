import { createMiddleware } from "hono/factory";
import type { LuciaContext } from "../lib/lucia-context";
import { UnauthorizedError } from "../utils/http-error";

export const verifySignedIn = () =>
  createMiddleware<LuciaContext>(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      throw new UnauthorizedError();
    }

    await next();
  });
