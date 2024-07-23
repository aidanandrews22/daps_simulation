// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetIcons({}), presetUno(), presetAttributify()],
  theme: {
    colors: {
      primary: '#b78d4a',
    },
  },
})
