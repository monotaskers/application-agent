import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Button } from "@/components/ui/button";

/**
 * Button component stories demonstrating various variants and use cases.
 *
 * The Button component supports multiple visual styles (primary, destructive, outline, etc.),
 * different sizes (xs, sm, md, lg, icon), and various interaction modes.
 *
 * @component
 */
const meta = {
  title: "Components/UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants, sizes, and interaction modes. Use for primary actions, secondary actions, and navigation.",
      },
    },
    viewport: {
      defaultViewport: "desktop",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "destructive",
        "secondary",
        "outline",
        "ghost",
        "dashed",
        "mono",
      ],
      description: "Visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "icon"],
      description: "Size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    children: {
      control: "text",
      description: "Button label or content",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button variant with primary styling.
 * Use for the main action in a form or dialog.
 */
export const Default: Story = {
  args: {
    children: "Click me",
    variant: "primary",
  },
};

/**
 * Primary button variant - the main call-to-action.
 * Typically used for submitting forms or confirming actions.
 */
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /primary button/i });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
  },
};

/**
 * Destructive button variant for dangerous actions.
 * Use for delete, remove, or other destructive operations.
 */
export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

/**
 * Outline button variant with border and transparent background.
 * Use for secondary actions that are less prominent than primary buttons.
 */
export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};
