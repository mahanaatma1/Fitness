import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Define proxy configuration based on environment
  const proxy = {
    '/api': {
      target: env.VITE_BACKEND_URL || 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    },
  };
  
  // Only use proxy in development mode
  if (mode === 'development') {
    if (env.REACT_APP_API_URL) {
      proxy['/uploads'] = env.REACT_APP_API_URL;
    }
  }
  
  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT || 5173,
      proxy: proxy
    },
    optimizeDeps: {
      include: ["chartjs-adapter-date-fns"],
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      // Add environment variables for production
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            chart: ['chart.js', 'chartjs-adapter-date-fns'],
          }
        }
      }
    },
    // Define environment variables for client-side code
    define: {
      'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL)
    }
  };
});
