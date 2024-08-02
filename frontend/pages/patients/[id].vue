<script setup>
import { useFirestore } from '~/composables/useFirestore'
import afterImgDefault from '@/assets/img/after.png'
import beforeImgDefault from '@/assets/img/before.png'

const route = useRoute()
const { getDocument, updateDocument, uploadImage } = useFirestore()
const patient = ref({})
const patientLoading = ref(true)
const commentLoading = ref(false)
const comment = ref('')
const notesRef = ref(null)
const uploadFileIsLoading = ref(false)

watch(notesRef, () => {
  notesRef.value.setAttribute('style', 'height:' + notesRef.value.scrollHeight + 'px;overflow-y:hidden;')
  notesRef.value.addEventListener(
    'input',
    function (e) {
      if (e.target.value != '') {
        this.style.height = 'auto'
        this.style.height = this.scrollHeight + 'px'
      } else {
        this.style.height = ''
      }
    },
    false
  )
})

onMounted(async () => {
  try {
    patient.value = await getDocument('patients', route.params.id)
    comment.value = patient.value.comment || ''
  } catch (error) {
    console.error('Error fetching patient:', error)
  } finally {
    patientLoading.value = false
  }
})

const computedBeforeImg = computed(() => {
  return patient.value.beforeImg ? patient.value.beforeImg : beforeImgDefault
})

const computedAfterImg = computed(() => {
  return patient.value.afterImg ? patient.value.afterImg : afterImgDefault
})

const saveComment = async () => {
  try {
    commentLoading.value = true
    await updateDocument('patients', route.params.id, { comment: comment.value })
    alert('Comment saved successfully!')
  } catch (error) {
    console.error('Error saving comment:', error)
    alert('Failed to save comment. Please try again.')
  } finally {
    commentLoading.value = false
  }
}

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
  <div>
    <button class="btn-primary btn" @click="$router.back()">Go back</button>
    <div v-if="patientLoading">
      <h1 class="text-center">Loading...</h1>
    </div>
    <div class="patient" v-else>
      <h1 class="text-center mb-5">{{ patient.name }}</h1>
      <div class="flex border-black border-solid border-0.5">
        <div class="before-container border-black border-0.5 border-r-solid">
          <img :src="computedBeforeImg" alt="Before" />
          <CustomFileUpload @filePassToParent="changeImgAndSaveToDb" imgType="before" class="file-upload" :isLoading="uploadFileIsLoading" />
        </div>
        <div class="after-container">
          <img :src="computedAfterImg" alt="After" />
          <CustomFileUpload @filePassToParent="changeImgAndSaveToDb" imgType="after" class="file-upload" :isLoading="uploadFileIsLoading" />
        </div>
      </div>
      <div class="before-after-text">
        <h1>Before</h1>
        <h1>After</h1>
      </div>

      <DownloadButtons :uploadFileIsLoading="uploadFileIsLoading" :beforeImgUrl="patient.beforeImg" :afterImgUrl="patient.afterImg" />

      <div class="comment-section mt-8">
        <h2 class="text-xl font-bold mb-2">Patient Notes</h2>
        <textarea :disabled="commentLoading" v-model="comment" ref="notesRef" placeholder="Enter notes about the patient here..."></textarea>
        <div class="mt-2 flex gap-x-4">
          <button v-if="commentLoading" class="btn-disabled btn-primary btn btn-icon" disabled>
            <span>Saving</span>
            <div class="i-mdi-loading animate-spin"></div>
          </button>
          <button v-else class="btn btn-primary btn btn-icon" @click="saveComment">
            <span>Save</span>
            <div class="i-mdi-tick"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.patient {
  @apply flex flex-col max-w-7xl mx-auto relative;

  .before-container,
  .after-container {
    @apply relative flex-1 group;

    img {
      @apply w-full h-full object-cover transition-opacity duration-300 ease-in-out;
    }

    &:hover {
      img {
        @apply opacity-50;
      }
    }

    &:hover .file-upload > button.upload-btn {
      @apply opacity-100;
    }
  }
}

.comment-section {
  @apply bg-gray-100 p-4 rounded-md;

  textarea {
    min-height: 100px;
    @apply w-full p-2 border border-gray-300 rounded-md resize-none;
  }

  textarea:disbaled {
    @apply text-white;
  }
}

.before-after-text {
  @apply flex text-center;

  h1 {
    @apply font-400 border-t-none text-2xl flex-1 py-2 border-solid border-black border-1;
  }

  h1:first-child {
    @apply border-r-none;
  }
}
</style>
