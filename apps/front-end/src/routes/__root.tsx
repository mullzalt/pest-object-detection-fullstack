import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <ThemeProvider>
        <Outlet />
        <Toaster />
      </ThemeProvider>
    </>
  );
}
