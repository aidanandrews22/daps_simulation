// plugins/firebase.js
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  }

  const apps = getApps()
  const firebaseApp = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]
  const firestore = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  if (!nuxtApp.hasOwnProperty('$fire')) {
    nuxtApp.$fire = {}
  }

  nuxtApp.$fire.app = firebaseApp
  nuxtApp.$fire.firestore = firestore
  nuxtApp.$fire.storage = storage

  return {
    provide: {
      fire: {
        app: firebaseApp,
        firestore: firestore,
        storage: storage,
      },
    },
  }
})
