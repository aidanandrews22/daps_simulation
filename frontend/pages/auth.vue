<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { login, signUp } = useAuth()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const role = ref('')

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
    } else {
      await signUp(email.value, password.value, role.value)
    }
    // Redirect to home page or dashboard
    navigateTo('/')
  } catch (error) {
    console.error('Authentication error:', error)
    // Handle error (show message to user, etc.)
  }
}
</script>

<template>
  <div>
    <h1>{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <select v-if="!isLogin" v-model="role" required>
        <option value="surgeon">Surgeon</option>
        <option value="designer">Designer</option>
        <option value="patient">Patient</option>
      </select>
      <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
    </form>
    <button @click="toggleAuthMode">
      {{ isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login' }}
    </button>
  </div>
</template>
