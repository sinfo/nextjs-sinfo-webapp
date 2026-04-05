import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        navbar: "70px",
      },
      colors: {
        sinfo: {
          primary: "#1C2B70",
          secondary: "#BF2C21",
          tertiary: "#F1853A",
          quaternary: "#FCBD14",
        },
      },
    },
  },
  plugins: [],
};

export default config satisfies Config;
