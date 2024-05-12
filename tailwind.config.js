/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}','!./src/views/ArWorld/index.vue'], // 排除的文件],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('postcss-import'),
  require('tailwindcss/nesting'),
  require('autoprefixer'),
  require('tailwindcss'),]
}

