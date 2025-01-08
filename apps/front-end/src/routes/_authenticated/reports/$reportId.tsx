import DetectionCanvas from "@/components/detection/image";
import { ListComponent } from "@/components/list-component";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { dateStringToLocale } from "@/lib/utils";
import { reportDetailsQueryOptions } from "@/queries/reports";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock3Icon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports/$reportId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      reportDetailsQueryOptions({ reportId: params.reportId }),
    );
  },
});

function RouteComponent() {
  const { reportId } = Route.useParams();
  const { data } = useSuspenseQuery(reportDetailsQueryOptions({ reportId }));
  return (
    <div>
      <div className="grid gap-4">
        <ListComponent
          renderOnEmpty={() => (
            <div className="text-xl text-muted-foreground h-40 flex items-center justify-center">
              No object captured
            </div>
          )}
          data={data.data}
          render={(detail) => (
            <div className="flex items-center justify-center">
              <Card>
                <CardContent>
                  <DetectionCanvas
                    detections={detail.detections}
                    imageUrl={detail.image}
                  />
                </CardContent>
                <CardFooter className="gap-4">
                  <Clock3Icon /> {dateStringToLocale(detail.createdAt)}
                </CardFooter>
              </Card>
            </div>
          )}
        />
      </div>
    </div>
  );
}
