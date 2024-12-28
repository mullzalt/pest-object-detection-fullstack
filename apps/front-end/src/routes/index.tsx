import { createFileRoute } from "@tanstack/react-router";
import { DetectionCamera } from "@/components/detection/webcam";
import { DetectionProvider } from "@/hooks/use-detection";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <DetectionProvider>
        <DetectionCamera />
      </DetectionProvider>
    </div>
  );
}
