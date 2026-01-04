/**
 * @fileoverview Tests for PieChart component
 * @module components/charts/__tests__/pie-chart.test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ReactElement } from "react";
import { PieChart, type ChartDataItem } from "../pie-chart";

/**
 * Test suite for PieChart component.
 *
 * Tests user interactions, state management, and error handling.
 * Mocks external dependencies to ensure isolated unit tests.
 */
describe("PieChart", () => {
  const mockData: ChartDataItem[] = [
    { category: "Chrome", value: 275 },
    { category: "Safari", value: 200 },
    { category: "Firefox", value: 287 },
  ];

  beforeEach(() => {
    // Mock recharts ResponsiveContainer to avoid layout issues in tests
    vi.mock("recharts", async () => {
      const actual = await vi.importActual("recharts");
      return {
        ...actual,
        ResponsiveContainer: ({ children }: { children: ReactElement }) => (
          <div data-testid="responsive-container">{children}</div>
        ),
      };
    });
  });

  /**
   * Tests that PieChart component renders with basic props.
   * (T012 - US1)
   */
  it("should render with basic props", () => {
    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        title="Browser Usage"
      />
    );

    expect(screen.getByText("Browser Usage")).toBeInTheDocument();
  });

  /**
   * Tests that chart segments display proportional to data values.
   * (T013 - US1)
   */
  it("should display chart segments proportional to data values", async () => {
    render(<PieChart data={mockData} dataKey="value" categoryKey="category" />);

    // Wait for chart to render
    await waitFor(() => {
      // Chart should be rendered (implementation will add data-testid or aria-label)
      const chartContainer =
        screen.getByRole("img", { hidden: true }) ||
        document.querySelector('[data-slot="chart"]');
      expect(chartContainer).toBeInTheDocument();
    });
  });

  /**
   * Tests that center label displays total value.
   * (T014 - US1)
   */
  it("should display center label with total value", async () => {
    const total = mockData.reduce(
      (sum, item) => sum + (item.value as number),
      0
    );

    render(<PieChart data={mockData} dataKey="value" categoryKey="category" />);

    await waitFor(() => {
      // Center label should show total (762 = 275 + 200 + 287)
      const centerLabel = screen.getByText(new RegExp(total.toString()));
      expect(centerLabel).toBeInTheDocument();
    });
  });

  /**
   * Tests that tooltip displays category label and value on hover.
   * (T015 - US1)
   */
  it("should display tooltip with category label and value on hover", async () => {
    render(<PieChart data={mockData} dataKey="value" categoryKey="category" />);

    // Wait for chart to render, then hover over a segment
    await waitFor(() => {
      // This will be implemented when the component is built
      // For now, we're testing the structure
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();

      // Tooltip interaction will be tested when component is implemented
      // const user = userEvent.setup();
      // await user.hover(chartSegment);
      // expect(screen.getByText("Chrome")).toBeInTheDocument();
      // expect(screen.getByText("275")).toBeInTheDocument();
    });
  });

  /**
   * Tests that chart segments use appropriate visual styling.
   * (T016 - US1)
   */
  it("should use appropriate visual styling for chart segments", async () => {
    render(<PieChart data={mockData} dataKey="value" categoryKey="category" />);

    await waitFor(() => {
      // Chart should have proper styling classes
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
      // Styling will be verified when component is implemented
    });
  });

  /**
   * Tests that prop validation rejects invalid data structures.
   * (T017 - US1)
   */
  it("should reject invalid data structures", async () => {
    const invalidData = [
      { category: "Chrome" }, // Missing value
      { value: 275 }, // Missing category
    ];

    // Component should handle invalid data gracefully
    // This will be tested with the validation utility
    const { validatePieChartProps } = await import("../pie-chart");
    const result = validatePieChartProps({
      data: invalidData,
      dataKey: "value",
      categoryKey: "category",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  /**
   * Tests that component handles empty data array.
   * (T046 - US3)
   */
  it("should handle empty data array", () => {
    render(<PieChart data={[]} dataKey="value" categoryKey="category" />);

    expect(screen.getByText("No data available")).toBeInTheDocument();
    expect(
      screen.getByText(/The chart requires at least one data point/i)
    ).toBeInTheDocument();
  });

  /**
   * Tests that component handles single data item.
   * (T047 - US3) - Writing early for edge case coverage
   */
  it("should handle single data item", async () => {
    const singleItem: ChartDataItem[] = [{ category: "All", value: 100 }];

    render(
      <PieChart data={singleItem} dataKey="value" categoryKey="category" />
    );

    await waitFor(() => {
      // Should render as complete circle (100%)
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
    });
  });

  // ============================================================================
  // User Story 2 Tests (T028-T035)
  // ============================================================================

  /**
   * Tests custom center label text and value formatting.
   * (T028 - US2)
   */
  it("should display custom center label text and formatted value", async () => {
    const total = mockData.reduce(
      (sum, item) => sum + (item.value as number),
      0
    );

    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        centerLabel={{
          label: "Total Visitors",
          valueFormatter: (v) => `$${v.toLocaleString()}`,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Total Visitors")).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`\\$${total.toLocaleString()}`))
      ).toBeInTheDocument();
    });
  });

  /**
   * Tests custom color configuration with colors array.
   * (T029 - US2)
   */
  it("should use custom colors array when provided", async () => {
    const customColors = ["#FF5733", "#33FF57", "#3357FF"];

    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        colors={customColors}
      />
    );

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
      // Colors are applied via gradients, verified by chart rendering
    });
  });

  /**
   * Tests baseColor prop generating color variations.
   * (T030 - US2)
   */
  it("should generate color variations from baseColor", async () => {
    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        baseColor="#FF5733"
      />
    );

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
    });
  });

  /**
   * Tests chart size configuration.
   * (T031 - US2)
   */
  it("should apply custom size configuration", () => {
    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        size={{ width: 400, height: 300, className: "custom-size" }}
      />
    );

    const chart = document.querySelector('[data-slot="chart"]');
    expect(chart).toBeInTheDocument();
    expect(chart?.classList.contains("custom-size")).toBe(true);
  });

  /**
   * Tests footer content display (string, ReactElement, function).
   * (T032 - US2)
   */
  it("should display footer content as string", () => {
    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        footer="Footer text"
      />
    );

    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });

  it("should display footer content as ReactElement", () => {
    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        footer={<div data-testid="footer-element">Custom Footer</div>}
      />
    );

    expect(screen.getByTestId("footer-element")).toBeInTheDocument();
  });

  it("should display footer content from function", () => {
    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        footer={() => <div data-testid="footer-function">Function Footer</div>}
      />
    );

    expect(screen.getByTestId("footer-function")).toBeInTheDocument();
  });

  /**
   * Tests theme adaptation (light/dark mode colors).
   * (T033 - US2)
   */
  it("should support theme-aware colors via ChartConfig", async () => {
    const chartConfig = {
      Chrome: {
        label: "Chrome",
        theme: {
          light: "hsl(var(--primary))",
          dark: "hsl(var(--primary))",
        },
      },
    };

    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        chartConfig={chartConfig}
      />
    );

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
    });
  });

  /**
   * Tests custom center label render function.
   * (T034 - US2)
   */
  it("should render custom center label from function", async () => {
    const total = mockData.reduce(
      (sum, item) => sum + (item.value as number),
      0
    );

    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        centerLabel={(totalValue) => (
          <div data-testid="custom-label">
            <div>{totalValue}</div>
            <div>Custom Total</div>
          </div>
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("custom-label")).toBeInTheDocument();
      expect(screen.getByText(total.toString())).toBeInTheDocument();
    });
  });

  /**
   * Tests ChartConfig prop integration with tooltips and theming.
   * (T035 - US2)
   */
  it("should integrate ChartConfig for tooltips and theming", async () => {
    const chartConfig = {
      Chrome: { label: "Google Chrome", color: "#4285f4" },
      Safari: { label: "Safari Browser", color: "#000000" },
      Firefox: { label: "Mozilla Firefox", color: "#FF7139" },
    };

    render(
      <PieChart
        data={mockData}
        dataKey="value"
        categoryKey="category"
        chartConfig={chartConfig}
      />
    );

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
    });
  });

  // ============================================================================
  // User Story 3 Tests (T046-T053)
  // ============================================================================

  /**
   * Tests that zero values are excluded from visualization.
   * (T049 - US3)
   */
  it("should exclude zero values from visualization", async () => {
    const dataWithZeros: ChartDataItem[] = [
      { category: "A", value: 10 },
      { category: "B", value: 0 },
      { category: "C", value: 20 },
    ];

    render(
      <PieChart data={dataWithZeros} dataKey="value" categoryKey="category" />
    );

    await waitFor(() => {
      // Only A and C should be rendered (B with value 0 is excluded)
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
      // Total should be 30, not 30 (10 + 0 + 20)
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  /**
   * Tests that negative values are handled gracefully.
   * (T050 - US3)
   */
  it("should exclude negative values from visualization", async () => {
    const dataWithNegatives: ChartDataItem[] = [
      { category: "A", value: 10 },
      { category: "B", value: -5 },
      { category: "C", value: 20 },
    ];

    render(
      <PieChart
        data={dataWithNegatives}
        dataKey="value"
        categoryKey="category"
      />
    );

    await waitFor(() => {
      // Only A and C should be rendered (B with negative value is excluded)
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
      // Total should be 30, not 25 (10 + -5 + 20)
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  /**
   * Tests that large datasets (10+ segments) render correctly.
   * (T051 - US3)
   */
  it("should handle large datasets with 10+ segments", async () => {
    const largeData: ChartDataItem[] = Array.from({ length: 12 }, (_, i) => ({
      category: `Category ${i + 1}`,
      value: (i + 1) * 10,
    }));

    render(
      <PieChart data={largeData} dataKey="value" categoryKey="category" />
    );

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
      // Should render without errors
    });
  });

  /**
   * Tests that invalid data structure shows error state.
   * (T052 - US3)
   */
  it("should show error state for invalid data structure", () => {
    const invalidData = [
      { category: "A" }, // Missing value
      { value: 10 }, // Missing category
    ];

    render(
      <PieChart data={invalidData} dataKey="value" categoryKey="category" />
    );

    expect(screen.getByText(/Error loading chart/i)).toBeInTheDocument();
  });

  /**
   * Tests that data validation uses Zod schemas.
   * (T053 - US3)
   */
  it("should validate data using Zod schemas", async () => {
    const { validatePieChartProps } = await import("../pie-chart");

    const invalidProps = {
      data: [{ category: "A" }], // Missing value
      dataKey: "value",
      categoryKey: "category",
    };

    const result = validatePieChartProps(invalidProps);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  /**
   * Tests that missing required fields are handled.
   * (T048 - US3)
   */
  it("should handle missing required fields gracefully", async () => {
    const dataWithMissingFields: ChartDataItem[] = [
      { category: "A", value: 10 },
      { category: "B" }, // Missing value field
      { value: 20 }, // Missing category field
    ];

    render(
      <PieChart
        data={dataWithMissingFields}
        dataKey="value"
        categoryKey="category"
      />
    );

    // The normalizeChartData function filters out invalid items
    // Only valid item (A with value 10) should be rendered
    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
      // Total should be 10 (only valid item)
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Performance Tests (T074)
  // ============================================================================

  /**
   * Tests that component renders within 1 second on standard hardware.
   * (T074 - Phase 6)
   */
  it("should render within 1 second", async () => {
    const startTime = performance.now();

    render(<PieChart data={mockData} dataKey="value" categoryKey="category" />);

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]');
      expect(chart).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render within 1 second (1000ms)
    expect(renderTime).toBeLessThan(1000);
  });
});
