import { Button } from "@/components/ui/button";
import { validateSession } from "@/queries/auth";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user = await validateSession(context.queryClient);

    if (!user)
      throw redirect({
        to: "/sign-in",
      });

    return { user };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  return (
    <div className="flex min-h-[80vh] flex-col gap-8 p-4">
      <div className="text-lg text-muted-foreground">
        Selamat datang kembali,{" "}
        <span className="font-semibold italic">{user.email}</span> !
      </div>
      <div className="flex-1 flex flex-col py-8 gap-8">
        <Button size={"lg"} variant={"secondary"} asChild>
          <Link to="/camera">
            Mulai deteksi <ArrowRightIcon />
          </Link>
        </Button>
        <Button size={"lg"} variant={"secondary"} asChild>
          <Link to="/reports">
            Lihat hasil deteksi <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
