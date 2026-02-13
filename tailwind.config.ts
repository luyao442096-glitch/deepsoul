import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 可以在这里扩展你的颜色
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // 引入排版插件
  ],
};

export default config;