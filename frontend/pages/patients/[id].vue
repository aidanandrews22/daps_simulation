<template>
  <div class="page mx-auto px-4 pt-40 min-h-screen" v-if="allowedRoles.includes(userInfo.role) && userInfo.role !== 'patient'">
    <GoBackButton v-if="allowedRoles.includes(userInfo.role)" />

    <LoadingStatus v-if="patientLoading" />

    <div class="patient mt-5" v-else>
      <span class="name">{{ patient.firstName }} {{ patient.lastName }}</span>
      <div class="image-container-wrapper">
        <div class="before-container border-black border-0.5 border-r-solid;">
          <img :src="computedBeforeOrAfterImg(patient.beforeImg, 'before')" alt="Before" />
          <CustomFileUpload v-if="userInfo.role == 'surgeon'" @filePassToParent="changeImgAndSaveToDb" imgType="before" class="file-upload" :isLoading="uploadFileIsLoading" />
        </div>
        <div class="after-container">
          <img :src="computedBeforeOrAfterImg(patient.afterImg, 'after')" alt="After" />
          <CustomFileUpload v-if="userInfo.role == 'designer'" @filePassToParent="changeImgAndSaveToDb" imgType="after" class="file-upload" :isLoading="uploadFileIsLoading" />
        </div>
      </div>
      <div class="before-after-text">
        <h1>Before</h1>
        <h1>After</h1>
      </div>

      <DownloadButtons :uploadFileIsLoading="uploadFileIsLoading" :beforeImgUrl="patient.beforeImg" :afterImgUrl="patient.afterImg" />

      <CommentSection v-if="allowedRoles.includes(userInfo.role)" :patient="patient" />
    </div>
  </div>
  <div class="container mx-auto pt-40 px-4 py-8 min-h-screen" v-if="userInfo.role == 'patient'">
    <GoBackButton v-if="allowedRoles.includes(userInfo.role) && userInfo.role !== 'patient'" class="mb-6" />

    <LoadingStatus v-if="patientLoading" />

    <div v-else class="space-y-8">
      <h1 class="text-4xl font-bold text-center bg-white py-4 rounded-lg shadow-md">
        {{ patient.firstName }} {{ patient.lastName }}
      </h1>
      
      <div class="flex justify-center space-x-4">
        <button @click="toggleLayout" class="btn btn-primary btn-icon text-white font-bold py-2 px-4 rounded">
          {{ isSideBySide ? 'Stack Images' : 'Side by Side' }}
        </button>
        <button @click="toggleImage" v-if="!isSideBySide" class="btn btn-primary btn-icon text-white font-bold py-2 px-4 rounded">
          {{ showingBeforeImage ? 'Show After' : 'Show Before' }}
        </button>
      </div>

      <div :class="[containerClass, 'relative z-10 bg-white p-6 rounded-lg shadow-lg']">
        <div :class="[imageClass, 'relative']">
          <img 
            v-if="isSideBySide"
            :src="computedBeforeOrAfterImg(patient.beforeImg, 'before')" 
            alt="Before" 
            class="w-full h-auto object-contain max-h-[80vh] rounded-lg"
            :class="{ 'absolute inset-0 transition-opacity duration-500': !isSideBySide }"
            :style="{ opacity: isSideBySide || showingBeforeImage ? 1 : 0 }"
          />
          <img 
            v-if="!isSideBySide"
            :src="computedBeforeOrAfterImg(patient.beforeImg, 'before')" 
            alt="Before" 
            class="w-full h-auto object-contain max-h-[62vh] rounded-lg"
            :class="{ 'absolute inset-0 transition-opacity duration-500': !isSideBySide }"
            :style="{ opacity: isSideBySide || showingBeforeImage ? 1 : 0 }"
          />
          <img 
            v-if="!isSideBySide"
            :src="computedBeforeOrAfterImg(patient.afterImg, 'after')" 
            alt="After" 
            class="w-full h-auto object-contain max-h-[62vh] rounded-lg inset-0 transition-opacity duration-500"
            :style="{ opacity: showingBeforeImage ? 0 : 1 }"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center rounded-b-lg">
            <h2 class="text-xl font-semibold">{{ isSideBySide || showingBeforeImage ? 'Before' : 'After' }}</h2>
          </div>
        </div>
        <div v-if="isSideBySide" :class="imageClass">
          <img 
            :src="computedBeforeOrAfterImg(patient.afterImg, 'after')" 
            alt="After" 
            class="w-full h-auto object-contain max-h-[80vh] rounded-lg"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center rounded-b-lg">
            <h2 class="text-xl font-semibold">After</h2>
          </div>
        </div>
      </div>

      <DownloadButtons :beforeImgUrl="patient.beforeImg" :afterImgUrl="patient.afterImg" class="mt-6" />

      <CommentSection v-if="allowedRoles.includes(userInfo.role) && userInfo.role !== 'patient'" :patient="patient" class="mt-8 bg-white p-6 rounded-lg shadow-lg" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestore } from '~/composables/useFirestore'
import { useAuth } from '~/composables/useAuth'
import { computedBeforeOrAfterImg } from '~/composables/publicVariables'

const { userInfo } = useAuth()
const route = useRoute()
const { getDocument, updateDocument, uploadImage } = useFirestore()
const { createPatientAccount } = useAuth()
const uploadFileIsLoading = ref(false)

const patient = ref({})
const patientLoading = ref(true)
const isSideBySide = ref(false)
const showingBeforeImage = ref(true)

const allowedRoles = ['surgeon', 'designer']

onMounted(async () => {
  scrollToTop()

  try {
    patient.value = await getDocument('patients', route.params.id)
  } catch (error) {
    console.error('Error fetching patient:', error)
  } finally {
    patientLoading.value = false
  }
})

const toggleLayout = () => {
  isSideBySide.value = !isSideBySide.value
}

const toggleImage = () => {
  showingBeforeImage.value = !showingBeforeImage.value
}

const containerClass = computed(() => 
  isSideBySide.value = 'flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4'
)

const imageClass = computed(() => 
  isSideBySide.value = 'w-full md:w-1/2 max-w-md relative'
)

const changeImgAndSaveToDb = async (payload) => {
  let beforeImgURL = patient.value.beforeImg
  let afterImgURL = patient.value.afterImg

  uploadFileIsLoading.value = true

  try {
    if (payload.imgType === 'before') {
      patient.value.beforeImg = payload.file
      if (patient.value.beforeImg) {
        console.log('Uploading before image...')
        beforeImgURL = await uploadImage(patient.value.beforeImg, `patients/${route.params.id}/before.jpg`)
        console.log('Before Image URL:', beforeImgURL)
      }
    } else if (payload.imgType === 'after') {
      patient.value.afterImg = payload.file
      if (patient.value.afterImg) {
        console.log('Uploading after image...')
        afterImgURL = await uploadImage(patient.value.afterImg, `patients/${route.params.id}/after.jpg`)
        console.log('After Image URL:', afterImgURL)
      }
    }

    // Update the patient document with image URLs
    const updatedPatientData = {
      beforeImg: beforeImgURL,
      afterImg: afterImgURL,
    }

    console.log('Updated Patient Data:', updatedPatientData)

    // Update the document with image URLs
    const updateSuccess = await updateDocument('patients', route.params.id, updatedPatientData)
    if (updateSuccess) {
      console.log('Patient document updated with image URLs')
      patient.value.beforeImg = updatedPatientData.beforeImg
      patient.value.afterImg = updatedPatientData.afterImg
      alert('Image uploaded and patient data updated successfully!')
    } else {
      alert('Failed to update patient document with image URLs')
    }
  } catch (error) {
    console.error('Error uploading image or updating patient data:', error)
    alert('An error occurred while uploading the image or updating patient data. Please try again.')
  } finally {
    uploadFileIsLoading.value = false
  }
}

const createPatientUserAccount = async () => {
  try {
    const temporaryPassword = await createPatientAccount(route.params.id)
    alert(`Patient account created with temporary password: ${temporaryPassword}`)
    // You might want to display this information to the designer or send it to the patient via email
  } catch (error) {
    console.error('Error creating patient account:', error)
    alert('Failed to update patient document with image URLs')
  }
}
</script>