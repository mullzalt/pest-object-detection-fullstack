import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut, type SessionUser } from "@/queries/auth";

interface RouteProps {
  to: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    to: "/camera",
    label: "Deteksi",
  },
  {
    to: "/reports",
    label: "Laporan",
  },
  {
    to: "/statistics",
    label: "Statistik",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryKey = ["session"];

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => await signOut({}),
    onMutate: async () => {
      queryClient.cancelQueries({ queryKey });
      const prevSession = queryClient.getQueryData<SessionUser>(queryKey);
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });

      queryClient.setQueryData(queryKey, () => null);

      return { prevSession };
    },
    onSuccess: async () => {
      await queryClient.resetQueries();
      await navigate({ to: "/sign-in" });
    },
  });
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Link
              rel="noreferrer noopener"
              to="/dashboard"
              className="ml-2 font-bold text-xl flex"
            >
              Deteksi Hama
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Deteksi Hama
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ to, label }: RouteProps) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <Link
                rel="noreferrer noopener"
                to={route.to}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
                activeProps={{
                  className: "bg-muted",
                }}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            {/* <a */}
            {/*   rel="noreferrer noopener" */}
            {/*   href="https://github.com/leoMirandaa/shadcn-landing-page.git" */}
            {/*   target="_blank" */}
            {/*   className={`border ${buttonVariants({ variant: "secondary" })}`} */}
            {/* > */}
            {/*   <GitHubLogoIcon className="mr-2 w-5 h-5" /> */}
            {/*   Github */}
            {/* </a> */}

            <Button
              variant={"secondary"}
              onClick={() => logout()}
              disabled={isPending}
            >
              Sign Out
            </Button>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
