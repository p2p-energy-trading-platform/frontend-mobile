/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#ffffff',
        surfaceAlt: '#f5f5f5',
        border: '#d4d4d4',
        muted: '#525252',
        tint: '#000000',
        text: '#000000',
        icon: '#262626',
        tabIconDefault: '#525252',
        tabIconSelected: '#000000',

        'background-dark': '#000000',
        'surface-dark': '#0a0a0a',
        'surfaceAlt-dark': '#171717',
        'border-dark': '#262626',
        'muted-dark': '#a3a3a3',
        'tint-dark': '#ffffff',
        'text-dark': '#ffffff',
        'icon-dark': '#d4d4d4',
        'tabIconDefault-dark': '#a3a3a3',
        'tabIconSelected-dark': '#ffffff',
      },
    },
  },
  plugins: [],
};
