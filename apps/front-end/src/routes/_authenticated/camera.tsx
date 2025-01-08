import * as React from "react";
import { DetectionCamera } from "@/components/detection/webcam";
import { useDetection } from "@/hooks/use-detection";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReport,
  createReportDetail,
  uploadReportImage,
} from "@/queries/reports";
import { toast } from "sonner";
import type { Detection } from "@hama/types";

export const Route = createFileRoute("/_authenticated/camera")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setIsRecording, currentId, setCurrentId } = useDetection();

  const queryClient = useQueryClient();

  const { mutateAsync: startRecord, isPending: isLoading } = useMutation({
    mutationFn: createReport,
    onSuccess: (res) => {
      setIsRecording(true);
      toast.info("Starting new recording session...");
      setCurrentId(res.data.id);
    },
    onError: (err) => {
      setIsRecording(false);
      toast.error("Failed to start recording: " + err.message);
      setCurrentId(undefined);
    },
  });

  const { mutateAsync: saveDetection } = useMutation({
    mutationFn: createReportDetail,
  });

  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: uploadReportImage,
    onSuccess: () => {
      toast.info("New object captured");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
        refetchType: "active",
        exact: false,
      });
    },
  });

  const handleCapture = React.useCallback(
    async (detections: Detection[], file: File) => {
      if (!currentId) return;
      const reportId = currentId;
      const reportDetail = await saveDetection({
        param: { reportId },
        json: {
          detections,
        },
      });

      const detailId = reportDetail.data.id;

      await uploadFile({
        param: { reportId, detailId },
        form: { image: file },
      });
    },
    [currentId],
  );

  const handleStartRecording = React.useCallback(async () => {
    await startRecord({});
  }, [setIsRecording]);

  const handleStopRecording = React.useCallback(() => {
    setIsRecording(false);
    setCurrentId(undefined);
    toast.info("recording session stoped.");
  }, [setIsRecording]);

  return (
    <DetectionCamera
      onCapture={handleCapture}
      onRecordStart={handleStartRecording}
      onRecordStop={handleStopRecording}
      isLoading={isLoading}
    />
  );
}
