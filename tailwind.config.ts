import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      zIndex: {
        60: "60",
      },
      maxWidth: {
        105: "420px",
      },
    },
  },
  plugins: [],
};

export default config;