import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create a chunk for playground components
          if (id.includes('src/components/playground')) {
            return 'playground';
          }

          // Create a chunk for react-syntax-highlighter
          if (id.includes('react-syntax-highlighter')) {
            return 'syntax-highlighter';
          }

          // Create a chunk for react and related libraries
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }

          // Create a chunk for UI components
          if (id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'vendor-ui';
          }

          // Create a chunk for animation libraries
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/react-type-animation')) {
            return 'vendor-animation';
          }
        }
      }
    }
  }
}));
