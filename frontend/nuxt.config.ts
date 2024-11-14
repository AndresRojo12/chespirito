export default defineNuxtConfig({
  head: {
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "X52qR4e3wz8v8BX-QCQs_OxavQOPJnB79YJPxlrPrqs" },
    ],
  },

  ssr: true,
  target: 'static',
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

  compatibilityDate: "2024-11-02",
});
