import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Let Vite handle dependency optimization automatically
    force: mode === 'development',
  },
  build: {
    minify: 'esbuild',
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        format: 'es',
        // Optimized manual chunking for better performance
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // Router and navigation
          'router': ['react-router-dom'],
          // Animation libraries
          'animation': ['framer-motion'],
          // UI components
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Form libraries
          'form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Utility libraries
          'utils': ['date-fns', 'nanoid'],
          // Markdown processing (heavy)
          'markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight'],
        }
      }
    },
    cssCodeSplit: true, // Enable CSS code splitting for better performance
    assetsInlineLimit: 2048, // Reduced for better caching
    sourcemap: mode !== 'production',
    // Additional optimizations
    chunkSizeWarningLimit: 1000,
  }
}));
