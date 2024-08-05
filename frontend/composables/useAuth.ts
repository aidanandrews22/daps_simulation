// composables/useAuth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'

export const useAuth = () => {
  const { $fire } = useNuxtApp()
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const signUp = async (email: string, password: string, role: string) => {
    try {
      console.log($fire.auth, email, password)
      const userCredential = await createUserWithEmailAndPassword($fire.auth, email, password)
      user.value = { ...userCredential.user, role }
      return user.value
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword($fire.auth, email, password)
      user.value = userCredential.user
      const role = userCredential.user.displayName
      user.value = { ...userCredential.user, role }
      return user.value
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut($fire.auth)
      user.value = null
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    }
  }

  onAuthStateChanged($fire.auth, (firebaseUser) => {
    user.value = firebaseUser
  })

  return {
    user,
    isAuthenticated,
    signUp,
    login,
    logout,
  }
}
