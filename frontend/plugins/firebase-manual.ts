import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Initializing Firebase plugin')
  console.log('config:', useRuntimeConfig())

  const config = {
    apiKey: useRuntimeConfig().API_KEY,
    authDomain: useRuntimeConfig().AUTH_DOMAIN,
    projectId: useRuntimeConfig().PROJECT_ID,
    storageBucket: useRuntimeConfig().STORAGE_BUCKET,
    messagingSenderId: useRuntimeConfig().MESSAGING_SENDER_ID,
    appId: useRuntimeConfig().APP_ID,
    measurementId: useRuntimeConfig().MEASUREMENT_ID,
  }

  console.log('MY CONFIG', config)

  const apps = getApps()
  const firebaseApp = apps.length === 0 ? initializeApp(config) : apps[0]
  const auth = getAuth(firebaseApp)
  const firestore = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  console.log('Firebase initialized:', { firebaseApp, auth, firestore, storage })
  nuxtApp.provide('firebase', { firebaseApp, auth, firestore, storage })
})
