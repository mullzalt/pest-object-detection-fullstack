import type { ResponseError } from "@hama/types";
import type {
  ClientRequestOptions,
  InferRequestType,
  InferResponseType,
} from "hono/client";

import { hc } from "hono/client";
import { apiRoute } from "../routes";

export const apiClient = hc<typeof apiRoute>("/api");

export function createFetcher<
  TFn extends Function,
  TArgs extends InferRequestType<TFn>,
  TRes extends InferResponseType<TFn>,
>(fn: TFn) {
  return async (args: TArgs, options?: ClientRequestOptions): Promise<TRes> => {
    const res = await fn(args, options);
    if (!res.ok) {
      const { error } = (await res.json()) as unknown as ResponseError;
      throw new Error(error.message);
    }

    return await res.json();
  };
}

export function createGetFetcher<
  TFn extends Function,
  TArgs extends InferRequestType<TFn>,
  TRes extends InferResponseType<TFn>,
>(fn: TFn) {
  return async (
    args: TArgs,
    options?: ClientRequestOptions,
  ): Promise<TRes | (ResponseError & { status: number })> => {
    const res = await fn(args, options);
    if (!res.ok) {
      const error = (await res.json()) as unknown as ResponseError;
      return { ...error, status: res.status };
    }

    return await res.json();
  };
}

export type { InferResponseType, InferRequestType };
