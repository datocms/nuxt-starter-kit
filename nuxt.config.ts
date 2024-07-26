// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/datocms/nextjs-starter-kit/src/app/global.css',
        },
      ],
    },
  },
  runtimeConfig: {
    // set by NUXT_DATOCMS_CMA_TOKEN env variable
    datocmsCmaToken: '',
    // set by NUXT_DATOCMS_DRAFT_CONTENT_CDA_TOKEN env variable
    datocmsDraftContentCdaToken: '',
    // set by NUXT_SECRET_API_TOKEN env variable
    secretApiToken: '',
    // set by NUXT_SIGNED_COOKIE_JWT_SECRET env variable
    signedCookieJwtSecret: '',

    public: {
      // set by NUXT_PUBLIC_DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN env variable
      datocmsPublishedContentCdaToken: '',
      // set by NUXT_PUBLIC_DRAFT_MODE_COOKIE_NAME env variable
      draftModeCookieName: '',
    },
  },
  routeRules: {
    // Add cors headers on API routes
    '/api/**': { cors: true },
  },
});
