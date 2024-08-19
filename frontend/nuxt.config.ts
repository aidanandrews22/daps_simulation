import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
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

  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      },
    },
  },

  plugins: ['~/plugins/firebase-manual.ts', '~/plugins/google-maps.client.ts'],
  compatibilityDate: '2024-08-18',
})