import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Info as InfoIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const meta = {
  title: "Components/UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "secondary",
        "primary",
        "destructive",
        "success",
        "info",
        "warning",
        "mono",
      ],
      description: "Alert variant type",
    },
    appearance: {
      control: "select",
      options: ["solid", "outline", "light", "stroke"],
      description: "Visual appearance style",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the alert",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertContent>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>This is a default alert message.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

export const InfoAlert: Story = {
  render: () => (
    <Alert variant="info" appearance="solid">
      <AlertIcon>
        <InfoIcon />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is an informational alert.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" appearance="solid">
      <AlertIcon>
        <AlertCircle />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning alert.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

export const Error: Story = {
  render: () => (
    <Alert variant="destructive" appearance="solid">
      <AlertIcon>
        <XCircle />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>This is an error alert.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success" appearance="solid">
      <AlertIcon>
        <CheckCircle />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>This is a success alert.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
};
