<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useFirestore } from '~/composables/useFirestore'

const { userInfo } = useAuth()

const props = defineProps({
  patient: {
    type: Object,
  },
  isInAddPatientPage: {
    type: Boolean,
    default: false,
  },
})

const { updateDocument } = useFirestore()

const notesRef = ref(null)
const commentLoading = ref(false)
const comment = ref('')

// Computed property for dynamic comment
const dynamicComment = computed({
  get() {
    return props.isInAddPatientPage ? props.patient.comment : comment.value
  },
  set(value) {
    if (props.isInAddPatientPage) {
      props.patient.comment = value
    } else {
      comment.value = value
    }
  },
})

// Function to set the textarea height
const setTextareaHeight = () => {
  if (notesRef.value) {
    notesRef.value.style.height = 'auto'
    notesRef.value.style.height = notesRef.value.scrollHeight + 'px'
  }
}

// Watch for changes in the textarea and adjust height
watch(dynamicComment, () => {
  nextTick(setTextareaHeight)
})

watch(notesRef, () => {
  notesRef.value.setAttribute('style', 'height:' + notesRef.value.scrollHeight + 'px;overflow-y:hidden;')
  if (notesRef.value) {
    setTextareaHeight()
    notesRef.value.addEventListener(
      'input',
      function () {
        setTextareaHeight()
      },
      false
    )
  }
})

// Set textarea height on component mount
onMounted(async () => {
  comment.value = props.patient.comment || ''
  await nextTick()
  setTextareaHeight()
})

const saveComment = async () => {
  try {
    commentLoading.value = true
    await updateDocument('patients', props.patient.id, { comment: comment.value })
    alert('Comment saved successfully!')
  } catch (error) {
    console.error('Error saving comment:', error)
    alert('Failed to save comment. Please try again.')
  } finally {
    commentLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="comment-section mt-8">
      <h2 class="text-xl font-bold mb-2">Patient Notes</h2>
      <textarea :disabled="commentLoading || userInfo.role == 'designer'" v-model="dynamicComment" ref="notesRef" placeholder="Enter notes about the patient here..."></textarea>
      <div v-if="!isInAddPatientPage && userInfo.role == 'surgeon'" class="mt-2 flex gap-x-4">
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
</template>
