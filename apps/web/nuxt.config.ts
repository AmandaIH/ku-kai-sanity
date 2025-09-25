// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  // Nuxt 4 defaults to server
  ssr: true,

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },


  app: {
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
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {key: 'description', name: 'description', content: ''},
        ],
        link: [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Neue+Montreal:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
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
      projectId: process.env.SANITY_STUDIO_PROJECT_ID,
      dataset: process.env.SANITY_STUDIO_DATASET || 'production',
      apiVersion: process.env.SANITY_STUDIO_API_VERSION || 'v2025-07-24',
    },
    public: {
      // Public keys (available on both server and client)
      sanity: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
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
    }
  },

  modules: [
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/sitemap', 
    '@checkmatecph/flowmate-nuxt-integration',
    '@pinia/nuxt'
  ],



  // sitemap: {
  //     sources: ['/api/sitemap']
  // },

  site: {
      trailingSlash: true,
  },

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