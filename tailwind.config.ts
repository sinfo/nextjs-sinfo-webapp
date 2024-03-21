import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",
      blue: "#296CB2",
      green: "#74C48A",
      purple: "#B17EC9",
      greenAC: "#338E2B",
      red: "#E43E3E",
      "dark-blue": "#083D77",
      "light-purple": "#5B58C4",
      gray: "#B4B4B4"
    },
  },
  plugins: [],
};
export default config;
