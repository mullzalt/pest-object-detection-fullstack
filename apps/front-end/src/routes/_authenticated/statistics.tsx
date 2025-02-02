import * as React from "react";
import { statsQueryOptions } from "@/queries/reports";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  type TooltipProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const Route = createFileRoute("/_authenticated/statistics")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(statsQueryOptions());
  },
});

const COLOURS = ["#3B82F6", "#F43F5E", "#22C55E", "#EAB308"];

type GenerateTicks = {
  start: number;
  end: number;
  size: number;
};

const generateTicks = ({ start, end, size }: GenerateTicks): number[] => {
  if (size < 2) {
    return [start, end];
  }

  const step = Math.floor((end - start) / (size - 1));
  return Array.from({ length: size }, (_, i) => start + i * step);
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 text-sm rounded-md border">
        <p className="font-semibold">
          {payload[0].payload?.label}: {payload[0].payload?.confidence}%
        </p>
      </div>
    );
  }

  return null;
};

function RouteComponent() {
  const { data } = useSuspenseQuery(statsQueryOptions());

  const labels = Object.keys(data.data);

  const formatTime = (time: number) => {
    return new Date(time).toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const TIME = 24 * 60 * 60 * 1000;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="p-4 rounded-md border">
        <p className="font-semibold text-lg">Total Kemunculan:</p>
        {labels.map((label) => (
          <p>
            {label}: {data.metadata.occurs[label]}
          </p>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            name="Time"
            tickFormatter={formatTime}
            domain={([min, max]) => [min - TIME, max + TIME]}
          />
          <YAxis
            type="number"
            unit={"%"}
            dataKey="confidence"
            name="Confidence"
            domain={[0, 100]}
          />
          <ZAxis type="category" dataKey="label" name="Label" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<CustomTooltip />}
          />
          <Legend />

          {labels.map((label, index) => (
            <React.Fragment key={label}>
              <Scatter
                name={label}
                data={data.data[label]}
                fill={COLOURS[index % COLOURS.length]}
              />
            </React.Fragment>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
