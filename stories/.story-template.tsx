import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "@/components/ui/component-name";

/**
 * ComponentName component stories demonstrating various variants and use cases.
 *
 * [Brief description of what the component does and when to use it]
 *
 * @component
 */
const meta = {
  title: "Components/UI/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false, // Set to true for App Router components
    },
    docs: {
      description: {
        component: "[Detailed component description and usage guidelines]",
      },
    },
    viewport: {
      defaultViewport: "desktop",
    },
  },
  argTypes: {
    // Add argTypes for better controls
    // variant: {
    //   control: 'select',
    //   options: ['option1', 'option2'],
    //   description: 'Description of the prop',
    // },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default component variant.
 * [Description of when to use this variant]
 */
export const Default: Story = {
  args: {
    // Component props
  },
};

/**
 * [Variant name] variant.
 * [Description of when to use this variant]
 */
export const Variant1: Story = {
  args: {
    // Component props for this variant
  },
  // Optional: Add play function for interaction testing
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   // Test interactions
  // },
};
