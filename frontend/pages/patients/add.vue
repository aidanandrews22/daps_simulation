<script setup>
import { ref } from 'vue'
import { useFirestore } from '~/composables/useFirestore'
import { useRouter } from 'vue-router'

const { addDocument, uploadImage, updateDocument } = useFirestore()
const router = useRouter()

const patientInfo = ref({
  firstName: '',
  lastName: '',
  beforeImage: null,
  afterImage: null,
  comment: '',
})

const loading = ref(false)
const showBeforeImageError = ref(false)

const handleBeforeImage = (event) => {
  patientInfo.value.beforeImage = event.target.files[0]
  showBeforeImageError.value = !patientInfo.value.beforeImage
}

const addPatient = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    console.log('Before Image:', patientInfo.value.beforeImage)
    console.log('After Image:', patientInfo.value.afterImage)

    let beforeImgURL = null
    let afterImgURL = null

    // First, add the patient document to get the ID
    const patientData = {
      firstName: patientInfo.value.firstName,
      lastName: patientInfo.value.lastName,
      comment: patientInfo.value.comment,
    }

    console.log('Initial Patient Data:', patientData)

    // Add the document first to get the ID
    const docId = await addDocument('patients', patientData)
    console.log('Patient added successfully with ID:', docId)

    // Now upload images using the document ID
    if (patientInfo.value.beforeImage) {
      console.log('Uploading before image...')
      beforeImgURL = await uploadImage(patientInfo.value.beforeImage, `patients/${docId}/before.jpg`)
      console.log('Before Image URL:', beforeImgURL)
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
    patientInfo.value.firstName = ''
    patientInfo.value.lastName = ''
    patientInfo.value.beforeImage = null
    patientInfo.value.afterImage = null
    patientInfo.value.comment = ''
    // You might want to add some user feedback here, like showing a success message
  } catch (error) {
    console.error('Error adding patient:', error)
    // You might want to add some user feedback here, like showing an error message
  } finally {
    loading.value = false
    router.push('/patients')
  }
}

const validateForm = () => {
  if (!patientInfo.value.beforeImage) {
    showBeforeImageError.value = true
    return false
  }
  showBeforeImageError.value = false
  return true
}
</script>

<template>
  <div class="page max-w-4xl">
    <GoBackButton />

    <div class="flex flex-col items-center p-8 mt-10 lg:mt-20 bg-white rounded-lg shadow-xl mx-auto">
      <h1 class="text-2xl font-bold text-primary mb-6">Add Patient</h1>
      <form autocomplete="off" @submit.prevent="addPatient" class="w-full flex flex-col gap-y-4">
        <div>
          <label for="first-name" class="block text-gray-700 font-semibold mb-2">First Name</label>
          <input
            required
            type="text"
            id="first-name"
            v-model="patientInfo.firstName"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :disabled="loading" />
        </div>
        <div>
          <label for="last-name" class="block text-gray-700 font-semibold mb-2">Last Name</label>
          <input required :disabled="loading" type="text" id="last-name" v-model="patientInfo.lastName" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label for="before-image" class="block text-gray-700 font-semibold mb-2">Before Image</label>
          <div class="relative">
            <input accept="image/*" type="file" id="before-image" name="beforeImage" @change="handleBeforeImage" class="absolute top-0 left-0 opacity-0" :disabled="loading" required />
            <label :class="{ 'btn-disabled': loading }" for="before-image" class="btn btn-primary py-2">Choose File</label>
            <span v-if="patientInfo.beforeImage" class="ml-3 text-gray-700">{{ patientInfo.beforeImage.name }}</span>
            <span v-if="showBeforeImageError" class="text-red-500 ml-3">Please select an image.</span>
          </div>
        </div>
        <div>
          <CommentSection :patient="patientInfo" isInAddPatientPage="true" />
        </div>
        <button :disabled="loading" type="submit" class="w-full btn btn-primary mt-2 disabled:btn-disabled">
          <div v-if="loading" class="btn-icon">
            <span>Submitting...</span>
          </div>
          <div v-else>
            <span>Submit</span>
          </div>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.loading-indicator {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}
.text-red-500 {
  color: red;
}
</style>
