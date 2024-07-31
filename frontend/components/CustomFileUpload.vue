<template>
  <div>
    <button v-if="isLoading" class="upload-btn btn-icon">
      <span>Uploading</span>
      <div class="i-mdi-loading animate-spin"></div>
    </button>
    <button v-else @click="triggerFileInput" class="upload-btn">Upload file</button>
    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" :disabled="isLoading" class="hidden" />
  </div>
</template>

<script setup>
const props = defineProps({
  imgType: {
    type: String,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
})

const fileInput = ref(null)

const emit = defineEmits(['filePassToParent'])

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = () => {
  const files = fileInput.value.files
  if (files.length > 0) {
    emit('filePassToParent', { file: fileInput.value.files[0], imgType: props.imgType })
  }
}
</script>

<style scoped lang="scss">
.upload-btn {
  @apply btn btn-primary max-w-xs text-ellipsis overflow-hidden whitespace-nowrap absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-in-out;
}
</style>
