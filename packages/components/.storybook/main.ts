import path, { dirname } from "path"
import { fileURLToPath } from "url"
import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"

const componentsDir = dirname(dirname(fileURLToPath(import.meta.url)))

const config: StorybookConfig = {
  stories: ["../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins?.push(tailwindcss())
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": componentsDir,
        "@/lib/utils": path.resolve(componentsDir, "../lib/utils.ts"),
      },
    }
    return config
  },
}

export default config