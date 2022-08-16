module.exports = {
  content: ['./public/**/*.html', './src/**/*.{astro,js,jsx,ts,tsx,vue}'],
  mode: 'jit',
  theme: {
    fontFamily: {
      sans: ['Polysans', 'sans-serif'],
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '1rem',
      base: '1.1875rem',
      lg: '1.125rem',
      xl: '1.135rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.35rem',
      '5xl': '3.0rem',
      '6xl': '4.0rem',
      '7xl': '5.0rem',
    },
  },
};
