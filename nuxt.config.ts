// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
  // Build configuration
  build: {
    transpile: ['@nuxt/ui']
  },
  
  // Disable import protection for @nuxt/ui module (known issue)
  experimental: {
    importProtection: false
  },
  
  vite: {
    define: {
      'process.env.NUXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jnmanmirtzvjzxftmfiv.supabase.co'),
      'process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpubWFubWlydHp2anp4ZnRtZml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzA4NjksImV4cCI6MjA3NjQ0Njg2OX0.OH-mq_e2ViNi82edAucHq20pH1aYkTwGo9U2jZ8OBSg'),
    },
    resolve: {
      alias: {
        '#app-manifest': resolve(process.cwd(), '.nuxt/manifest/meta/app-manifest.mjs'),
        '~/types': resolve(process.cwd(), 'types'),
        '@': resolve(process.cwd(), '.'),
        '@/types': resolve(process.cwd(), 'types')
      }
    },
    plugins: [
      {
        name: 'ensure-app-manifest',
        buildStart() {
          const fs = require('node:fs')
          const path = require('node:path')
          const mjsPath = path.join(process.cwd(), '.nuxt/manifest/meta/app-manifest.mjs')
          const manifestDir = path.dirname(mjsPath)
          
          if (!fs.existsSync(manifestDir)) {
            fs.mkdirSync(manifestDir, { recursive: true })
          }
          
          if (!fs.existsSync(mjsPath)) {
            fs.writeFileSync(mjsPath, 'export default {}')
          }
        }
      }
    ],
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173
      }
    },
    css: {
      devSourcemap: true
    },
    // Optimize bundle size with code splitting
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'supabase': ['@supabase/supabase-js'],
            'vue-vendor': ['vue', 'vue-router']
          }
        }
      },
      chunkSizeWarningLimit: 1000 // Warn if chunks exceed 1MB
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { 
    enabled: false
  },
  
  // Fix hydration issues - use ClientOnly for components that differ between server/client
  ssr: true,
  
  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Disable payload extraction for better performance
    viewTransition: true // Enable view transitions for better UX
  },
  
  // Code splitting and lazy loading
  routeRules: {
    // Public pages - no SSR needed
    '/': { ssr: false, prerender: true },
    '/**': { ssr: false }, // Client-only for menu pages
    // Auth pages - client-only
    '/auth/**': { ssr: false },
    // Dashboard pages - SSR for better SEO (if needed)
    '/dashboard/**': { ssr: false },
    // Super admin pages - client-only to ensure Supabase client works properly
    '/super/**': { ssr: false }
  },
  
  nitro: {
    // Vercel preset for optimal deployment
    preset: 'vercel',
    // Fix CSS MIME type issues - ensure CSS files are served with correct content-type
    publicAssets: [
      {
        baseURL: '/_nuxt/',
        dir: '.nuxt/dist/client',
        maxAge: 31536000
      }
    ],
    // Minify server code
    minify: true,
    // Compress responses
    compressPublicAssets: true,
    // Vercel-specific settings
    vercel: {
      functions: {
        'server/**/*.mjs': {
          maxDuration: 30
        }
      }
    }
  },
  
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/icon'
  ],
  
  css: ['~/styles/main.css', '~/styles/tokens.css'],
  
  ui: {
    primary: 'brand',
    gray: 'ink',
  },
  
  runtimeConfig: {
    public: {
      appName: 'MenuX',
      cdnBase: '',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    }
  },
  
  typescript: { 
    strict: true,
    tsconfig: {
      include: ['**/*.ts', '**/*.tsx', '**/*.vue']
    }
  },
  
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jnmanmirtzvjzxftmfiv.supabase.co',
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpubWFubWlydHp2anp4ZnRtZml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzA4NjksImV4cCI6MjA3NjQ0Njg2OX0.OH-mq_e2ViNi82edAucHq20pH1aYkTwGo9U2jZ8OBSg',
    redirect: false, // Disable automatic redirects - we handle them manually in middleware
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: [
        '/',
        '/demo',
        // Exclude all menu routes (single segment routes that aren't protected)
        (path: string) => {
          const pathSegments = path.split('/').filter(Boolean)
          const protectedPaths = ['/dashboard', '/super', '/admin', '/auth']
          const isProtected = protectedPaths.some(p => path.startsWith(p))
          // If it's a single segment route (like /main, /drinks) and not protected, exclude it
          return pathSegments.length === 1 && !isProtected
        }
      ]
    }
  },
  
  components: {
    dirs: [
      { path: '~/components/primitives', pathPrefix: false },
      { path: '~/components/patterns', pathPrefix: false },
      { path: '~/components/ads', pathPrefix: false },
      { path: '~/components/menu-templates', pathPrefix: false },
      { path: '~/components', pathPrefix: false }
    ]
  },
  
  hooks: {
    'build:before': () => {
      // Ensure app-manifest exists before build starts
      const fs = require('node:fs')
      const path = require('node:path')
      const mjsPath = path.join(process.cwd(), '.nuxt/manifest/meta/app-manifest.mjs')
      const manifestDir = path.dirname(mjsPath)
      const manifestPath = path.join(process.cwd(), '.nuxt/manifest/meta/dev.json')
      
      if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true })
      }
      
      try {
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          const mjsContent = `export default ${JSON.stringify(manifest)}`
          fs.writeFileSync(mjsPath, mjsContent)
        } else if (!fs.existsSync(mjsPath)) {
          fs.writeFileSync(mjsPath, 'export default {}')
        }
      } catch (e) {
        if (!fs.existsSync(mjsPath)) {
          fs.writeFileSync(mjsPath, 'export default {}')
        }
      }
    },
    'ready': () => {
      // Sync manifest to mjs file for Vite import
      const fs = require('node:fs')
      const path = require('node:path')
      const manifestPath = path.join(process.cwd(), '.nuxt/manifest/meta/dev.json')
      const mjsPath = path.join(process.cwd(), '.nuxt/manifest/meta/app-manifest.mjs')
      
      // Ensure directory exists
      const manifestDir = path.dirname(mjsPath)
      if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true })
      }
      
      try {
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          const mjsContent = `export default ${JSON.stringify(manifest)}`
          fs.writeFileSync(mjsPath, mjsContent)
        } else {
          // Create empty manifest if dev.json doesn't exist yet
          fs.writeFileSync(mjsPath, 'export default {}')
        }
      } catch (e) {
        // Create empty manifest on error
        try {
          fs.writeFileSync(mjsPath, 'export default {}')
        } catch (writeError) {
          // Ignore write errors
        }
      }
      
      // Create missing tsconfig files if they don't exist
      try {
        const tsconfigPath = path.join(process.cwd(), '.nuxt/tsconfig.json')
        const requiredFiles = [
          'tsconfig.app.json',
          'tsconfig.node.json',
          'tsconfig.shared.json'
        ]
        
        if (fs.existsSync(tsconfigPath)) {
          requiredFiles.forEach(file => {
            const targetPath = path.join(process.cwd(), `.nuxt/${file}`)
            if (!fs.existsSync(targetPath)) {
              fs.copyFileSync(tsconfigPath, targetPath)
            }
          })
        }
      } catch (e) {
        // Ignore errors
      }
    },
    'build:before': () => {
      // Ensure tsconfig files exist before build
      const fs = require('node:fs')
      const path = require('node:path')
      
      try {
        const tsconfigPath = path.join(process.cwd(), '.nuxt/tsconfig.json')
        const requiredFiles = [
          'tsconfig.app.json',
          'tsconfig.node.json',
          'tsconfig.shared.json'
        ]
        
        if (fs.existsSync(tsconfigPath)) {
          requiredFiles.forEach(file => {
            const targetPath = path.join(process.cwd(), `.nuxt/${file}`)
            if (!fs.existsSync(targetPath)) {
              fs.copyFileSync(tsconfigPath, targetPath)
            }
          })
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }
})
