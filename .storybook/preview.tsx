import type { Preview } from "@storybook/react";
import React, { useEffect, ReactElement } from "react";
import { ActiveThemeProvider, useThemeConfig } from "@/components/active-theme";
import "../src/app/globals.css";

const ThemeDecorator = (
  Story: () => ReactElement,
  context: { globals: { theme?: string } }
): ReactElement => {
  const theme = context.globals.theme || "default";

  return (
    <ActiveThemeProvider initialTheme={theme}>
      <ThemeUpdater theme={theme} />
      <Story />
    </ActiveThemeProvider>
  );
};

const ThemeUpdater = ({ theme }: { theme: string }): null => {
  const { setActiveTheme } = useThemeConfig();

  useEffect(() => {
    setActiveTheme(theme);
  }, [theme, setActiveTheme]);

  return null;
};

const preview: Preview = {
  decorators: [ThemeDecorator],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1280px",
            height: "800px",
          },
        },
      },
      defaultViewport: "desktop",
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "default",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "default", title: "Default" },
          { value: "blue", title: "Blue" },
          { value: "green", title: "Green" },
          { value: "amber", title: "Amber" },
          { value: "mono-scaled", title: "Mono" },
        ],
      },
    },
  },
};

export default preview;
