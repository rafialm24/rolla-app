// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Rolla Bakery',
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/rolla-logo.jpg' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui'],
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },
  routeRules: {
    '/api/**': {
      proxy: `${process.env.BACKEND_API_URL || 'https://oneemp.ctmial9mevzk.work'}/**`
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  routeRules: {
    '/api/**': { proxy: (process.env.NUXT_API_TARGET || 'https://oneemp.ctmial9mevzk.work') + '/**' }
  }
})
