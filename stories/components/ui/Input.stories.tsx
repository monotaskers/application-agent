import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Input component stories demonstrating various states and use cases.
 *
 * Inputs are used for collecting user data in forms. They support
 * different types, validation states, and can be combined with labels.
 */
const meta = {
  title: "Components/UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
    docs: {
      description: {
        component:
          "A versatile input component for text, email, password, and other input types with validation states.",
      },
    },
    viewport: {
      defaultViewport: "desktop",
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
      description: "Input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    variant: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant of the input",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input with placeholder text.
 * Basic usage for text input fields.
 */
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

/**
 * Input with associated label for accessibility.
 * Always use labels with inputs for proper form semantics.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="input">Email</Label>
      <Input id="input" type="email" placeholder="email@example.com" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/email/i);
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, "test@example.com");
    await expect(input).toHaveValue("test@example.com");
  },
};

/**
 * Input with custom placeholder text.
 * Use placeholders to provide hints about expected input format.
 */
export const WithPlaceholder: Story = {
  args: {
    placeholder: "Type something...",
  },
};

/**
 * Disabled input state.
 * Use when the input should not be editable.
 */
export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

/**
 * Input in error state with validation feedback.
 * Use when form validation fails.
 */
export const Error: Story = {
  args: {
    placeholder: "Error state",
    "aria-invalid": true,
  },
};
