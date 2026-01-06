"use client";

/**
 * @fileoverview Pie Graph Component - Integration example using reusable PieChart
 * @module features/overview/components/pie-graph
 *
 * This component demonstrates integration of the reusable PieChart component.
 * Refactored from original implementation to use the new reusable component.
 */

import * as React from "react";
import { ReactElement } from "react";
import { RiArrowUpLine } from "@remixicon/react";
import { PieChart } from "@/components/charts/pie-chart";
import type { ChartConfig } from "@/components/charts/chart";

const chartData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 287 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 190 },
];

const chartConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--primary)",
  },
  safari: {
    label: "Safari",
    color: "var(--primary)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--primary)",
  },
  edge: {
    label: "Edge",
    color: "var(--primary)",
  },
  other: {
    label: "Other",
    color: "var(--primary)",
  },
};

export function PieGraph(): ReactElement {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  const topCategory = chartData[0];
  const percentage = topCategory
    ? ((topCategory.visitors / totalVisitors) * 100).toFixed(1)
    : "0";

  return (
    <PieChart
      data={chartData}
      dataKey="visitors"
      categoryKey="browser"
      title="Pie Chart - Donut with Text"
      description={
        <>
          <span className="hidden @[540px]/card:block">
            Total visitors by browser for the last 6 months
          </span>
          <span className="@[540px]/card:hidden">Browser distribution</span>
        </>
      }
      chartConfig={chartConfig}
      centerLabel={{
        label: "Total Visitors",
        valueFormatter: (value) => value.toLocaleString(),
      }}
      footer={
        <div className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Chrome leads with {percentage}%{" "}
            <RiArrowUpLine className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Based on data from January - June 2024
          </div>
        </div>
      }
    />
  );
}
