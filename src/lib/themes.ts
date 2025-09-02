export type Theme = 'study-zen' | 'forest-focus' | 'night-owl' | 'ocean-breeze' | 'golden-hour'

export interface ThemeConfig {
    name: string
    description: string
    colors: {
        primary: string
        secondary: string
        accent: string
        background: string
        surface: string
        text: string
        textSecondary: string
        border: string
        success: string
        warning: string
        error: string
    }
    animations: {
        background: string
        timer: string
        progress: string
    }
    icon: string
    mood: string
}

export const themes: Record<Theme, ThemeConfig> = {
    'study-zen': {
        name: 'Study Zen',
        description: 'Minimal white space with soft blue accents for ultimate focus',
        mood: 'Calm and focused - perfect for deep concentration',
        colors: {
            primary: '#A855F7', // violet-500 - bright and visible
            secondary: '#0891B2', // cyan-600 - bright and visible
            accent: '#EA580C', // orange-600 - bright and visible
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #334155 100%)', // dark background
            surface: 'rgba(30, 41, 59, 0.95)', // dark surface like night owl
            text: '#F8FAFC', // slate-50 - light text for visibility
            textSecondary: '#E2E8F0', // slate-200 - light secondary text
            border: 'rgba(168, 85, 247, 0.7)', // bright border like night owl
            success: '#0891B2',
            warning: '#EA580C',
            error: '#F87171' // red-400 - bright error color
        },
        animations: {
            background: 'study-zen',
            timer: 'zen-pulse',
            progress: 'smooth-fill'
        },
        icon: '🧘'
    },
    'forest-focus': {
        name: 'Forest Focus',
        description: 'Calming greens inspired by nature to reduce study stress',
        mood: 'Peaceful and refreshing - like studying in a quiet forest',
        colors: {
            primary: '#10B981', // emerald-500 - bright green
            secondary: '#059669', // emerald-600 - bright green
            accent: '#F59E0B', // amber-500 - bright amber
            background: 'linear-gradient(135deg, #064E3B 0%, #022C22 50%, #14532D 100%)', // dark green background
            surface: 'rgba(5, 150, 105, 0.95)', // dark emerald surface
            text: '#F0FDF4', // emerald-50 - light text for visibility
            textSecondary: '#D1FAE5', // emerald-100 - light secondary text
            border: 'rgba(16, 185, 129, 0.7)', // bright emerald border
            success: '#10B981',
            warning: '#F59E0B',
            error: '#F87171' // red-400 - bright error color
        },
        animations: {
            background: 'forest-breeze',
            timer: 'leaf-gentle',
            progress: 'tree-growth'
        },
        icon: '🌿'
    },
    'night-owl': {
        name: 'Night Owl',
        description: 'Dark mode perfection for late-night study sessions',
        mood: 'Cozy and intense - ideal for midnight study marathons',
        colors: {
            primary: '#A855F7', // violet-500 - slightly brighter
            secondary: '#0891B2', // cyan-600 - darker
            accent: '#EA580C', // orange-600 - darker
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
            surface: 'rgba(30, 41, 59, 0.95)', // less transparent for dark theme
            text: '#F8FAFC', // slate-50 - brighter
            textSecondary: '#E2E8F0', // slate-200 - brighter
            border: 'rgba(168, 85, 247, 0.7)', // more noticeable border
            success: '#0891B2',
            warning: '#EA580C',
            error: '#F87171' // red-400 - brighter
        },
        animations: {
            background: 'night-stars',
            timer: 'neon-glow',
            progress: 'neon-flow'
        },
        icon: '🦉'
    },
    'ocean-breeze': {
        name: 'Ocean Breeze',
        description: 'Serene blue tones that calm the mind during intense study',
        mood: 'Tranquil and refreshing - like studying by the ocean',
        colors: {
            primary: '#0EA5E9', // sky-500 - bright blue
            secondary: '#06B6D4', // cyan-500 - bright cyan
            accent: '#8B5CF6', // violet-500 - bright violet
            background: 'linear-gradient(135deg, #0C4A6E 0%, #075985 50%, #155E75 100%)', // dark blue background
            surface: 'rgba(12, 74, 110, 0.95)', // dark blue surface
            text: '#F0F9FF', // sky-50 - light text for visibility
            textSecondary: '#E0F2FE', // sky-100 - light secondary text
            border: 'rgba(14, 165, 233, 0.7)', // bright sky border
            success: '#06B6D4',
            warning: '#F59E0B', // amber-500 - bright warning
            error: '#F87171' // red-400 - bright error color
        },
        animations: {
            background: 'ocean-calm',
            timer: 'wave-gentle',
            progress: 'water-flow'
        },
        icon: '🌊'
    },
    'golden-hour': {
        name: 'Golden Hour',
        description: 'Warm, energizing colors to boost motivation and creativity',
        mood: 'Energetic and inspiring - perfect for creative study sessions',
        colors: {
            primary: '#F97316', // orange-500 - bright orange
            secondary: '#EC4899', // pink-500 - bright pink
            accent: '#FBBF24', // amber-400 - bright amber
            background: 'linear-gradient(135deg, #9A3412 0%, #7C2D12 50%, #C2410C 100%)', // dark orange background
            surface: 'rgba(154, 52, 18, 0.95)', // dark orange surface
            text: '#FFF7ED', // orange-50 - light text for visibility
            textSecondary: '#FFEDD5', // orange-100 - light secondary text
            border: 'rgba(249, 115, 22, 0.7)', // bright orange border
            success: '#10B981', // emerald-500 - bright success
            warning: '#FBBF24',
            error: '#F87171' // red-400 - bright error color
        },
        animations: {
            background: 'golden-glow',
            timer: 'warm-pulse',
            progress: 'sunset-fill'
        },
        icon: '☀️'
    }
}

export function getTheme(theme: Theme): ThemeConfig {
    return themes[theme]
}

export function getAllThemes(): ThemeConfig[] {
    return Object.values(themes)
}

export function getThemeNames(): string[] {
    return Object.keys(themes) as Theme[]
}