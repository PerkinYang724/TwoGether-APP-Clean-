import type { Config } from 'tailwindcss'
export default {
    content: ['index.html', 'src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                surface: '#0b1220',
                primary: '#0ea5e9',
            },
        },
    },
    plugins: [],
} satisfies Config
