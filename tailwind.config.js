module.exports = {
  content: ['./public/**/*.html', './src/**/*.{astro,js,jsx,ts,tsx,vue}'],
  mode: 'jit',
  theme: {
    fontFamily: {
      sans: ['Polysans', 'sans-serif'],
    },
    extend: {
      fontSize: {
        '6xl': ['4rem', { lineHeight: '1.2' }], // 4rem correspond à la taille de text-6xl, modifie lineHeight ici
        '4xl': ['2.25rem', { lineHeight: '1.3' }], // line-height personnalisé pour text-4xl
        '3xl': ['1.875rem', { lineHeight: '1.4' }], // 4rem correspond à la taille de text-6xl, modifie lineHeight ici
      },
    },
  },
};
