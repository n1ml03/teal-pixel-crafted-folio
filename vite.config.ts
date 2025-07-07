import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      port: 8080,
    },
    // Clear cache on restart to prevent initialization issues
    force: mode === 'development',
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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zod',
      '@hookform/resolvers/zod',
      'react-hook-form',
      'sonner',
      'lucide-react'
    ],
    // Force rebuild deps if having issues
    force: mode === 'development',
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      // Optimize tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        format: 'es',
        // Optimize chunk splitting for better caching
        manualChunks(id) {
          // Vendor chunks - optimized for better caching
          if (id.includes('node_modules')) {
            // React core - most stable, cache longest
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react-core';
            }

            // React ecosystem - frequently updated
            if (id.includes('react-router') || id.includes('react-hook-form') ||
                id.includes('@hookform') || id.includes('react-markdown') ||
                id.includes('react-resizable-panels') || id.includes('react-scroll-parallax') ||
                id.includes('qrcode.react') || id.includes('react-intersection-observer')) {
              return 'vendor-react-ecosystem';
            }

            // UI components - Radix UI
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }

            // Animation and motion
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }

            // CodeMirror - large but stable
            if (id.includes('@codemirror') || id.includes('codemirror')) {
              return 'vendor-codemirror';
            }

            // Utility libraries - stable
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('zod') ||
                id.includes('validator') || id.includes('dompurify') || id.includes('use-debounce')) {
              return 'vendor-utils';
            }

            // Data fetching and state management
            if (id.includes('@tanstack/react-query') || id.includes('quicklink')) {
              return 'vendor-data';
            }

            // Styling utilities
            if (id.includes('tailwind-merge') || id.includes('clsx') || id.includes('class-variance-authority') ||
                id.includes('next-themes')) {
              return 'vendor-styling';
            }

            // Charts and visualization
            if (id.includes('recharts') || id.includes('canvas-confetti')) {
              return 'vendor-charts';
            }

            // All other vendor libraries
            return 'vendor-misc';
          }

          // Application chunks - route-based splitting
          if (id.includes('src/pages/playground') || id.includes('src/components/playground')) {
            return 'route-playground';
          }

          if (id.includes('src/pages/tools') || id.includes('src/components/tools')) {
            return 'route-tools';
          }

          if (id.includes('src/pages/shorten') || id.includes('src/components/shorten')) {
            return 'route-shorten';
          }

          if (id.includes('src/pages/home') || id.includes('src/components/home')) {
            return 'route-home';
          }

          // Shared components and utilities
          if (id.includes('src/components/ui') || id.includes('src/lib') || id.includes('src/hooks')) {
            return 'shared';
          }

          // Services and utilities
          if (id.includes('src/services') || id.includes('src/utils')) {
            return 'services';
          }
        }
      }
    },
    // Enable advanced optimizations
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: mode !== 'production'
  }
}));
