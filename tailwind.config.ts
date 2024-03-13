import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        customFont: ["Protest Riot", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
