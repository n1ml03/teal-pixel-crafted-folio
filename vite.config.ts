import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Add visualizer plugin in build mode to analyze bundle size
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000 kB
    minify: 'esbuild', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs in production
        drop_debugger: mode === 'production', // Remove debugger statements in production
      }
    },
    rollupOptions: {
      output: {
        // Ensure CSS is extracted to separate files
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        manualChunks(id) {
          // Create a chunk for playground components
          if (id.includes('src/components/playground')) {
            return 'playground';
          }

          // Create a chunk for playground pages
          if (id.includes('src/pages/playground')) {
            return 'playground-pages';
          }

          // Create a chunk for help and tutorial components
          if (id.includes('src/components/playground/help') ||
              id.includes('src/data/help-content') ||
              id.includes('src/data/tutorials')) {
            return 'playground-help';
          }

          // Create a chunk for code editor and related components
          if (id.includes('codemirror') ||
              id.includes('src/components/playground/CodeEditor')) {
            return 'code-editor';
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

          // Create a chunk for utility libraries
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/lodash') ||
              id.includes('node_modules/uuid')) {
            return 'vendor-utils';
          }
        }
      }
    },
    // Enable source maps for debugging in development
    sourcemap: mode !== 'production'
  }
}));
