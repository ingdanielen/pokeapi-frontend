/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'kinetika': ['Kinetika', 'system-ui', 'sans-serif'],
        'kinetika-ultra': ['Kinetika Ultra', 'Kinetika', 'system-ui', 'sans-serif'],
        'kinetika-book': ['Kinetika Book', 'Kinetika', 'system-ui', 'sans-serif'],
        'kinetika-semi': ['Kinetika Semi', 'Kinetika', 'system-ui', 'sans-serif'],
        'sans': ['Kinetika', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 