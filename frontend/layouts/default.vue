<script setup>
const { $firebase } = useNuxtApp()
const currentUser = $firebase.auth.currentUser
</script>

<template>
  <div>
    <Navbar />
    <NuxtPage class="pt-45" />
    <Footer />
  </div>
</template>
