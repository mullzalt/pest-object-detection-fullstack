import {
  createFetcher,
  apiClient,
  type InferResponseType,
  createGetFetcher,
} from "@hama/server/client";
import { queryOptions } from "@tanstack/react-query";

export const getReports = createFetcher(apiClient.reports.$get);
export const getReportById = createGetFetcher(
  apiClient.reports[":reportId"].$get,
);

export const createReport = createFetcher(apiClient.reports.$post);

export const createReportDetail = createFetcher(
  apiClient.reports[":reportId"].details.$post,
);

export const getReportStats = createFetcher(apiClient.reports.statistics.$get);

export const uploadReportImage = createFetcher(
  apiClient.reports[":reportId"].details[":detailId"].image.$post,
);

export const getReportDetails = createFetcher(
  apiClient.reports[":reportId"].details.$get,
);

export const getReportDetailById = createGetFetcher(
  apiClient.reports[":reportId"].details[":detailId"].$get,
);

export const reportsQueryOptions = () =>
  queryOptions({
    queryKey: ["reports"],
    queryFn: () => getReports({}),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: ["reports", "stats"],
    queryFn: () => getReportStats({}),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const reportByIdQueryOptions = ({ reportId }: { reportId: string }) =>
  queryOptions({
    queryKey: ["reports", { reportId }],
    queryFn: () => getReportById({ param: { reportId } }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const reportDetailsQueryOptions = ({ reportId }: { reportId: string }) =>
  queryOptions({
    queryKey: ["reports", { reportId }, "details"],
    queryFn: () => getReportDetails({ param: { reportId } }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const reportDetailByIdQueryOptions = ({
  reportId,
  detailId,
}: {
  reportId: string;
  detailId: string;
}) =>
  queryOptions({
    queryKey: ["reports", { reportId }, "details", { detailId }],
    queryFn: () => getReportDetailById({ param: { reportId, detailId } }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
