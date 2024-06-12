// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  head: {
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },
  devtools: { enabled: true },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify", "vuejs3-datepicker"],
  },
  generate: {
    dir: "dist",
  },
  pinia: {
    stores: [{ name: "auth", path: "~/store/auth.js" }],
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
});
