export default {
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
}
