module.exports = {
  safelist: ['btn-primary','btn-dark','btn-sage','btn-outline','btn-ghost-light','card-dark'],
  content: ['./src/**/*.{ts,tsx}', './assets/*.js'],
  theme: {
    extend: {
      colors: {
        charcoal: '#0E1311', ivory: '#F7F5F0', graphite: '#20252A', sand: '#ECE7DD',
        bronze: { DEFAULT: '#7CBC42', light: '#9DD45F', dark: '#3E7A1F' },
        gold: { DEFAULT: '#F4C430', dark: '#C99A12' },
        sage: { DEFAULT: '#7C8976', light: '#A9B5A2' },
      },
      fontFamily: { display: ['Manrope', 'system-ui', 'sans-serif'], sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
}
