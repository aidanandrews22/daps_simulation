import * as dotenv from 'dotenv'
import { assertNuxtCompatibility } from 'nuxt/kit'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY) // Add this line to debug

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
  modules: ['@unocss/nuxt'],
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
  hooks: {
    'build:before': () => {
      console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY)
    },
  },
}
