import type { Config } from 'tailwindcss';
import { motion, radius, spacing, typography } from './tokens.js';

const preset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        border: 'var(--border-default)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        accent: {
          DEFAULT: 'var(--accent-default)',
          fg: 'var(--accent-fg)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: [...typography.fontFamily.sans],
        mono: [...typography.fontFamily.mono],
      },
      fontSize: { ...typography.fontSize },
      fontWeight: { ...typography.fontWeight },
      spacing: { ...spacing },
      borderRadius: { ...radius },
      transitionDuration: {
        micro: motion.duration.micro,
        DEFAULT: motion.duration.normal,
        large: motion.duration.large,
      },
      transitionTimingFunction: {
        out: motion.easing.out,
        in: motion.easing.in,
      },
    },
  },
};

export default preset;
