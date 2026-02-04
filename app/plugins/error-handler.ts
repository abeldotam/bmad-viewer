export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, _instance, _info) => {
    console.error('[Vue Error]', error)
  }
})
