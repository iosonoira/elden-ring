// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/i18n'
  ],

  // Global SCSS: variabili e mixin disponibili in ogni componente scoped
  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Inietta le variabili e i mixin senza bisogno di @use in ogni file
          additionalData: `
            @use "~/assets/scss/abstracts/_variables.scss" as *;
            @use "~/assets/scss/abstracts/_mixins.scss" as *;
          `
        }
      }
    }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'it', language: 'it-IT', file: 'it.json' },
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: '../locales/',
  }
})