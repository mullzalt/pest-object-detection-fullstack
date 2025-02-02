import { db } from "@hama/database";
import type { Detection } from "@hama/types";

type ReportDetail = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  reportId: string;
  image: string;
  detections: Detection[];
};

type TransformedReport = {
  time: number;
  class: number;
  name: string;
  confidence: number;
};

const transformReport = (details: ReportDetail[]): TransformedReport[] => {
  return details.flatMap((d) =>
    d.detections.map((e) => ({
      class: e.class,
      name: e.name,
      confidence: Number((e.confidence * 100).toFixed(2)),
      time: d.createdAt.getTime(),
    })),
  );
};

const getLabelOccurrance = (
  results: TransformedReport[],
): Record<string, number> =>
  results.reduce(
    (acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

type GroupedReport = Record<string, { confidence: number; time: number }[]>;

const groupByLabel = (results: TransformedReport[]): GroupedReport =>
  results.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = [];
    acc[item.name].push({ time: item.time, confidence: item.confidence });
    return acc;
  }, {} as GroupedReport);

export const statsService = () => {
  const getReportStats = async () => {
    const results = await db.query.reportDetails
      .findMany()
      .then((res) => transformReport(res));

    const occurs = getLabelOccurrance(results);

    const times = results.map((r) => r.time);

    const time = {
      min: Math.min(...times),
      max: Math.max(...times),
    };

    const data = groupByLabel(results);

    return { data, metadata: { occurs, time } };
  };

  return { getReportStats };
};
