import type { Config } from 'tailwindcss'

export default {
  content: ['index.html', 'src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b1220',
        primary: '#0ea5e9',

        // 🌿 nature palette
        leaf:   '#6BAA75',   // green
        moss:   '#3F6F49',   // deep green
        bark:   '#6B4F3B',   // brown
        soil:   '#1C1A19',   // very dark brown
        sky:    '#CFE9FF',   // pale sky
        water:  '#7CC5E4',   // river blue
        sun:    '#F7D774',   // warm sun
        rock:   '#94A3B8',   // slate
      },
    },
  },
  plugins: [],
} satisfies Config
