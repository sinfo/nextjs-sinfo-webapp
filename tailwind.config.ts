import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "pick-winner": "scrolling 5s ease-in",
      },
      keyframes: {
        scrolling: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
      },
      colors: {
        sinfo: {
          primary: "#323363",
          secondary: "#A73939",
        },
        blue: {
          DEFAULT: "#024D88",
          dark: "#083D77",
        },
        pink: {
          light: "#B17EC9",
        },
        green: {
          light: "#74C48A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
