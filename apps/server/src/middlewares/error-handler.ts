import type { ResponseError } from "@hama/types";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler =
  <TCtx extends Context>() =>
  (error: Error | HTTPException, c: TCtx) => {
    const isProduction = process.env.NODE_ENV === "production";

    if (error instanceof HTTPException && error.res) {
      return error.res;
    }

    if (error instanceof HTTPException) {
      return c.json<ResponseError>(
        {
          success: false,
          error: {
            message: error.message,
            cause: error?.cause,
          },
        },
        error.status,
      );
    }

    return c.json<ResponseError>(
      {
        success: false,
        error: {
          message: error.message,
          cause: error?.cause,
          stack: isProduction ? undefined : error.stack,
        },
      },
      500,
    );
  };

export const notFoundHandler =
  <TCtx extends Context>() =>
  (c: TCtx) => {
    const path = c.req.path;
    return c.json<ResponseError>(
      {
        success: false,
        error: {
          message: `Route "${path}" does not exist`,
        },
      },
      404,
    );
  };
