import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        titillium: ["'Titillium Web'", "sans-serif"],
        aldrich: ["'Aldrich'", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui:{
    themes: ["wireframe"],
  }
}

//        title: ['"Merriweather"', 'san-serif'],
//         'neue-haas': ['Neue Haas Grotesk', 'sans-serif'],
//         'stardom': ['Stardom', 'sans-serif'],
//         'edu': ['Edu NSW ACT Hand Cursive', 'serif'],