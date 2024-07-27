// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  shortcuts: {
    'btn-primary': 'border-none text-lg cursor-pointer bg-primary opacity-70 text-white px-4 py-1 transition-duration-500 transition-all hover:opacity-100',
  },
  presets: [presetIcons({}), presetUno(), presetAttributify()],
  theme: {
    colors: {
      primary: '#b78d4a',
    },
  },
  transformers: [transformerDirectives()],
})
