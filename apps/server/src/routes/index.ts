import { Hono } from "hono";
import type { LuciaContext } from "../lib/lucia-context";
import { serveJson } from "../utils/serve-json";
import { verifySignedIn } from "../middlewares/auth-handler";
import { zValidator } from "@hono/zod-validator";
import {
  createReportDetailSchema,
  signInSchema,
  signUpSchema,
  uploadImageSchema,
} from "@hama/data-access";
import { authService } from "../services/auth";
import { reportService } from "../services/report";

const apiRoute = new Hono<LuciaContext>()
  .post("/auth/sign-in", zValidator("json", signInSchema), async (c) => {
    const value = c.req.valid("json");
    await authService(c).signIn(value);
    return serveJson(c);
  })
  .post("/auth/sign-up", zValidator("json", signUpSchema), async (c) => {
    const value = c.req.valid("json");
    await authService(c).signUp(value);
    return serveJson(c);
  })
  .get("/auth/sign-out", verifySignedIn(), async (c) => {
    await authService(c).signOut();
    return serveJson(c);
  })
  .get("/auth/info", verifySignedIn(), async (c) => {
    const { passwordHashed, ...data } = c.get("user")!;
    return serveJson(c, { data });
  })
  .get("/reports", verifySignedIn(), async (c) => {
    const user = c.get("user")!;
    const { data } = await reportService().getReports(user.id);
    return serveJson(c, { data });
  })
  .post("/reports", verifySignedIn(), async (c) => {
    const user = c.get("user")!;
    const { data } = await reportService().createReport(user.id);
    return serveJson(c, { data });
  })
  .get("/reports/:reportId", verifySignedIn(), async (c) => {
    const { reportId } = c.req.param();
    const { data } = await reportService().getReportById(reportId);
    return serveJson(c, { data });
  })
  .get("/reports/:reportId/details", verifySignedIn(), async (c) => {
    const { reportId } = c.req.param();
    const { data } = await reportService().getReportDetails(reportId);
    return serveJson(c, { data });
  })
  .post(
    "/reports/:reportId/details",
    verifySignedIn(),
    zValidator("json", createReportDetailSchema),
    async (c) => {
      const { reportId } = c.req.param();
      const { detections } = c.req.valid("json");
      const { data } = await reportService().addReportDetail({
        reportId,
        detections,
      });
      await reportService().updateReport(reportId);
      return serveJson(c, { data });
    },
  )
  .get("/reports/:reportId/details/:detailId", verifySignedIn(), async (c) => {
    const { detailId } = c.req.param();
    const { data } = await reportService().getReportDetailById(detailId);
    return serveJson(c, { data });
  })
  .post(
    "/reports/:reportId/details/:detailId/image",
    verifySignedIn(),
    zValidator("form", uploadImageSchema),
    async (c) => {
      const { detailId, reportId } = c.req.param();
      const { image } = c.req.valid("form");
      const { data } = await reportService().addReportImage({
        id: detailId,
        image,
      });
      await reportService().updateReport(reportId);
      return serveJson(c, { data });
    },
  );

export { apiRoute };
