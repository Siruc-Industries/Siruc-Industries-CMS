// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  builder: 'vite',
    app: {
    head: {
      title: 'CMS - Siruć Ind',
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'We make websites' },
        { charset: 'utf-8' },
        { property: 'og:title', content: 'CMW for Siruc Ind Web' },
        { property: 'og:image', content: ' !add https image !' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '~/assets/styles/main.scss',
    'element-plus/theme-chalk/dark/css-vars.css',
  ],
  modules: ['@element-plus/nuxt'],
})