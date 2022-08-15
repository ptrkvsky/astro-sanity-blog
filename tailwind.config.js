module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{astro,js,jsx,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Polysans', 'sans-serif'],
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1.5rem',
      lg: '1.625rem',
      xl: '1.75rem',
      '2xl': '2rem',
      '3xl': '2.375rem',
      '4xl': '2.75rem',
      '5xl': '3.5rem',
      '6xl': '4.5rem',
      '7xl': '5.5rem',
    },
  },
};
