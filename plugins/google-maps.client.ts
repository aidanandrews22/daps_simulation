import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  return new Promise<void>((resolve) => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}`
      script.async = true
      script.defer = true
      script.onload = () => {
        resolve()
      }
      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
})