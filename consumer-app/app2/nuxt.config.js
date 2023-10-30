// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    app: {
      auth: {
        clientId: process.env.AUTH_CLIENT_ID,
        callback: process.env.AUTH_CALLBACK_URL,
        authServer: process.env.AUTH_DOMAIN,
        tokenKey: '_atk'
      }
    }
  }
})
