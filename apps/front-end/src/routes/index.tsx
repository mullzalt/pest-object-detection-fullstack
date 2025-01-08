import { createFileRoute, redirect } from "@tanstack/react-router";
import { DetectionCamera } from "@/components/detection/webcam";
import { DetectionProvider } from "@/hooks/use-detection";
import { validateSession } from "@/queries/auth";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad: async ({ context }) => {
    const data = await validateSession(context.queryClient);

    if (!data) {
      throw redirect({ to: "/sign-in" });
    }

    if (data) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function HomeComponent() {
  return <div></div>;
}
