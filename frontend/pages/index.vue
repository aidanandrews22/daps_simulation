<script setup>
const { documents: patients, isPending, error } = getCollection('patients')
</script>

<template>
  <div>
    <h1>{{ error }}</h1>
    <h1>{{ isPending }}</h1>
    <h1 v-if="patients">{{ patients }}</h1>
    <p>hello</p>
    <h1>THIS IS THE BEGINNING</h1>
    <NuxtLink to="/patients">patients</NuxtLink>
  </div>
</template>

<style scoped lang="scss"></style>
