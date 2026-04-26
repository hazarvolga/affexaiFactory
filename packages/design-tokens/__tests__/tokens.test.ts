import { describe, expect, it } from 'vitest';
import { colors, radius, spacing, tailwindPreset, typography } from '../src/index.js';

describe('design tokens', () => {
  it('exports light + dark color sets with the same keys', () => {
    expect(Object.keys(colors.light)).toEqual(Object.keys(colors.dark));
  });

  it('exports a tailwind preset extending theme', () => {
    expect(tailwindPreset.theme?.extend).toBeDefined();
    expect(tailwindPreset.darkMode).toEqual(['class', '[data-theme="dark"]']);
  });

  it('uses 4px spacing base scale', () => {
    expect(spacing['1']).toBe('0.25rem');
    expect(spacing['4']).toBe('1rem');
  });

  it('declares standard radius tokens', () => {
    expect(radius.base).toBe('6px');
    expect(radius.md).toBe('8px');
    expect(radius.lg).toBe('12px');
  });

  it('uses Geist as primary sans font', () => {
    expect(typography.fontFamily.sans[0]).toBe('"Geist Sans"');
  });
});
