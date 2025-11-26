// tailwind.config.js
const withMT = require('@material-tailwind/react/utils/withMT');
import { mtConfig } from '@material-tailwind/react';

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    mtConfig({
      radius: '0',
      fonts: {
        sans: 'Lato',
        serif: 'DM Serif Display',
      },
      colors: {
        primary: {
          default: '#fef08a',
          dark: '#fde047',
          light: '#fef9c3',
          foreground: '#030712',
        },
      },
      darkColors: {
        primary: {
          default: '#5eead4',
          dark: '#2dd4bf',
          light: '#99f6e4',
          foreground: '#030712',
        },
      },
    }),
  ],
});

export default config;
