/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores esperadas pelo shadcn/ui (mapeadas para CSS vars definidas em src/index.css)
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        card: 'oklch(var(--card))',
        'card-foreground': 'oklch(var(--card-foreground))',
        popover: 'oklch(var(--popover))',
        'popover-foreground': 'oklch(var(--popover-foreground))',
        primary: 'oklch(var(--primary))',
        'primary-foreground': 'oklch(var(--primary-foreground))',
        secondary: 'oklch(var(--secondary))',
        'secondary-foreground': 'oklch(var(--secondary-foreground))',
        muted: 'oklch(var(--muted))',
        'muted-foreground': 'oklch(var(--muted-foreground))',
        accent: 'oklch(var(--accent))',
        'accent-foreground': 'oklch(var(--accent-foreground))',
        destructive: 'oklch(var(--destructive))',
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',

        // Tokens semânticos do documento de identidade (para uso no app)
        'surface-page': 'oklch(var(--background))',
        'surface-card': 'oklch(var(--card))',
        'surface-elevated': 'oklch(var(--popover))',
        'text-primary': 'oklch(var(--foreground))',
        'text-secondary': 'oklch(var(--secondary-foreground))',
        'text-muted': 'oklch(var(--muted-foreground))',
        'accent-primary': 'oklch(var(--primary))',
        'accent-hover': 'oklch(var(--primary))',
        'accent-subtle': 'oklch(var(--primary) / 0.12)',
        'status-success': '#22c55e',
        'status-warning': '#f59e0b',
        'status-error': '#ef4444',

        'border-default': 'oklch(var(--border))',
        'border-subtle': 'oklch(var(--border) / 0.65)',

        // Mantém compatibilidade caso usemos chart tokens do shadcn no futuro
        'chart-1': 'oklch(var(--chart-1))',
        'chart-2': 'oklch(var(--chart-2))',
        'chart-3': 'oklch(var(--chart-3))',
        'chart-4': 'oklch(var(--chart-4))',
        'chart-5': 'oklch(var(--chart-5))',
      },
    },
  },
  plugins: [],
}

