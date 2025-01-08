import { DetectionCamera } from "@/components/detection/webcam";
import { DetectionProvider } from "@/hooks/use-detection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/camera")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DetectionProvider>
      <DetectionCamera />
    </DetectionProvider>
  );
}
