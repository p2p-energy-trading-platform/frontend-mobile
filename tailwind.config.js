import { Palette } from './src/shared/design-system/tokens/palette.ts';

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
    },
  },
  plugins: [],
};
