<script setup>
import { useFirestore } from '~/composables/useFirestore'
import { computedBeforeOrAfterImg } from '~/composables/publicVariables'

const { userInfo } = useAuth()

const route = useRoute()
const { getDocument, updateDocument, uploadImage } = useFirestore()
const patient = ref({})
const patientLoading = ref(true)
const uploadFileIsLoading = ref(false)

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

const changeImgAndSaveToDb = async (payload) => {
  let beforeImgURL = patient.value.beforeImg
  let afterImgURL = patient.value.afterImg

  uploadFileIsLoading.value = true

  if (payload.imgType == 'before') {
    patient.value.beforeImg = payload.file
    try {
      if (patient.value.beforeImg) {
        console.log('Uploading before image...')
        beforeImgURL = await uploadImage(patient.value.beforeImg, `patients/${route.params.id}/before.jpg`)
        console.log('Before Image URL:', beforeImgURL)
      }
    } catch (error) {
      console.error('Error uploading before image:', error)
    }
  } else if (payload.imgType == 'after') {
    patient.value.afterImg = payload.file
    try {
      if (patient.value.afterImg) {
        console.log('Uploading after image...')
        afterImgURL = await uploadImage(patient.value.afterImg, `patients/${route.params.id}/after.jpg`)
        console.log('After Image URL:', afterImgURL)
      }
    } catch (error) {
      console.error('Error uploading after image:', error)
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
  } else {
    console.error('Failed to update patient document with image URLs')
  }

  uploadFileIsLoading.value = false
}
</script>

<template>
  <div class="page">
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
</template>

<style lang="scss"></style>
