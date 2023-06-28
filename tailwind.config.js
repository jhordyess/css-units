/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        classy: {
          base: '#cad2c5',
          primary: '#40493b',
          secondary: '#9cb190',
          background: '#b0d6e0',
          accent: '#7b9fa9'
        }
      }
    }
  },
  plugins: []
}
