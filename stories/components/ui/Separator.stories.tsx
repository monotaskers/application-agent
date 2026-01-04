import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@/components/ui/separator";

const meta = {
  title: "Components/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <div>Content above</div>
      <Separator />
      <div>Content below</div>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <div>Section 1</div>
      <Separator orientation="horizontal" />
      <div>Section 2</div>
      <Separator orientation="horizontal" />
      <div>Section 3</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div>Left</div>
      <Separator orientation="vertical" />
      <div>Right</div>
    </div>
  ),
};
