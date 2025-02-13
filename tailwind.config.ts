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
          primary: "#323363",
          secondary: "#A8381B",
          tertiary: "#DB836E",
          quaternary: "#E0B485",
        },
      },
    },
  },
  plugins: [],
};

export default config satisfies Config;
