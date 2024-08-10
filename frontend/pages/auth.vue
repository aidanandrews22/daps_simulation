<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { login, signUp, isAuthenticated, errorMessage, isLoading } = useAuth()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const role = ref('')
const name = ref('')
const surname = ref('')

// Redirect authenticated users away from the auth page
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

// Add the missing toggleAuthMode function
const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  // Reset form fields when toggling
  email.value = ''
  password.value = ''
  role.value = ''
  name.value = ''
  surname.value = ''
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
    } else {
      await signUp(email.value, password.value, role.value, name.value, surname.value)
    }
    // Redirect to home page or dashboard
    navigateTo('/')
  } catch (err) {
    console.error('error', err)
  }
}
</script>

<template>
  <div class="page max-w-4xl">
    <div class="form-container">
      <h1>{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
      <button @click="toggleAuthMode" class="btn btn-primary mt-2 mb-4">
        {{ isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login' }}
      </button>
      <form @submit.prevent="handleSubmit">
        <input class="regular-input" v-model="email" type="email" placeholder="Email" required />
        <input class="regular-input" v-model="password" type="password" placeholder="Password" required />
        <template v-if="!isLogin">
          <input class="regular-input" v-model="name" type="text" placeholder="Name" required />
          <input class="regular-input" v-model="surname" type="text" placeholder="Surname" required />
          <select class="regular-input" v-model="role" required>
            <option value="surgeon">Surgeon</option>
            <option value="designer">Designer</option>
            <option value="patient">Patient</option>
          </select>
        </template>
        <button type="submit" v-if="isLogin && !isLoading">Login</button>
        <button type="submit" v-if="isLogin && isLoading" disabled>Logging in...</button>
        <button type="submit" v-if="!isLogin && !isLoading">Sign up</button>
        <button type="submit" v-if="!isLogin && isLoading" disabled>Signing up...</button>
        <p v-if="errorMessage" class="text-red-5">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
