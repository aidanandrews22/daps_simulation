import { defineEventHandler, getQuery } from 'h3'
import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url) {
    return {
      error: 'URL parameter is required',
    }
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return {
        error: `Failed to fetch image: ${response.statusText}`,
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')

    return {
      base64Image,
    }
  } catch (error) {
    return {
      error: `Failed to fetch image: ${error.message}`,
    }
  }
})
