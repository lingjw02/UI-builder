/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editor color palette
        editor: {
          bg: '#1e1e2e',
          panel: '#181825',
          surface: '#313244',
          border: '#45475a',
          text: '#cdd6f4',
          'text-muted': '#585b70',
          accent: '#89b4fa',
          'accent-hover': '#74c7ec',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
