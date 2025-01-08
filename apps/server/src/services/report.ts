import { db } from "@hama/database";
import { reportDetails, reports } from "@hama/database/schemas";
import { makeDrizzlePgHelper } from "@hama/database/util";
import type { Detection } from "@hama/types";
import { writeFile } from "../lib/file-upload";
import { NotFoundError } from "../utils/http-error";

export const reportService = () => {
  const createReport = async (userId: string) => {
    const [data] = await db.insert(reports).values({ userId }).returning();

    return { data };
  };

  const updateReport = async (id: string) => {
    const { where } = makeDrizzlePgHelper(reports);
    const [data] = await db
      .update(reports)
      .set({ updatedAt: new Date() })
      .where(where((col, { eq }) => eq(col.id, id)))
      .returning();

    return { data };
  };

  const addReportDetail = async ({
    reportId,
    detections,
  }: {
    reportId: string;
    detections: Detection[];
  }) => {
    const [data] = await db
      .insert(reportDetails)
      .values({
        reportId,
        detections,
        image: "",
      })
      .returning();

    return { data };
  };

  const addReportImage = async ({ id, image }: { id: string; image: File }) => {
    const { where } = makeDrizzlePgHelper(reportDetails);

    const { url } = await writeFile(image);

    const [data] = await db
      .update(reportDetails)
      .set({ image: url })
      .where(where((col, { eq }) => eq(col.id, id)))
      .returning();

    return { data };
  };

  const getReports = async (userId: string) => {
    const data = await db.query.reports.findMany({
      where: (col, { eq }) => eq(col.userId, userId),
      orderBy: (col, { desc }) => desc(col.createdAt),
    });

    return { data };
  };

  const getReportById = async (id: string) => {
    const data = await db.query.reports.findFirst({
      where: (col, { eq }) => eq(col.id, id),
    });

    if (!data) throw new NotFoundError("Report not found");

    return { data };
  };

  const getReportDetails = async (reportId: string) => {
    const data = await db.query.reportDetails.findMany({
      where: (col, { eq }) => eq(col.reportId, reportId),
      orderBy: (col, { desc }) => desc(col.createdAt),
    });

    return { data };
  };

  const getReportDetailById = async (id: string) => {
    const data = await db.query.reportDetails.findFirst({
      where: (col, { eq }) => eq(col.id, id),
    });

    if (!data) throw new NotFoundError("Report Detail not found");

    return { data };
  };

  return {
    createReport,
    updateReport,
    addReportDetail,
    addReportImage,
    getReports,
    getReportById,
    getReportDetails,
    getReportDetailById,
  };
};
