import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Card component stories demonstrating various layouts and use cases.
 *
 * Cards are used to group related content and actions. They can include
 * headers, content sections, and footers for flexible layouts.
 */
const meta = {
  title: "Components/UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
    docs: {
      description: {
        component:
          "A flexible container component for displaying content with optional header and footer sections.",
      },
    },
    viewport: {
      defaultViewport: "desktop",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with content only.
 * Use when you need a simple container without header or footer.
 */
export const Default: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with header section containing title and description.
 * Use when you need to provide context or metadata about the card content.
 */
export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with footer section for actions.
 * Use when you need action buttons or links at the bottom of the card.
 */
export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Complete card with header, content, and footer.
 * Use for full-featured cards that need all sections.
 */
export const Complete: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
};
