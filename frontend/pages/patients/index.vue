<script setup>
import { ref, onMounted } from 'vue'
import { useFirestore } from '~/composables/useFirestore'

const { getDocuments } = useFirestore()
const patients = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    patients.value = await getDocuments('patients')
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div class="flex flex-row gap-x-4 items-center">
      <h1>Patients List</h1>
      <NuxtLink class="btn-primary btn" to="/patients/add">
        <span>New</span>
      </NuxtLink>
    </div>
    <LoadingStatus v-if="loading" />
    <ul v-else class="mt-5 flex flex-col gap-y-10">
      <li v-for="patient in patients" class="patient" :key="patient.id">
        <span class="name">{{ patient.name }}</span>

        <div class="image-container-wrapper">
          <div class="after-container">
            <img :src="patient.beforeImg" alt="" />
          </div>

          <div class="before-container">
            <img :src="patient.afterImg" alt="" />
          </div>
        </div>

        <NuxtLink :to="`/patients/${patient.id}`" class="details-button">
          <span>Go to details</span>
          <div class="i-mdi:arrow-right"></div>
        </NuxtLink>

        <div class="before-after-text">
          <h1>Before</h1>
          <h1>After</h1>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.patient {
  @apply relative flex group;

  &:hover {
    img {
      @apply opacity-50;
    }
  }

  &:hover .details-button {
    @apply opacity-100;
  }

  .details-button {
    @apply btn btn-primary btn-icon max-w-xs text-ellipsis overflow-hidden whitespace-nowrap absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-in-out;
  }
}
</style>
