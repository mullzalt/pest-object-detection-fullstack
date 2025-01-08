import {
  createFetcher,
  apiClient,
  type InferResponseType,
} from "@hama/server/client";
import { queryOptions, type QueryClient } from "@tanstack/react-query";

export const signIn = createFetcher(apiClient.auth["sign-in"].$post);
export const signUp = createFetcher(apiClient.auth["sign-up"].$post);
export const signOut = createFetcher(apiClient.auth["sign-out"].$get);

export const getSessionInfo = async () => {
  const res = await apiClient.auth.info.$get();
  if (!res.ok) {
    return null;
  }
  const { data } = await res.json();
  return data;
};

export const userSessionQueryOptions = () =>
  queryOptions({
    queryKey: ["session"],
    queryFn: getSessionInfo,
    staleTime: 2 * 7 * 24 * 60 * 1000, // 2 week
  });

export async function validateSession(queryClient: QueryClient) {
  const user = await queryClient.ensureQueryData(userSessionQueryOptions());
  return user;
}

export type SessionUser = InferResponseType<
  (typeof apiClient.auth.info)["$get"]
>["data"];
