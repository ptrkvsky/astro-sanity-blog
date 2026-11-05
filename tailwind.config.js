// Palette Tailwind remappée sur les jetons Épreuve (src/assets/style/epreuve.css), le temps que le blog soit refondu.
// Valeurs en hexadécimal pour que les modificateurs d'opacité (ex. ring-gray-900/10) continuent de fonctionner.
// Les clés d'origine sont conservées : les classes existantes restent lisibles sur le fond sombre.
const PAPER = '#121210';
const SHEET = '#1A1916';
const INK = '#F1EEE6';
const MUTED = '#A6A296';
const HAIR = '#3A3833';
const RED = '#FF5A36';

const accent = {
  50: SHEET,
  100: SHEET,
  200: HAIR,
  300: RED,
  400: RED,
  500: RED,
  600: RED,
  700: RED,
  800: RED,
  900: RED,
};

module.exports = {
  content: ['./public/**/*.html', './src/**/*.{astro,js,jsx,ts,tsx,vue}'],
  mode: 'jit',
  theme: {
    fontFamily: {
      sans: ['var(--f-text)'],
      serif: ['var(--f-display)'],
      mono: ['var(--f-mono)'],
    },
    extend: {
      colors: {
        // Sur le fond sombre, "blanc" est la feuille et le texte "blanc" posé sur l'accent est l'encre de l'épreuve
        white: SHEET,
        black: PAPER,
        gray: {
          50: SHEET,
          100: SHEET,
          200: HAIR,
          300: HAIR,
          400: MUTED,
          500: MUTED,
          600: MUTED,
          700: INK,
          800: INK,
          900: INK,
        },
        indigo: accent,
        purple: accent,
        pink: accent,
      },
      fontSize: {
        '6xl': ['4rem', { lineHeight: '1.2' }], // 4rem correspond à la taille de text-6xl, modifie lineHeight ici
        '4xl': ['2.25rem', { lineHeight: '1.3' }], // line-height personnalisé pour text-4xl
        '3xl': ['1.875rem', { lineHeight: '1.4' }], // 4rem correspond à la taille de text-6xl, modifie lineHeight ici
      },
    },
  },
};
