"use client";

/**
 * @fileoverview Reusable Pie Chart Component
 * @module components/charts/pie-chart
 */

import * as React from "react";
import { ReactElement, useMemo } from "react";
import { Label, Pie, PieChart as RechartsPieChart } from "recharts";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart";
import { cn } from "@/lib/utils";

// ============================================================================
// Zod Schemas (T004-T007)
// ============================================================================

/**
 * Zod schema for a single chart data item.
 * Represents a single category in the pie chart.
 */
export const chartDataItemSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.undefined()])
);

/**
 * Zod schema for center label configuration.
 * Configuration for the center label display.
 */
export const centerLabelConfigSchema = z
  .object({
    /** Custom label text to display below the value */
    label: z.string().optional(),
    /** Custom formatter function for the numeric value */
    valueFormatter: z
      .function()
      .args(z.number())
      .returns(z.string())
      .optional(),
  })
  .optional();

/**
 * Zod schema for pie chart size configuration.
 * Size configuration for the chart container.
 */
export const pieChartSizeSchema = z
  .object({
    /** Width in pixels */
    width: z.number().optional(),
    /** Height in pixels */
    height: z.number().optional(),
    /** Custom Tailwind CSS classes for size */
    className: z.string().optional(),
  })
  .optional();

/**
 * Zod schema for PieChart component props.
 * Includes all validation rules from data-model.md.
 */
export const pieChartPropsSchema = z
  .object({
    // Required props
    data: z.array(chartDataItemSchema).min(1, "Data array must not be empty"),
    dataKey: z.string().min(1, "Data key is required"),
    categoryKey: z.string().min(1, "Category key is required"),

    // Optional display props
    title: z.string().optional(),
    description: z.any().optional(), // ReactNode - validated by TypeScript

    // Optional customization props
    colors: z.array(z.string()).optional(),
    baseColor: z.string().optional(),
    innerRadius: z.number().min(0).max(100).optional(),
    size: pieChartSizeSchema,

    // Center label configuration - validated by TypeScript for functions
    centerLabel: z.any().optional(),

    // Footer configuration - validated by TypeScript for ReactElement/functions
    footer: z.any().optional(),

    // Chart config for tooltips and theming
    chartConfig: z.record(z.any()).optional(),

    // Card wrapper configuration
    showCard: z.boolean().optional(),
    cardProps: z.any().optional(),

    // Accessibility
    ariaLabel: z.string().optional(),
    ariaDescribedBy: z.string().optional(),
  })
  .refine(
    (data) =>
      data.data.every(
        (item) => data.dataKey in item && typeof item[data.dataKey] === "number"
      ),
    {
      message:
        "All data items must have numeric values for the specified dataKey",
    }
  )
  .refine(
    (data) =>
      data.data.every(
        (item) =>
          data.categoryKey in item && typeof item[data.categoryKey] === "string"
      ),
    {
      message:
        "All data items must have string category identifiers for the specified categoryKey",
    }
  );

// ============================================================================
// TypeScript Types (T008)
// ============================================================================

/**
 * Single data item in the pie chart dataset.
 */
export type ChartDataItem = z.infer<typeof chartDataItemSchema>;

/**
 * Configuration for the center label display.
 */
export type CenterLabelConfig = z.infer<typeof centerLabelConfigSchema>;

/**
 * Size configuration for the chart container.
 */
export type PieChartSize = z.infer<typeof pieChartSizeSchema>;

/**
 * Props for the reusable PieChart component.
 */
export interface PieChartProps {
  /**
   * Array of data items to visualize.
   * Each item must contain the fields specified by dataKey and categoryKey.
   */
  data: ChartDataItem[];

  /**
   * Key in data items that contains the numeric value to visualize.
   */
  dataKey: string;

  /**
   * Key in data items that contains the category identifier.
   */
  categoryKey: string;

  /** Chart title displayed in the card header. */
  title?: string;

  /** Chart description displayed below the title. */
  description?: string | ReactElement;

  /** Array of colors to use for chart segments. */
  colors?: string[];

  /** Base color to use for generating color variations. */
  baseColor?: string;

  /** Inner radius of the donut chart in pixels. */
  innerRadius?: number;

  /** Size configuration for the chart container. */
  size?: PieChartSize;

  /** Configuration for the center label. */
  centerLabel?: CenterLabelConfig | ((total: number) => ReactElement);

  /** Footer content to display below the chart. */
  footer?: string | ReactElement | (() => ReactElement);

  /** ChartConfig object for tooltip labels and theming. */
  chartConfig?: ChartConfig;

  /** Whether to wrap the chart in a Card component. */
  showCard?: boolean;

  /** Additional props to pass to the Card wrapper component. */
  cardProps?: React.ComponentProps<typeof Card>;

  /** ARIA label for the chart container. */
  ariaLabel?: string;

  /** ARIA describedby reference. */
  ariaDescribedBy?: string;

  /** Stable ID for the chart container (prevents hydration mismatches) */
  chartId?: string;
}

// ============================================================================
// Utility Functions (T009-T011)
// ============================================================================

/**
 * Validates props using Zod schema.
 * Returns validation result with error information if validation fails.
 *
 * @param props - Props to validate
 * @returns Validation result with success status and error information
 */
export function validatePieChartProps(props: unknown): {
  success: boolean;
  error?: z.ZodError | undefined;
} {
  const result = pieChartPropsSchema.safeParse(props);
  if (result.success) {
    return { success: true, error: undefined };
  }
  return { success: false, error: result.error };
}

/**
 * Generates color variations from a base color.
 * Creates gradient colors using opacity adjustments.
 *
 * @param baseColor - Base color (CSS variable, hex, rgb, hsl)
 * @param count - Number of color variations to generate
 * @returns Array of color strings
 */
export function generateColorVariations(
  baseColor: string,
  count: number
): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    // For CSS variables, we'll use them directly in gradients
    // Opacity variations are handled in the gradient definitions
    colors.push(baseColor);
  }
  return colors;
}

/**
 * Normalizes chart data by filtering invalid, zero, and negative values.
 * Returns only valid data items with positive numeric values.
 *
 * @param data - Array of chart data items
 * @param dataKey - Key containing numeric values
 * @param categoryKey - Key containing category identifiers
 * @returns Normalized array of valid data items
 */
export function normalizeChartData(
  data: ChartDataItem[],
  dataKey: string,
  categoryKey: string
): ChartDataItem[] {
  return data.filter((item) => {
    const value = item[dataKey];
    const category = item[categoryKey];

    // Must have both value and category
    if (value === undefined || category === undefined) {
      return false;
    }

    // Value must be a number
    if (typeof value !== "number") {
      return false;
    }

    // Category must be a string
    if (typeof category !== "string") {
      return false;
    }

    // Exclude zero and negative values
    if (value <= 0) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// Component Implementation (T018-T027)
// ============================================================================

/**
 * Reusable pie/donut chart component with customizable appearance and layout.
 *
 * Provides a reusable pie chart with consistent styling and behavior
 * across the application. Supports keyboard navigation and screen readers.
 *
 * @component
 * @example
 * ```tsx
 * <PieChart
 *   data={[{ category: "Chrome", value: 275 }]}
 *   dataKey="value"
 *   categoryKey="category"
 *   title="Browser Usage"
 * />
 * ```
 */
export function PieChart({
  data,
  dataKey,
  categoryKey,
  title,
  description,
  colors,
  baseColor = "var(--primary)",
  innerRadius = 60,
  size,
  centerLabel,
  footer,
  chartConfig,
  showCard = true,
  cardProps,
  ariaLabel,
  ariaDescribedBy,
  chartId,
}: PieChartProps): ReactElement {
  // Validate props (T009) - Must be called before any conditional returns
  const validationResult = useMemo(() => {
    return validatePieChartProps({ data, dataKey, categoryKey });
  }, [data, dataKey, categoryKey]);

  // Normalize data (T011) - Must be called before any conditional returns
  const normalizedData = useMemo(
    () => normalizeChartData(data, dataKey, categoryKey),
    [data, dataKey, categoryKey]
  );

  // Calculate total - Must be called before any conditional returns
  const total = useMemo(
    () =>
      normalizedData.reduce(
        (sum, item) => sum + ((item[dataKey] as number) || 0),
        0
      ),
    [normalizedData, dataKey]
  );

  // Generate colors (T010) - Must be called before any conditional returns
  const segmentColors = useMemo(() => {
    if (colors && colors.length > 0) {
      return colors;
    }
    return generateColorVariations(baseColor, normalizedData.length);
  }, [colors, baseColor, normalizedData.length]);

  // Default chart config - Must be called before any conditional returns
  const defaultChartConfig: ChartConfig = useMemo(() => {
    if (chartConfig) {
      return chartConfig;
    }
    const config: ChartConfig = {};
    normalizedData.forEach((item) => {
      const category = item[categoryKey] as string;
      config[category] = {
        label: category,
        color: baseColor,
      };
    });
    return config;
  }, [chartConfig, normalizedData, categoryKey, baseColor]);

  // Chart container size - Must be called before any conditional returns
  const chartSize = useMemo(() => {
    const defaultSize = {
      height: 250,
      className: "mx-auto aspect-square",
    };
    if (size) {
      return {
        height: size.height || defaultSize.height,
        className: size.className || defaultSize.className,
      };
    }
    return defaultSize;
  }, [size]);

  // Show error state if validation fails (T060)
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error?.errors.map((e) => e.message).join(", ") ||
      "Invalid chart data";

    const errorContent = (
      <div
        className="flex flex-col items-center justify-center p-8 text-center"
        role="alert"
        aria-label={ariaLabel || "Chart error"}
      >
        <p className="text-destructive font-medium">Error loading chart</p>
        <p className="text-muted-foreground text-sm mt-2">{errorMessage}</p>
      </div>
    );

    if (!showCard) {
      return errorContent;
    }

    return (
      <Card className="@container/card" {...cardProps}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>{errorContent}</CardContent>
      </Card>
    );
  }

  // Handle empty data (T054)
  if (normalizedData.length === 0) {
    const emptyContent = (
      <div
        className="flex flex-col items-center justify-center p-8 text-center"
        role="status"
        aria-label={ariaLabel || "Empty chart"}
      >
        <p className="text-muted-foreground font-medium">No data available</p>
        <p className="text-muted-foreground text-sm mt-2">
          The chart requires at least one data point with a positive value.
        </p>
      </div>
    );

    if (!showCard) {
      return emptyContent;
    }

    return (
      <Card className="@container/card" {...cardProps}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>{emptyContent}</CardContent>
      </Card>
    );
  }

  // Render center label content using viewBox coordinates
  const renderCenterLabel = (viewBox: {
    cx: number;
    cy: number;
  }): ReactElement => {
    if (typeof centerLabel === "function") {
      return centerLabel(total);
    }

    const formattedValue = centerLabel?.valueFormatter
      ? centerLabel.valueFormatter(total)
      : total.toLocaleString();
    const label = centerLabel?.label || "Total";

    return (
      <>
        <tspan
          x={viewBox.cx}
          y={viewBox.cy}
          className="fill-foreground text-3xl font-bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {formattedValue}
        </tspan>
        <tspan
          x={viewBox.cx}
          y={viewBox.cy + 24}
          className="fill-muted-foreground text-sm"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </tspan>
      </>
    );
  };

  // Render footer content
  const renderFooter = (): ReactElement | null => {
    if (!footer) {
      return null;
    }
    if (typeof footer === "string") {
      return <div className="text-muted-foreground text-sm">{footer}</div>;
    }
    if (typeof footer === "function") {
      return footer();
    }
    return footer as ReactElement;
  };

  // Chart content
  const chartContent = (
    <ChartContainer
      id={chartId}
      config={defaultChartConfig}
      className={cn(chartSize.className, "h-[250px]")}
    >
      <RechartsPieChart>
        <defs>
          {normalizedData.map((item, index) => {
            const category = item[categoryKey] as string;
            const color = segmentColors[index] || baseColor;
            return (
              <linearGradient
                key={`gradient-${category}-${index}`}
                id={`fill-${category}-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={color}
                  stopOpacity={1 - index * 0.15}
                />
                <stop
                  offset="100%"
                  stopColor={color}
                  stopOpacity={0.8 - index * 0.15}
                />
              </linearGradient>
            );
          })}
        </defs>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={normalizedData.map((item, index) => ({
            ...item,
            fill: `url(#fill-${item[categoryKey]}-${index})`,
          }))}
          dataKey={dataKey}
          nameKey={categoryKey}
          innerRadius={innerRadius}
          strokeWidth={2}
          stroke="var(--background)"
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {renderCenterLabel({
                      cx: viewBox.cx as number,
                      cy: viewBox.cy as number,
                    })}
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );

  // If showCard is false, return just the chart
  if (!showCard) {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={chartSize.className}
      >
        {chartContent}
      </div>
    );
  }

  // Return with Card wrapper
  return (
    <Card
      className="@container/card"
      {...cardProps}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && (
            <CardDescription>
              {typeof description === "string" ? description : description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        {chartContent}
      </CardContent>
      {footer && <CardFooter>{renderFooter()}</CardFooter>}
    </Card>
  );
}
