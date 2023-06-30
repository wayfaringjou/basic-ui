import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: path.dirname(
      require.resolve(path.join("@storybook/react-vite", "package.json"))
    ) as "@storybook/react-vite",
    options: {},
  },
  stories: ["../*.mdx", "../*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    path.dirname(
      require.resolve(path.join("@storybook/addon-essentials", "package.json"))
    ),
    path.dirname(require.resolve(path.join("@storybook/addon-a11y", "package.json"))),
    path.dirname(
      require.resolve(path.join("@storybook/addon-interactions", "package.json"))
    ),
  ],
  core: {
    builder: {
      name: path.dirname(
        require.resolve(path.join("@storybook/builder-vite", "package.json"))
      ) as "@storybook/builder-vite",
      options: {},
    },
  },
  async viteFinal(config, options) {
    // Vite configuration can be added here
    return config;
  },
};

export default config;
