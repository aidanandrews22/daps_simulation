<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Change Your Password</h2>
        <p class="mb-4">Please create a new password for your account.</p>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="new-password"
              v-model="newPassword"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div class="mb-6">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Changing Password...' : 'Change Password' }}
          </button>
        </form>
        <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '~/composables/useAuth'
  
  const { changePassword } = useAuth()
  
  const newPassword = ref('')
  const confirmPassword = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const emit = defineEmits(['passwordChanged'])
  
  const handleSubmit = async () => {
    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
  
    try {
      isLoading.value = true
      await changePassword(newPassword.value)
      emit('passwordChanged')
    } catch (err) {
      error.value = 'Failed to change password. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
  </script>