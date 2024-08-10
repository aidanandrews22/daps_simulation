import { useFirestore } from '~/composables/useFirestore'

// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $firebase } = useNuxtApp()
  const { userInfo } = useAuth()
  const currentUser = $firebase.auth.currentUser

  const { getDocuments } = useFirestore()

  const patientDocs = ref(null)
  const patientDoc = ref(null)

  try {
    if (currentUser) {
      patientDocs.value = await getDocuments('patients')
    }
  } catch (err) {
    throw new Error(err.message)
  }

  if (patientDocs.value && userInfo.value) {
    patientDoc.value = patientDocs.value.find((doc) => doc.name == userInfo.value.firstName && doc.lastname == userInfo.value.lastName)
  }

  // Rule 1: Unauthenticated users can only access /auth
  if (!currentUser && to.path !== '/auth') {
    console.log('Unauthenticated user redirected to /auth')
    return navigateTo('/auth')
  }

  // Rule 2: Authenticated users can't access /auth
  if (currentUser && to.path === '/auth') {
    console.log('Authenticated user redirected from /auth')
    return navigateTo('/')
  }

  // Role-based access control
  console.log(userInfo.value)
  if (userInfo.value) {
    switch (userInfo.value.role) {
      case 'surgeon':
        // Surgeons can access all pages
        break
      case 'designer':
        // Designers can't access /patients/add
        if (to.path === '/patients/add') {
          console.log('Designer attempted to access /patients/add')
          return navigateTo('/')
        }
        break
      case 'patient':
        console.log('hello')
        // Patients can only access their specific page
        if (patientDoc && to.path !== `/patients/${patientDoc.value.id}`) {
          console.log('Patient redirected to their specific page')
          return navigateTo(`/patients/${patientDoc.value.id}`)
        }
        break
    }
  }

  // if (currentUser && to.path !== '/auth' && currentUser.role != 'patient') {
  //   console.log('Redirecting to /')
  //   return navigateTo(`/patients/${patientDoc.value.id}`)
  // }
})
