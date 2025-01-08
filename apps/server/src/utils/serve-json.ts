import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type ServeJsonOptions<TData, TMetadata, TPagination, TStatus> = {
  message?: string;
  data?: TData;
  metadata?: TMetadata;
  pagination?: TPagination;
  status?: TStatus;
};

export function serveJson<
  TData = never,
  TMetadata = never,
  TPagination = never,
  TStatus extends ContentfulStatusCode = ContentfulStatusCode,
  TCtx extends Context = Context,
>(
  c: TCtx,
  options: ServeJsonOptions<TData, TMetadata, TPagination, TStatus> = {},
) {
  const { message = "OK", status = 200, data, metadata, pagination } = options;
  return c.json(
    {
      message,
      success: true,
      data: data!,
      metadata: metadata!,
      pagination: pagination!,
    },
    status,
  );
}
