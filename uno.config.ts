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
    animation: {
      keyframes: {
        'fade-out': '{from{opacity:1}to{opacity:0}}',
        'fade-in': '{from{opacity:0}to{opacity:1}}',
      },
      durations: {
        'fade-out': '2s',
        'fade-in': '2s',
      },
      timingFns: {
        'fade-out': 'ease-in-out',
        'fade-in': 'ease-in-out',
      },
      counts: {
        'fade-out': '1',
        'fade-in': '1',
      },
    },
  },
  transformers: [transformerDirectives()],
})