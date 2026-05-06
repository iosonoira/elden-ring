// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/i18n'
  ],

  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700, 900],
      styles: ['normal', 'italic'],
    },
    families: [
      { name: 'Cinzel', provider: 'google', weights: [400, 700, 900] },
      { name: 'Noto Serif', provider: 'google', weights: [400, 700], styles: ['normal', 'italic'] },
      { name: 'Lora', provider: 'google', weights: [400, 500], styles: ['normal', 'italic'] },
      { name: 'Manrope', provider: 'google', weights: [300, 400, 600] },
      { name: 'Space Grotesk', provider: 'google', weights: [300, 400, 700] }
    ],
  },

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