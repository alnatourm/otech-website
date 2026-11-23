import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        otech: {
          blue: {
            50: '#EEF4FF',
            100: '#DBE7FE',
            200: '#BFD3FE',
            300: '#92B8FD',
            400: '#6093FA',
            500: '#3A58AE', // Core brand blue extracted from logo
            600: '#284496',
            700: '#1E3378',
            800: '#1A295C',
            900: '#152044',
            950: '#0C1226',
          },
          cyan: {
            50: '#ECFEFF',
            100: '#CFFAFE',
            200: '#A5F3FC',
            300: '#67E8F9',
            400: '#3FC0DF', // Electric cyan circuit accent from logo
            500: '#06B6D4',
            600: '#0891B2',
            700: '#0E7490',
            800: '#155E75',
            900: '#164E63',
            950: '#082F49',
          },
          dark: {
            950: '#050814', // Deepest background canvas
            900: '#0B1120', // Card and navbar backdrop
            850: '#0F172A', // Elevated container
            800: '#17233D', // Hover surface
            700: '#1E293B', // Border / separator
            600: '#334155',
          },
        },
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        tajawal: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -4px rgba(63, 192, 223, 0.45)',
        'glow-cyan-lg': '0 0 45px -5px rgba(63, 192, 223, 0.55)',
        'glow-blue': '0 0 35px -5px rgba(58, 88, 174, 0.5)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gradient-hero': 'radial-gradient(circle at 50% 0%, rgba(63, 192, 223, 0.18) 0%, rgba(58, 88, 174, 0.12) 40%, transparent 70%)',
        'circuit-grid': 'linear-gradient(to right, rgba(63, 192, 223, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(63, 192, 223, 0.05) 1px, transparent 1px)',
        'gradient-cyan-blue': 'linear-gradient(135deg, #3FC0DF 0%, #3A58AE 100%)',
        'gradient-button': 'linear-gradient(135deg, #3FC0DF 0%, #284496 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(63, 192, 223, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(63, 192, 223, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
