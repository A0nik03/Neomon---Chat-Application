import daisyui from 'daisyui';
import { THEMES } from './src/constants';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui:{
    themes: THEMES
  }
}

