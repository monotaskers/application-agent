import type { StorybookConfig } from "@storybook/nextjs-vite";
import { resolve } from "path";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
    "../src/**/*.stories.@(ts|tsx)", // Include stories from src directory
  ],
  // In Storybook 9+, addon-essentials and addon-interactions are built-in
  // Only need to explicitly add addon-themes and addon-a11y
  addons: ["@storybook/addon-themes", "@storybook/addon-a11y"],
  typescript: {
    check: true,
  },
  viteFinal: async (config) => {
    // Configure path aliases to match tsconfig.json
    const pathAlias = {
      "@": resolve(__dirname, "../src"),
    };

    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...pathAlias,
      };
    } else {
      config.resolve = {
        alias: pathAlias,
      };
    }

    // Ensure optimizeDeps includes the path alias resolution
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        // Add any components that need to be pre-bundled
      ],
    };

    return config;
  },
};

export default config;
