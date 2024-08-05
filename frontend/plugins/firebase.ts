import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  }

  if (!config) {
    console.error('Firebase configuration is missing.')
    return
  }

  const apps = getApps()
  const firebaseApp = apps.length === 0 ? initializeApp(config) : apps[0]
  const firestore = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)
  const auth = getAuth(firebaseApp)

  if (!nuxtApp.hasOwnProperty('$fire')) {
    nuxtApp.$fire = {}
  }

  nuxtApp.$fire.app = firebaseApp
  nuxtApp.$fire.firestore = firestore
  nuxtApp.$fire.storage = storage
  nuxtApp.$fire.auth = auth

  return {
    provide: {
      fire: {
        app: firebaseApp,
        firestore: firestore,
        storage: storage,
        auth: auth,
      },
    },
  }
})
