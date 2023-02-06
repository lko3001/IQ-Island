/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        spaceGrotesk: "var(--spaceGrotesk)",
      },
      boxShadow: {
        solid: "0px 4px 0px 2px black",
        "solid-pressed": "0px 0px 0px 2px black",
      },
    },
  },
  plugins: [],
};
