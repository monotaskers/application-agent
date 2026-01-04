import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@/components/ui/progress";

const meta = {
  title: "Components/UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const VariousPercentages: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Progress value={0} />
        <p className="text-sm mt-1">0%</p>
      </div>
      <div>
        <Progress value={25} />
        <p className="text-sm mt-1">25%</p>
      </div>
      <div>
        <Progress value={50} />
        <p className="text-sm mt-1">50%</p>
      </div>
      <div>
        <Progress value={75} />
        <p className="text-sm mt-1">75%</p>
      </div>
      <div>
        <Progress value={100} />
        <p className="text-sm mt-1">100%</p>
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    value: undefined,
  },
};
