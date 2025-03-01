'use server'

export async function deleteImage(url: string) {
  try {
    // Extract the file name from the URL
    const fileName = url.split('/').pop()
    if (!fileName) return

    // Make a DELETE request to your upload API
    await fetch(`/api/upload/${fileName}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Failed to delete image:', error)
  }
}
