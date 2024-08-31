<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { login, signUp, isAuthenticated, errorMessage, isLoading, completePatientSignUp } = useAuth()

const isLogin = ref(true)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const role = ref('')

const isPatientFirstLogin = ref(false)
const newEmail = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Redirect authenticated users away from the auth page
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  isPatientFirstLogin.value = false
  resetForm()
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  password.value = ''
  role.value = ''
  newEmail.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = null
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
      navigateTo('/')
    } else {
      await signUp(email.value, password.value, role.value, firstName.value, lastName.value)
      navigateTo('/')
    }
  } catch (err) {
    console.error('error', err)
  }
}

const handleCompleteSignUp = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Passwords don't match"
    return
  }
  try {
    await completePatientSignUp(newEmail.value, newPassword.value)
    navigateTo('/')
  } catch (err) {
    console.error('error', err)
  }
}
</script>

<template>
  <div class="page max-w-4xl">
    <div class="form-container">
      <template v-if="!isPatientFirstLogin">
        <h1 class="text-2xl font-bold mb-6">{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
        <button @click="toggleAuthMode" class="btn btn-primary mt-2 mb-4 rounded">
          {{ isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login' }}
        </button>
        <form @submit.prevent="handleSubmit">
          <input v-if="!isLogin" class="regular-input" v-model="firstName" type="text" placeholder="First Name" required />
          <input v-if="!isLogin" class="regular-input" v-model="lastName" type="text" placeholder="Last Name" required />
          <input class="regular-input" v-model="email" type="email" placeholder="Email" required />
          <template v-if="!isLogin">
            <select class="regular-input" v-model="role" required>
              <option value="">Select Role</option>
              <option value="surgeon">Surgeon</option>
              <option value="designer">Designer</option>
            </select>
          </template>
          <input class="regular-input" v-model="password" type="password" placeholder="Password" required />
          <button type="submit" class="rounded" :disabled="isLoading">
            {{ isLoading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up') }}
          </button>
        </form>
      </template>
      
      <template v-else>
        <h1 class="text-2xl font-bold mb-6">Complete Your Registration</h1>
        <p class="mb-4">Please provide an email and create a new password for your account.</p>
        <form @submit.prevent="handleCompleteSignUp">
          <input class="regular-input" v-model="newEmail" type="email" placeholder="Email" required />
          <input class="regular-input" v-model="newPassword" type="password" placeholder="New Password" required />
          <input class="regular-input" v-model="confirmPassword" type="password" placeholder="Confirm New Password" required />
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Completing Registration...' : 'Complete Registration' }}
          </button>
        </form>
      </template>
      
      <p v-if="errorMessage" class="text-red-5 mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>