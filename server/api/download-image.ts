// server/api/download-image.js

import https from 'https'
import http from 'http'
import { createReadStream } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { imageUrl } = query

  return new Promise((resolve, reject) => {
    // Determine if the URL uses HTTPS or HTTP
    const protocol = imageUrl.startsWith('https') ? https : http

    protocol
      .get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch image. Status code: ${response.statusCode}`))
        } else {
          // Pass through the image data
          resolve(response)
        }
      })
      .on('error', (err) => {
        reject(err)
      })
  }).catch((error) => {
    console.error('Error fetching image:', error)
    return { error: error.message }
  })
})
