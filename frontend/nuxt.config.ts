import * as dotenv from 'dotenv'
import { assertNuxtCompatibility } from 'nuxt/kit'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

export default {
  head: {
    script: [
      {
        src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap`,
        async: true,
        defer: true,
      },
    ],
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  modules: ['@unocss/nuxt', 'nuxt-vuefire'],
  // css: [
  //   '@/assets/css/main.css', // Your global CSS file
  // ],
  css: [
    './assets/css/main.css', // Your global CSS file
  ],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          'postcss-import': {},
          'unocss/postcss': {},
          autoprefixer: {},
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
  plugins: ['~/plugins/firebase.ts'],
}
