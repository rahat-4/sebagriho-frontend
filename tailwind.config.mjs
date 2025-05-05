/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        ovo: ["Ovo", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         "caret-blink": {
//           "0%,70%,100%": { opacity: "1" },
//           "20%,50%": { opacity: "0" },
//         },
//       },
//       animation: {
//         "caret-blink": "caret-blink 1.25s ease-out infinite",
//       },
//     },
//   },
// };
