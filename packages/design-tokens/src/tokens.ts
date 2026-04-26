export const colors = {
  light: {
    'bg.canvas': '#ffffff',
    'bg.surface': '#fafafa',
    'bg.subtle': '#f4f4f5',
    'border.default': '#e4e4e7',
    'text.primary': '#09090b',
    'text.secondary': '#52525b',
    'text.muted': '#71717a',
    'accent.default': '#0070f3',
    'accent.fg': '#ffffff',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
  },
  dark: {
    'bg.canvas': '#0a0a0a',
    'bg.surface': '#141414',
    'bg.subtle': '#1c1c1f',
    'border.default': '#27272a',
    'text.primary': '#fafafa',
    'text.secondary': '#a1a1aa',
    'text.muted': '#71717a',
    'accent.default': '#3b82f6',
    'accent.fg': '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ['"Geist Sans"', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '3rem',
    '5xl': '4rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  '0': '0',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
} as const;

export const radius = {
  none: '0',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const motion = {
  duration: {
    micro: '100ms',
    normal: '200ms',
    large: '320ms',
  },
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;
