export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@tresjs/nuxt",
    '@vueuse/nuxt',
    "@nuxtjs/sanity",
  ],
  sanity: {
    projectId: "6xxv1w90",
		apiVersion: '2022-03-25',
    useCdn: false,
  },
})