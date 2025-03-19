import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export const uploadImage = async (file) => {
  try {
    const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 