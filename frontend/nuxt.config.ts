import { defineNuxtConfig } from 'nuxt/config'

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
      googleMapsApiKey: '',
      firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: '',
      },
    },
  },
  plugins: ['~/plugins/firebase-manual.ts'],
})
