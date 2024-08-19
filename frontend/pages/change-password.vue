<template>
    <div class="page max-w-4xl">
      <ChangePasswordPrompt @passwordChanged="handlePasswordChanged" />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const handlePasswordChanged = () => {
    // Redirect to the home page or dashboard after password change
    router.push('/')
  }
  </script>