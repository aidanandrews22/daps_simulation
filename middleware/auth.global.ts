import { useFirestore } from '~/composables/useFirestore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $firebase } = useNuxtApp()
  const { userInfo } = useAuth()
  const currentUser = $firebase.auth.currentUser
  const { getDocuments } = useFirestore()

  const patientDocs = ref(null)
  const patientDoc = ref(null)

  console.log('Middleware started', { currentUser, userInfo: userInfo.value, to: to.path })

  // Prevent infinite loop by allowing access to /emptyUser
  if (to.path === '/emptyUser') {
    console.log('Allowing access to /emptyUser')
    return
  }

  try {
    if (currentUser) {
      patientDocs.value = await getDocuments('patients')
      console.log('Patient docs fetched', patientDocs.value)
    }
  } catch (err) {
    console.error('Error fetching patient docs:', err)
    throw new Error(err.message)
  }

  if (patientDocs.value && userInfo.value) {
    patientDoc.value = patientDocs.value.find((doc) => doc.firstName == userInfo.value.name && doc.lastName == userInfo.value.surname)
    console.log('Patient doc found', patientDoc.value)
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
  console.log('User role:', userInfo.value?.role)
  if (userInfo.value) {
    switch (userInfo.value.role) {
      case 'surgeon':
        console.log('Surgeon accessing page')
        break
      case 'designer':
        if (to.path === '/patients/add') {
          console.log('Designer attempted to access /patients/add')
          return navigateTo('/')
        }
        break
      case 'patient':
        console.log('Patient role detected')
        if (patientDoc.value) {
          console.log('Patient doc exists', patientDoc.value.id)
          if (to.path !== `/patients/${patientDoc.value.id}`) {
            console.log(`Redirecting patient to their page: /patients/${patientDoc.value.id}`)
            return navigateTo(`/patients/${patientDoc.value.id}`)
          }
        } else {
          console.log('No patient doc found, redirecting to /emptyUser')
          return navigateTo('/emptyUser')
        }
        break
      default:
        console.log('Unknown role:', userInfo.value.role)
    }
  }

  console.log('Middleware completed without redirects')
})
