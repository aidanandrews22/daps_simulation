<script setup>
import { useFirestore } from '~/composables/useFirestore'

const { addDocument, uploadImage, updateDocument } = useFirestore()

const patientName = ref('')
const beforeImage = ref(null)
const afterImage = ref(null)
const isLoading = ref(false)

const handleBeforeImage = (event) => {
  beforeImage.value = event.target.files[0]
}

const handleAfterImage = (event) => {
  afterImage.value = event.target.files[0]
}

const addPatient = async () => {
  isLoading.value = true
  try {
    console.log('Before Image:', beforeImage.value)
    console.log('After Image:', afterImage.value)

    let beforeImgURL = null
    let afterImgURL = null

    // First, add the patient document to get the ID
    const patientData = {
      name: patientName.value,
      // Add other patient data here if needed
    }

    console.log('Initial Patient Data:', patientData)

    // Add the document first to get the ID
    const docId = await addDocument('patients', patientData)
    console.log('Patient added successfully with ID:', docId)

    // Now upload images using the document ID
    if (beforeImage.value) {
      console.log('Uploading before image...')
      beforeImgURL = await uploadImage(beforeImage.value, `patients/${docId}/before.jpg`)
      console.log('Before Image URL:', beforeImgURL)
    }

    if (afterImage.value) {
      console.log('Uploading after image...')
      afterImgURL = await uploadImage(afterImage.value, `patients/${docId}/after.jpg`)
      console.log('After Image URL:', afterImgURL)
    }

    // Update the patient document with image URLs
    const updatedPatientData = {
      beforeImg: beforeImgURL,
      afterImg: afterImgURL,
    }

    console.log('Updated Patient Data:', updatedPatientData)

    // Update the document with image URLs
    const updateSuccess = await updateDocument('patients', docId, updatedPatientData)
    if (updateSuccess) {
      console.log('Patient document updated with image URLs')
    } else {
      console.error('Failed to update patient document with image URLs')
    }

    // Reset form
    patientName.value = ''
    beforeImage.value = null
    afterImage.value = null
    // You might want to add some user feedback here, like showing a success message
  } catch (error) {
    console.error('Error adding patient:', error)
    // You might want to add some user feedback here, like showing an error message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Add Patient</h1>
    <button class="btn-primary btn" @click="$router.back()">Go back</button>

    <form @submit.prevent="addPatient">
      <input required v-model="patientName" placeholder="Patient Name" :disabled="isLoading" />
      <input type="file" @change="handleBeforeImage" accept="image/*" :disabled="isLoading" />
      <input type="file" @change="handleAfterImage" accept="image/*" :disabled="isLoading" />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Adding Patient...' : 'Add Patient' }}
      </button>
    </form>
    <div v-if="isLoading" class="loading-indicator">Loading...</div>
  </div>
</template>

<style scoped>
.loading-indicator {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}
</style>
