/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // Para seus arquivos dentro da pasta 'app' (Expo Router)
    "./src/**/*.{js,jsx,ts,tsx}", // Se você usa uma pasta 'src' para componentes, hooks, etc.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

