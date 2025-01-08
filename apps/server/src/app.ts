import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import type { LuciaContext } from "./lib/lucia-context";
import { appLogger } from "./lib/logger";
import { sessionHandler } from "./middlewares/session-hanler";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { apiRoute } from "./routes";

const app = new Hono<LuciaContext>();

app.use(logger(appLogger));
app.use(trimTrailingSlash());

app.use("*", cors(), sessionHandler());

const appRoute = app.basePath("/api").route("/", apiRoute);

app.onError(errorHandler());
app.notFound(notFoundHandler());

app.use("/static/*", serveStatic({ root: "./" }));

export { app, appRoute };
