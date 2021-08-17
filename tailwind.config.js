module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        '2xl-white': '0 25px 50px 0 rgba(255, 255, 255, 0.25)',
      },
      fontFamily: {
        'player': ['Montserrat', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
