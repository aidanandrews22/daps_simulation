import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useState } from '#app'

export const useAuth = () => {
  const { $firebase } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const userInfo = useState<{ name: string; surname: string; role: string } | null>('userInfo', () => null)
  const isAuthenticated = computed(() => user.value !== null)
  const errorMessage = useState<string | null>('errorMessage', () => null)
  const isLoading = ref(false)

  const formatFirebaseError = (error: any) => {
    const errorMap: { [key: string]: string } = {
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/email-already-in-use': 'Email is already in use',
      'auth/invalid-email': 'Invalid email address',
      'auth/wrong-password': 'Incorrect password',
      'auth/user-not-found': 'No user found with this email',
      'auth/invalid-credential': 'Either email or password is incorrect',
      // Add other error mappings here
    }

    return errorMap[error.code] || 'An unexpected error occurred. Please try again.'
  }

  const signUp = async (email: string, password: string, role: string, name: string, surname: string) => {
    try {
      isLoading.value = true
      const userCredential = await createUserWithEmailAndPassword($firebase.auth, email, password)
      await updateProfile(userCredential.user, { displayName: role })

      const userData = {
        email,
        role,
        name: name || '',
        surname: surname || '',
      }

      await setDoc(doc($firebase.firestore, 'users', userCredential.user.uid), userData)

      user.value = userCredential.user
      await updateUserInfo()
      return user.value
    } catch (error) {
      console.error('Error signing up:', error)
      errorMessage.value = formatFirebaseError(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      const userCredential = await signInWithEmailAndPassword($firebase.auth, email, password)
      user.value = userCredential.user
      await updateUserInfo()
      return user.value
    } catch (error) {
      console.error('Error logging in:', error)
      errorMessage.value = formatFirebaseError(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      await signOut($firebase.auth)
      user.value = null
      errorMessage.value = null // Clear error message on logout
    } catch (error) {
      console.error('Error logging out:', error)
      errorMessage.value = formatFirebaseError(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateUserInfo = async () => {
    if (user.value) {
      try {
        const userDoc = await getDoc(doc($firebase.firestore, 'users', user.value.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          userInfo.value = {
            name: data.name || '',
            surname: data.surname || '',
            role: data.role || '',
          }
        } else {
          console.log('No user document found')
          userInfo.value = null
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        userInfo.value = null
      }
    } else {
      userInfo.value = null
    }
  }

  const createPatientAccount = async (docId: string, email: string) => {
    // Implement the logic to create a patient account
    // This should include creating a user in Firebase Auth and updating the patient document
    // Return the temporary password
  }

  const completePatientSignUp = async (email: string, newPassword: string) => {
    // Implement the logic to complete patient sign up
    // This should include updating the password and any other necessary information
  }

  onAuthStateChanged($firebase.auth, async (firebaseUser) => {
    user.value = firebaseUser
    if (firebaseUser) {
      await updateUserInfo()
    } else {
      userInfo.value = null
    }
  })

  return {
    user,
    userInfo,
    isAuthenticated,
    errorMessage,
    signUp,
    login,
    logout,
    updateUserInfo,
    isLoading,
    createPatientAccount,
    completePatientSignUp,
  }
}