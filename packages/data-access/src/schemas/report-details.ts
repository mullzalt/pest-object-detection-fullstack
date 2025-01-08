import { z } from "zod";
import { fileUpload } from "../utils/file-upload";
import { toByte } from "../utils/byte-size";

const detectionSchema = z.object({
  xmin: z.number(),
  ymin: z.number(),
  xmax: z.number(),
  ymax: z.number(),
  confidence: z.number(),
  class: z.number(),
  name: z.string(),
});

export const createReportDetailSchema = z.object({
  detections: z.array(detectionSchema),
});

export const uploadImageSchema = z.object({
  image: fileUpload({ fileTypes: [".jpeg"], maxByteSize: toByte(500, "KB") }),
});

export type CreateReportDetail = z.infer<typeof createReportDetailSchema>;
