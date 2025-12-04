/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Firda-achtig kleurenschema: rustige blauw/groentinten
      colors: {
        firda: {
          blue: {
            50: '#e6f2f9',
            100: '#cce5f3',
            200: '#99cbe7',
            300: '#66b1db',
            400: '#3397cf',
            500: '#007dc3', // Primaire kleur
            600: '#00649c',
            700: '#004b75',
            800: '#00324e',
            900: '#001927',
          },
          green: {
            50: '#e6f5f0',
            100: '#ccebe1',
            200: '#99d7c3',
            300: '#66c3a5',
            400: '#33af87',
            500: '#009b69', // Accent groen
            600: '#007c54',
            700: '#005d3f',
            800: '#003e2a',
            900: '#001f15',
          },
          gray: {
            50: '#f8fafb',
            100: '#f1f5f7',
            200: '#e3eaef',
            300: '#d5e0e7',
            400: '#b9c7d1',
            500: '#8fa3b1',
            600: '#6b8292',
            700: '#4e6271',
            800: '#334250',
            900: '#1a212a',
          },
        },
      },
    },
  },
  plugins: [],
};
