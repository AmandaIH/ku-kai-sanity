// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  // Nuxt 4 defaults to server
  ssr: true,
  
  // Ensure proper routing
  router: {
    options: {
      strict: false
    }
  },


  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Safari development server fixes
  devServer: {
    https: false, // Disable HTTPS for localhost to fix Safari SSL issues
    host: 'localhost', // Keep localhost - we'll fix Safari another way
    port: 3000
  },

  // Safari CSS loading fixes
  experimental: {
    // Ensure CSS is properly loaded in Safari
    payloadExtraction: false,
  },

  // Ensure proper CSS handling for Safari
  vite: {
    css: {
      devSourcemap: true,
    },
    server: {
      // Safari localhost fixes - explicitly use HTTP
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
        clientPort: 3000
      },
      // Ensure proper headers for Safari
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
    // Ensure CSS is properly processed
    build: {
      cssCodeSplit: false, // Keep CSS in one file for Safari compatibility
    },
    // Vite plugin to fix HTTPS URLs in development
    plugins: process.env.NODE_ENV === 'development' ? [
      {
        name: 'fix-https-urls',
        transformIndexHtml(html: string) {
          return html
            .replace(/https:\/\/localhost:3000/g, 'http://localhost:3000')
            .replace(/https:\/\/localhost/g, 'http://localhost');
        },
        transform(code: string, id: string) {
          if (id.includes('localhost') && code.includes('https://localhost')) {
            return code
              .replace(/https:\/\/localhost:3000/g, 'http://localhost:3000')
              .replace(/https:\/\/localhost/g, 'http://localhost');
          }
        }
      }
    ] : [],
  },

         // Content Security Policy for Safari compatibility
         // Note: CSP headers should be configured at the server level


         app: {
           // Force HTTP base URL in development for Safari - use relative path, not absolute
           baseURL: '/',
           // ============================================
           // PAGE TRANSITIONS - Choose your effect!
           // ============================================
    
    // Default smooth transition (currently active)
    pageTransition: { 
      name: 'page', 
      mode: 'out-in',
      appear: true
    },
    
    // Alternative transitions - uncomment to use:
    
    // Slide transition (horizontal slide effect)
    // pageTransition: { name: 'slide', mode: 'out-in', appear: true },
    
    // Fade transition (simple opacity fade)
    //  pageTransition: { name: 'fade', mode: 'out-in', appear: true },
    
    // Scale transition (zoom in/out effect)
    // pageTransition: { name: 'scale', mode: 'out-in', appear: true },
    
    // Flip transition (3D flip effect)
    // pageTransition: { name: 'flip', mode: 'out-in', appear: true },
    
    // Blur transition (blur in/out effect)
    // pageTransition: { name: 'blur', mode: 'out-in', appear: true },
    
    // ============================================
    // LAYOUT TRANSITIONS
    // ============================================
    layoutTransition: { 
      name: 'layout', 
      mode: 'out-in' 
    },
    head: {
        title: 'Checkmate Nuxt 4 Template',
        htmlAttrs: {
            lang: 'en',
            prefix: 'og: http://ogp.me/ns#'
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'},
            {key: 'description', name: 'description', content: ''},
                   // Safari-specific meta tags
                   {name: 'format-detection', content: 'telephone=no'},
                   {name: 'mobile-web-app-capable', content: 'yes'},
                   {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
        ],
        link: [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Irish+Grover&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap' },
            // Favicons
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
            { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
            { rel: 'manifest', href: '/favicon/site.webmanifest' }
        ]
    },
},

  runtimeConfig: {
    // Flowmate.
    flowmate: {
      licenseKey: process.env.NUXT_FLOWMATE_LICENSE_KEY,
      firebase: {
        apiKey: process.env.NUXT_FLOWMATE_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_FLOWMATE_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NUXT_FLOWMATE_FIREBASE_DATABASE_URL,
        projectId: process.env.NUXT_FLOWMATE_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_FLOWMATE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_FLOWMATE_FIREBASE_MESSAGE_SENDER_ID,
        appId: process.env.NUXT_FLOWMATE_FIREBASE_APP_ID,
      }
    },
           // Private keys (only available on server-side)
           sanity: {
             projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'g90bn5yd',
             dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
             apiVersion: process.env.SANITY_STUDIO_API_VERSION || 'v2025-07-24',
           },
    public: {
      // Public keys (available on both server and client)
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      sanity: {
        projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'g90bn5yd',
        dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
        apiVersion: process.env.SANITY_STUDIO_API_VERSION || 'v2025-07-24',
      },
      flowmate: {
        enabled: process.env.NUXT_PUBLIC_FLOWMATE_ENABLED === 'true',
      },
    }
  },

  // Nuxt 4 proxy headers configuration
  nitro: {
    experimental: {
      wasm: true
    },
    // Disable prerendering during build to avoid API call failures
    prerender: {
      crawlLinks: false,
      routes: []
    },
    // Safari localhost fixes
    devServer: {
      watch: []
    },
    // Ensure proper headers for Safari
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      },
      // Catch all CSS files (root level and _nuxt directory)
      '/*.css': {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/_nuxt/**/*.css': {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/_nuxt/**/*.js': {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/_nuxt/**/*.mjs': {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/*.js': {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/*.mjs': {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/flags/**': {
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      }
    }
  },

  modules: [
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/sitemap', 
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  i18n: {
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NUXT_PUBLIC_SITE_URL,
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-GB', name: 'English', dir: 'ltr', file: 'en.js' },
    ],
    langDir: 'lang',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    skipSettingLocaleOnNavigate: false,
    trailingSlash: false,
    compilation: {
      strictMessage: false,
    },
  },



  // sitemap: {
  //     sources: ['/api/sitemap']
  // },

         site: {
             url: process.env.NUXT_PUBLIC_SITE_URL || 'https://kukai-ramen.vercel.app',
             trailingSlash: true,
         },
         // Trigger rebuild for Vercel deployment

  components: [
      {
          path: '~/components', // will get any components nested in let's say /components/test too
          pathPrefix: false,
      },
  ],

  css: [
      // All styles except Flowmate styles.
      '@/assets/scss/style.scss',
  ],


})