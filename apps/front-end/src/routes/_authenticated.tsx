import { Navbar } from "@/components/navbar";
import { DetectionProvider } from "@/hooks/use-detection";
import { validateSession } from "@/queries/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await validateSession(context.queryClient);

    if (!user)
      throw redirect({
        to: "/sign-in",
      });
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="container p-0 md:p-4">
        <DetectionProvider>
          <Outlet />
        </DetectionProvider>
      </main>
    </div>
  );
}
