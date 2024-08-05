import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const apps = getApps()
  const firebaseApp = apps.length === 0 ? initializeApp(config.public.firebase) : apps[0]
  const auth = getAuth(firebaseApp)
  const firestore = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  nuxtApp.provide('firebase', { firebaseApp, auth, firestore, storage })
})
