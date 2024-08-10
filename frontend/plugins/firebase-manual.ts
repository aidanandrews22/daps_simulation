import { getApps, initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConf = useRuntimeConfig()
  const config = runtimeConf.public.firebase

  // console.log('MY CONFIG', config)

  const apps = getApps()
  const firebaseApp = apps.length === 0 ? initializeApp(config) : apps[0]
  const auth = getAuth(firebaseApp)
  const firestore = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  nuxtApp.provide('firebase', { firebaseApp, auth, firestore, storage })
})
