import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export const uploadImage = async (file: File, path: string = 'posts'): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file')
    }

    // Limit file size (e.g., 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size should be less than 5MB')
    }

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`
    const fileRef = ref(storage, `${path}/${filename}`)
    
    // Upload the file
    await uploadBytes(fileRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 