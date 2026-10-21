import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8FAFC',
          dark: '#030712',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        transit: {
          DEFAULT: '#059669',
          dark: '#10B981',
        },
        alert: {
          DEFAULT: '#D97706',
          dark: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
export default config;
