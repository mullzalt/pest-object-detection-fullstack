import { ListComponent } from "@/components/list-component";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { dateStringToLocale, dateStringToLocaleShort } from "@/lib/utils";
import { reportsQueryOptions } from "@/queries/reports";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/reports/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(reportsQueryOptions());
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(reportsQueryOptions());
  return (
    <div className="grid gap-4">
      <ListComponent
        renderOnEmpty={() => (
          <div className="text-xl text-muted-foreground h-40 flex items-center justify-center">
            No Recording data
          </div>
        )}
        data={data.data}
        render={(report) => (
          <Link to="/reports/$reportId" params={{ reportId: report.id }}>
            <Card>
              <CardHeader>
                <CardDescription>Hasil Rekaman</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge variant={"outline"} className="text-md px-4 py-4">
                    {dateStringToLocaleShort(report.createdAt)}
                  </Badge>
                  s/d
                  <Badge variant={"outline"} className="text-md px-4 py-4">
                    {dateStringToLocaleShort(report.updatedAt)}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </Link>
        )}
      />
    </div>
  );
}
