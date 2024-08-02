// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  shortcuts: {
    btn: 'border-none text-lg cursor-pointer opacity-70 text-white px-4 py-1 transition-duration-500 transition-all hover:opacity-100',
    'btn-disabled': 'btn opacity-45 hover:opacity-45',
    'btn-primary': 'bg-primary',
    'btn-blue': 'bg-blue-500',
    'btn-danger': 'bg-red-500',
    'btn-success': 'bg-green-500',
    'btn-warning': 'bg-yellow-500',
    'btn-icon': 'flex items-center justify-center gap-1',
  },
  presets: [presetIcons({}), presetUno(), presetAttributify()],
  theme: {
    colors: {
      primary: '#b78d4a',
    },
  },
  transformers: [transformerDirectives()],
})
