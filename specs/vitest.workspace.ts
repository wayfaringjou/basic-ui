/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineWorkspace } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineWorkspace([
  "components/react",
  {
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      include: ["./react/**/*.spec.tsx"],
      setupFiles: "./setup-react-tests.ts",
    },
  },
]);
