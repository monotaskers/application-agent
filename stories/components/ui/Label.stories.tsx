import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Components/UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label text",
  },
};

export const Required: Story = {
  args: {
    children: (
      <>
        Required field <span className="text-destructive">*</span>
      </>
    ),
  },
};
