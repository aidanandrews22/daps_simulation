<script setup>
import { jsPDF } from 'jspdf'

const props = defineProps({
  beforeImgUrl: {
    type: String,
    required: true,
  },
  afterImgUrl: {
    type: String,
    required: true,
  },
  uploadFileIsLoading: {
    type: Boolean,
  },
})

const loadingStatuses = ref({
  pdf: false,
  beforeImg: false,
  afterImg: false,
})

const turnOnOffFileDownloadStatus = (filetype, boolean) => {
  if (filetype == 'before') {
    loadingStatuses.value.beforeImg = boolean
  } else if (filetype == 'after') {
    loadingStatuses.value.afterImg = boolean
  }
}

const exportPDF = async () => {
  loadingStatuses.value.pdf = true

  const doc = new jsPDF()
  doc.text('Before and After', 20, 20)

  const fetchImageAsBase64 = async (url) => {
    try {
      const response = await fetch(`/api/image-to-base64?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      if (data.error) {
        console.error(data.error)
        return null
      }
      return data.base64Image
    } catch (error) {
      console.error('Error fetching the base64 image:', error)
      return null
    }
  }

  const beforeBase64 = await fetchImageAsBase64(props.beforeImgUrl)
  const afterBase64 = await fetchImageAsBase64(props.afterImgUrl)

  if (!beforeBase64 || !afterBase64) {
    return
  }

  const addImageToPDF = (imgData, x, y, maxWidth, maxHeight) => {
    const img = new Image()
    img.src = `data:image/jpeg;base64,${imgData}`

    return new Promise((resolve) => {
      img.onload = () => {
        const imgWidth = img.width
        const imgHeight = img.height
        const aspectRatio = imgWidth / imgHeight

        let scaledWidth = maxWidth
        let scaledHeight = maxWidth / aspectRatio

        if (scaledHeight > maxHeight) {
          scaledHeight = maxHeight
          scaledWidth = maxHeight * aspectRatio
        }

        doc.addImage(img, 'JPEG', x, y, scaledWidth, scaledHeight)
        resolve()
      }
    })
  }

  const pdfWidth = 200 // Width of the PDF page
  const pdfHeight = 290 // Height of the PDF page
  const imageWidth = pdfWidth / 2 - 5 // Half of the PDF width minus margin
  const imageHeight = pdfHeight / 2 - 5 // Adjust as needed

  await Promise.all([
    addImageToPDF(beforeBase64, 10, 30, imageWidth, imageHeight),
    addImageToPDF(afterBase64, 5 + imageWidth + 5, 30, imageWidth, imageHeight), // Add margin between images
  ])

  doc.save('before-after.pdf')

  loadingStatuses.value.pdf = false
}

const downloadImage = async (imageUrl, filetype) => {
  turnOnOffFileDownloadStatus(filetype, true)

  try {
    // Fetch the image through your server route
    const response = await fetch(`/api/download-image?imageUrl=${encodeURIComponent(imageUrl)}`)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Convert the response to a blob
    const blob = await response.blob()

    // Create a temporary link element
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filetype == 'before' ? 'before.png' : 'after.png'

    // Append the link to the body and trigger the download
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error downloading image:', error)
  }

  turnOnOffFileDownloadStatus(filetype, false)
}
</script>

<template>
  <div>
    <div class="flex justify-center mt-4 gap-x-2">
      <button v-if="loadingStatuses.pdf" class="btn btn-primary btn-icon btn-disabled" disabled>
        <span>PDF exporting</span>
        <div class="i-mdi-loading animate-spin"></div>
      </button>
      <button
        v-if="(loadingStatuses.pdf == false) & (beforeImgUrl != null) & (afterImgUrl != null)"
        :disabled="uploadFileIsLoading || loadingStatuses.beforeImg || loadingStatuses.afterImg || loadingStatuses.pdf"
        @click="exportPDF"
        class="btn btn-primary disabled:btn-disabled">
        PDF export
      </button>
      <button v-if="loadingStatuses.beforeImg" class="btn btn-primary btn-icon btn-disabled" disabled>
        <span>Raw image downloading (before)</span>
        <div class="i-mdi-loading animate-spin"></div>
      </button>
      <button
        v-if="loadingStatuses.beforeImg == false && beforeImgUrl"
        :disabled="uploadFileIsLoading || loadingStatuses.beforeImg || loadingStatuses.afterImg || loadingStatuses.pdf"
        @click="downloadImage(beforeImgUrl, 'before')"
        class="btn btn-primary disabled:btn-disabled">
        Raw image download (before)
      </button>
      <button v-if="loadingStatuses.afterImg" class="btn btn-primary btn-icon btn-disabled" disabled>
        <span>Raw image downloading (after)</span>
        <div class="i-mdi-loading animate-spin"></div>
      </button>
      <button
        v-if="loadingStatuses.afterImg == false && afterImgUrl"
        :disabled="uploadFileIsLoading || loadingStatuses.beforeImg || loadingStatuses.afterImg || loadingStatuses.pdf"
        @click="downloadImage(afterImgUrl, 'after')"
        class="btn btn-primary disabled:btn-disabled">
        Raw image download (after)
      </button>
    </div>
  </div>
</template>
