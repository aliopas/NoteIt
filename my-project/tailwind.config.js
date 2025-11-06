/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
              primary: "#37666d",
              "background-light": "#f6f7f7",
              "background-dark": "#161b1c",
            },
            fontFamily: {
              display: ["Inter"],
            },
            borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      
    },
  },
  plugins: [],
}
