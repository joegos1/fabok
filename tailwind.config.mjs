/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Firda.nl kleurenschema: donkergroen/teal met geel accent
      colors: {
        firda: {
          // Primair: Donkergroen/teal (header achtergrond)
          blue: {
            50: '#e8eeee',
            100: '#d1dddc',
            200: '#a3bbb9',
            300: '#759996',
            400: '#476773',
            500: '#3B5755', // Firda teal/groen
            600: '#2D4A47', // Firda donkergroen (primair)
            700: '#243b39',
            800: '#1b2c2b',
            900: '#121d1c',
          },
          // Accent: Geel/goud (buttons, highlights)
          green: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#EAB308', // Firda geel (accent)
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          // Neutrale grijstinten
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        },
      },
    },
  },
  plugins: [],
};
