<script setup>
import { computed } from 'vue'
import beforeImg from '../assets/img/before.png'
import afterImg from '../assets/img/after.png'

const props = defineProps({
  patient: Object,
})

const patientWithDefaults = computed(() => ({
  ...props.patient,
  beforeImg: props.patient.beforeImg || beforeImg,
  afterImg: props.patient.afterImg || afterImg,
}))
</script>

<template>
  <div class="patient">
    <h1 class="text-center mb-5">{{ patientWithDefaults.name }}</h1>
    <div class="flex">
      <div class="before-container group relative">
        <img class="transition-duration-300 group-hover:opacity-60" :src="patientWithDefaults.beforeImg" alt="After" />
        <button class="btn-primary opacity-0 group-hover:opacity-100 absolute top-[50%] left-[50%] transition-duration-300">Upload File</button>
      </div>
      <div class="after-container group relative">
        <img class="transition-duration-300 group-hover:opacity-60" :src="patientWithDefaults.afterImg" alt="After" />
        <button class="btn-primary opacity-0 group-hover:opacity-100 absolute top-[50%] left-[50%] transition-duration-300">Upload File</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.patient {
  @apply flex flex-col max-w-7xl mx-auto;

  img {
    @apply w-full object-contain group-hover:opacity-50 transition-duration-300;
  }

  .before-container,
  .after-container {
    button {
      transform: translate(-50%, -50%);
    }
  }
}
</style>
