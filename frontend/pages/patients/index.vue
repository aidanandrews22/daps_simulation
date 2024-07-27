<script setup>
const patients = ref([
  {
    name: 'Aidan Andrews',
    beforeImg: null,
    afterImg: 'https://assets.entrepreneur.com/content/3x2/2000/1680813141-GettyImages-850154658copy.jpg?format=pjeg&auto=webp&crop=16:9&width=675&height=380',
    notes: '',
  },
  {
    name: 'Ali Quliyev',
    beforeImg: 'https://assets.entrepreneur.com/content/3x2/2000/1680813141-GettyImages-850154658copy.jpg?format=pjeg&auto=webp&crop=16:9&width=675&height=380',
    afterImg: null,
    notes: '',
  },
])
</script>

<template>
  <div>
    <div v-for="patient in patients" :key="patient.name">
      <div></div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
