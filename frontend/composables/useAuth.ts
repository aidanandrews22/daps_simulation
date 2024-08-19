import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile, updatePassword, updateEmail } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { useState } from '#app'

export const useAuth = () => {
  const { $firebase } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const userInfo = useState<{ name: string; surname: string; role: string; isTemporaryPassword: boolean } | null>('userInfo', () => null)
  const isAuthenticated = computed(() => user.value !== null)
  const errorMessage = useState<string | null>('errorMessage', () => null)
  const isLoading = ref(false)

  const changePassword = async (newPassword: string) => {
    if (user.value) {
      try {
        await updatePassword(user.value, newPassword)
        await updateDoc(doc($firebase.firestore, 'users', user.value.uid), { isTemporaryPassword: false })
        
        // If the user is a patient, update the patient document as well
        if (userInfo.value?.role === 'patient') {
          const patientQuery = query(collection($firebase.firestore, 'patients'), 
            where('firstName', '==', userInfo.value.name),
            where('lastName', '==', userInfo.value.surname)
          )
          const patientSnapshot = await getDocs(patientQuery)
          if (!patientSnapshot.empty) {
            await updateDoc(doc($firebase.firestore, 'patients', patientSnapshot.docs[0].id), { isTemporaryPassword: false })
          }
        }
        
        await updateUserInfo()
      } catch (error) {
        console.error('Error changing password:', error)
        errorMessage.value = formatFirebaseError(error)
        throw error
      }
    }
  }

  const generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-8)
  }

  const createPatientAccount = async (patientId: string) => {
    try {
      const patientDoc = await getDoc(doc($firebase.firestore, 'patients', patientId))
      if (!patientDoc.exists()) {
        throw new Error('Patient document not found')
      }

      const patientData = patientDoc.data()
      const temporaryPassword = 'daps2024'

      // Update patient document with temporary password and account status
      await updateDoc(doc($firebase.firestore, 'patients', patientId), {
        temporaryPassword,
        accountCreated: true,
        isTemporaryPassword: true,
      })

      // Create user account in Firebase Auth without signing in
      const email = `${patientData.firstName}.${patientData.lastName}@example.com`
      const userCredential = await createUserWithEmailAndPassword($firebase.auth, email, temporaryPassword)
      
      // Immediately sign out the newly created user
      await signOut($firebase.auth)

      // Restore the previous user's session
      if (user.value) {
        await updateUserInfo()
      }

      // Create user document in Firestore
      await setDoc(doc($firebase.firestore, 'users', userCredential.user.uid), {
        email,
        role: 'patient',
        name: patientData.firstName,
        surname: patientData.lastName,
        patientId,
        isTemporaryPassword: true,
      })

      console.log(`Temporary credentials - Name: ${patientData.firstName} ${patientData.lastName}, Password: ${temporaryPassword}`)

      return temporaryPassword
    } catch (error) {
      console.error('Error creating patient account:', error)
      errorMessage.value = formatFirebaseError(error)
      throw error
    }
  }

  const loginWithName = async (firstName: string, lastName: string, password: string) => {
    try {
      isLoading.value = true
      
      // Convert names to lowercase
      firstName = firstName.toLowerCase()
      lastName = lastName.toLowerCase()

      // Query Firestore to find the user with matching first and last name
      const usersRef = collection($firebase.firestore, 'users')
      const q = query(usersRef, where('name', '==', firstName), where('surname', '==', lastName))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('User not found')
      }

      const userData = querySnapshot.docs[0].data()
      
      // Log in using the email associated with the user
      const userCredential = await signInWithEmailAndPassword($firebase.auth, userData.email, password)
      user.value = userCredential.user
      await updateUserInfo()
      return { ...user.value, isTemporaryPassword: userData.isTemporaryPassword }
    } catch (error) {
      console.error('Error logging in:', error)
      errorMessage.value = formatFirebaseError(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

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

  const signUp = async (email: string, password: string, role: string, firstName: string, lastName: string) => {
    try {
      isLoading.value = true
      const userCredential = await createUserWithEmailAndPassword($firebase.auth, email, password)
      await updateProfile(userCredential.user, { displayName: role })

      const userData = {
        email,
        role,
        name: firstName.toLowerCase(),
        surname: lastName.toLowerCase(),
        isTemporaryPassword: false,
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

  onAuthStateChanged($firebase.auth, async (firebaseUser) => {
    user.value = firebaseUser
    if (firebaseUser) {
      await updateUserInfo()
    } else {
      userInfo.value = null
    }
  })

  const completePatientSignUp = async (newEmail: string, newPassword: string) => {
    if (!user.value) {
      throw new Error('No user is currently logged in')
    }

    try {
      isLoading.value = true

      // Update email
      await updateEmail(user.value, newEmail)

      // Update password
      await updatePassword(user.value, newPassword)

      // Update user document in Firestore
      const userDocRef = doc($firebase.firestore, 'users', user.value.uid)
      await updateDoc(userDocRef, {
        email: newEmail,
        isTemporaryPassword: false
      })

      // Update patient document in Firestore
      const patientsRef = collection($firebase.firestore, 'patients')
      const patientQuery = query(patientsRef, where('firstName', '==', userInfo.value?.name), where('lastName', '==', userInfo.value?.surname))
      const patientSnapshot = await getDocs(patientQuery)
      
      if (!patientSnapshot.empty) {
        const patientDocRef = doc($firebase.firestore, 'patients', patientSnapshot.docs[0].id)
        await updateDoc(patientDocRef, {
          email: newEmail,
          isTemporaryPassword: false
        })
      }

      await updateUserInfo()
    } catch (error) {
      console.error('Error completing patient sign up:', error)
      errorMessage.value = formatFirebaseError(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    userInfo,
    isAuthenticated,
    errorMessage,
    signUp,
    loginWithName,
    logout,
    updateUserInfo,
    isLoading,
    createPatientAccount,
    changePassword,
    completePatientSignUp
  }
}