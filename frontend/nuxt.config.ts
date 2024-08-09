dotenv.config({ path: path.resolve(__dirname, './.env') })

import * as dotenv from 'dotenv'
import { defineNuxtConfig } from 'nuxt/config'
import * as path from 'path'

console.log('Firebase config in nuxt.config.ts:', {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... other config values
})

export default defineNuxtConfig({
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
  modules: ['@unocss/nuxt'],
  css: ['./assets/css/main.css'],
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
  // vuefire: {
  //   config: {
  //     apiKey: process.env.FIREBASE_API_KEY,
  //     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  //     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  //     appId: process.env.FIREBASE_APP_ID,
  //     measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  //   },
  // },
  runtimeConfig: {
    googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    MEASUREMENT_ID: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  plugins: ['~/plugins/firebase-manual.ts'],
})
