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
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        format: 'es',
        manualChunks(id) {
          // Vendor chunks - simplified to avoid circular dependencies
          if (id.includes('node_modules')) {
            // React ecosystem - keep together to avoid loading order issues
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || 
                id.includes('react-scroll-parallax') || id.includes('qrcode.react') || 
                id.includes('react-hook-form') || id.includes('@hookform') || 
                id.includes('react-markdown') || id.includes('react-resizable-panels') ||
                id.includes('@radix-ui')) {
              return 'vendor-react';
            }

            // UI frameworks and styling (excluding @radix-ui which moved to vendor-react)
            if (id.includes('framer-motion') || 
                id.includes('next-themes') || id.includes('tailwind-merge') || id.includes('clsx')) {
              return 'vendor-ui';
            }

            // CodeMirror - keep all together
            if (id.includes('@codemirror') || id.includes('codemirror')) {
              return 'vendor-codemirror';
            }

            // Utility libraries
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('zod') || 
                id.includes('@tanstack/react-query')) {
              return 'vendor-utils';
            }

            // All other vendor libraries - single chunk to avoid circular deps
            return 'vendor';
          }

          // Application chunks - simplified
          if (id.includes('src/components/playground') || id.includes('src/pages/playground')) {
            return 'app-playground';
          }

          if (id.includes('src/components/tools') || id.includes('src/pages/tools')) {
            return 'app-tools';
          }

          if (id.includes('src/components/shorten') || id.includes('src/pages/shorten')) {
            return 'app-shorten';
          }

          if (id.includes('src/components/home') || id.includes('src/pages/home')) {
            return 'app-home';
          }

          // All other app code
          if (id.includes('src/')) {
            return 'app';
          }
        }
      }
    },
    sourcemap: mode !== 'production'
  }
}));
