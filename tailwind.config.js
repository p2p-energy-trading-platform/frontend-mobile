import { Palette } from './src/shared/design-system/tokens/palette.ts';
import { FontFamily } from './src/shared/design-system/tokens/typography.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: Palette.navy,
        teal: Palette.teal,
      },
      fontFamily: {
        body: [FontFamily.body],
        'body-medium': [FontFamily.bodyMedium],
        'body-semibold': [FontFamily.bodySemibold],
        'body-bold': [FontFamily.bodyBold],
        mono: [FontFamily.mono],
      },
    },
  },
  plugins: [],
};
