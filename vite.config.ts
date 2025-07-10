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
        // Simplified chunking - no vendor splitting to avoid initialization issues
        manualChunks: undefined
      }
    },
    cssCodeSplit: false, // Keep CSS together to avoid loading issues
    assetsInlineLimit: 4096,
    sourcemap: mode !== 'production'
  }
}));
