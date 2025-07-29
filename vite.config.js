// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Include .jsx files
      include: "**/*.{jsx,js}",
    })
  ],
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@store': resolve(__dirname, './src/store'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
    }
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
    // Proxy API requests to backend if needed
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          charts: ['recharts'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },

  // Environment variables
  define: {
    // Make environment variables available
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'recharts'
    ]
  },

  // SSR configuration
  ssr: {
    // External dependencies for SSR
    external: ['@mui/material', '@emotion/react', '@emotion/styled'],
    // Dependencies to bundle for SSR
    noExternal: ['@mui/lab']
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    open: true
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // JSON configuration
  json: {
    namedExports: true,
    stringify: false
  },

  // Worker configuration
  worker: {
    format: 'es'
  },

  // Base public path
  base: '/',

  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],

  // ESBuild configuration
  esbuild: {
    target: 'es2020',
    format: 'esm',
    logLevel: 'error'
  }
})