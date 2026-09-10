/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bernice: {
          surface: '#FFDAED',
          dark: '#112229',
          red: '#C52828',
          blue: '#147C98',
          mauve: '#C9A1B9',
          pink: '#FFA7EE',
          cream: '#F8F8F2',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['"Apfel Grotezk"', 'system-ui', 'sans-serif'],
        title: ['"Apfel Grotezk"', 'system-ui', 'sans-serif'],
        hero: ['"Apfel Grotezk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '10000px',
        'arch': '500px 500px 80px 80px',
        'arch-top': '500px 500px 0 0',
      },
      transitionTimingFunction: {
        'ulu': 'cubic-bezier(.28, .71, 0, .98)',
      },
    },
  },
  plugins: [],
}
