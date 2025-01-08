import { Navbar } from "@/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="container p-0 md:p-4">
        <Outlet />
      </main>
    </div>
  );
}
