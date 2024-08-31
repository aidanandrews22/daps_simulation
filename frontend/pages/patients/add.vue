<script setup>
import { ref } from 'vue'
import { useFirestore } from '~/composables/useFirestore'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const { addDocument, uploadImage, updateDocument } = useFirestore()
const { createPatientAccount, user } = useAuth()
const router = useRouter()

const patientInfo = ref({
  firstName: '',
  lastName: '',
  email: '', // Added email field
  beforeImage: null,
  afterImage: null,
  comment: '',
})

const loading = ref(false)
const showBeforeImageError = ref(false)
const temporaryPassword = ref('')

const handleBeforeImage = (event) => {
  patientInfo.value.beforeImage = event.target.files[0]
  showBeforeImageError.value = !patientInfo.value.beforeImage
}

const handleAfterImage = (event) => {
  patientInfo.value.afterImage = event.target.files[0]
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
      firstName: patientInfo.value.firstName.toLowerCase(),
      lastName: patientInfo.value.lastName.toLowerCase(),
      email: patientInfo.value.email.toLowerCase(), // Added email
      comment: patientInfo.value.comment,
      accountCreated: false,
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

    if (patientInfo.value.afterImage) {
      console.log('Uploading after image...')
      afterImgURL = await uploadImage(patientInfo.value.afterImage, `patients/${docId}/after.jpg`)
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

    // Create patient account
    temporaryPassword.value = await createPatientAccount(docId, patientInfo.value.email)

    // Show success message with temporary password
    alert(`Patient added successfully!`)

    // Navigate back to the patient list
    router.push('/')
  } catch (error) {
    console.error('Error adding patient:', error)
    alert('Error adding patient. Please try again.')
  } finally {
    loading.value = false
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

    <div class="form-container">
      <h1 class="text-2xl font-bold text-primary mb-6">Add Patient</h1>
      <form autocomplete="off" @submit.prevent="addPatient">
        <div>
          <label for="first-name" class="form-label">First Name</label>
          <input required type="text" id="first-name" v-model="patientInfo.firstName" class="regular-input" :disabled="loading" />
        </div>
        <div>
          <label for="last-name" class="form-label">Last Name</label>
          <input required :disabled="loading" type="text" id="last-name" v-model="patientInfo.lastName" class="regular-input" />
        </div>
        <div>
          <label for="email" class="form-label">Email</label>
          <input required :disabled="loading" type="email" id="email" v-model="patientInfo.email" class="regular-input" />
        </div>
        <div>
          <label for="before-image" class="form-label">Before Image</label>
          <div class="relative">
            <input accept="image/*" type="file" id="before-image" name="beforeImage" @change="handleBeforeImage" class="absolute top-0 left-0 opacity-0" :disabled="loading" required />
            <label :class="{ 'btn-disabled': loading }" for="before-image" class="btn btn-primary py-2">Choose File</label>
            <span v-if="patientInfo.beforeImage" class="ml-3 text-gray-700">{{ patientInfo.beforeImage.name }}</span>
            <span v-if="showBeforeImageError" class="text-red-500 ml-3">Please select an image.</span>
          </div>
        </div>
        <div>
          <label for="after-image" class="form-label">After Image</label>
          <div class="relative">
            <input accept="image/*" type="file" id="after-image" name="afterImage" @change="handleAfterImage" class="absolute top-0 left-0 opacity-0" :disabled="loading" />
            <label :class="{ 'btn-disabled': loading }" for="after-image" class="btn btn-primary py-2">Choose File</label>
            <span v-if="patientInfo.afterImage" class="ml-3 text-gray-700">{{ patientInfo.afterImage.name }}</span>
          </div>
        </div>
        <div>
          <CommentSection :patient="patientInfo" isInAddPatientPage="true" />
        </div>
        <button :disabled="loading" type="submit">
          <div v-if="loading" class="btn-icon">
            <span>Submitting...</span>
          </div>
          <div v-else>
            <span>Submit</span>
          </div>
        </button>
      </form>
      <div v-if="temporaryPassword" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        <p>Patient account created successfully!</p>
        <p>Temporary password: {{ temporaryPassword }}</p>
        <p>Please provide this password to the patient along with their email for login.</p>
      </div>
    </div>
  </div>
</template>