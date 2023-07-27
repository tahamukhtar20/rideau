/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dbc394",
        "primary-dark": "#b6a27b",
        secondary: "#343434",
      },
      fontFamily: {
        primary: "OpenSans-Regular",
        secondary: "OpenSans-ExtraBold",
        tertiary: "PublicSans-Regular",
        quaternary: "Radley-Regular",
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("daisyui")],
};
