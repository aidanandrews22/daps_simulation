<template>
  <div>
    <h1>Patients List</h1>
    <NuxtLink class="btn-primary btn" to="/patients/add">New</NuxtLink>
    <div v-if="loading">Loading patients...</div>
    <ul v-else>
      <li v-for="patient in patients" :key="patient.id">
        <NuxtLink :to="`/patients/${patient.id}`"> {{ patient.name }} {{ patient }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from '~/composables/useFirestore'

const { getDocuments } = useFirestore()
const patients = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    patients.value = await getDocuments('patients')
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
})
</script>
