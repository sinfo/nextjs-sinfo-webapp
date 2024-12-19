import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
