// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      env: "",
      video_url: "",
      thumbnail_url: "",
      origin_img_url: ""
    }
  },
})
