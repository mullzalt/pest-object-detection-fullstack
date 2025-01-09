import { SignUpForm } from "@/components/form/sign-up-form";
import { validateSession } from "@/queries/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const data = await validateSession(context.queryClient);

    if (data) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col relative items-center justify-center">
      <SignUpForm />
    </div>
  );
}
