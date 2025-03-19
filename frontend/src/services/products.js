import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'

// 輔助函數：轉換 Firestore 數據
const convertTimestamps = (doc) => {
  const data = doc.data()
  const converted = {
    id: doc.id,
    name: data.name || '',
    price: data.price || 0,
    description: data.description || '',
    image: data.image || null,
    status: data.status || 'active',
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : new Date().toISOString()
  }
  
  console.log('Converted product:', converted) // 添加日誌
  return converted
}

export const fetchProducts = async () => {
  try {
    const productsRef = collection(db, 'products')
    const snapshot = await getDocs(productsRef)
    
    // 轉換數據
    const products = snapshot.docs.map(convertTimestamps)
    console.log('Final products:', products) // 添加日誌
    
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const fetchProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId)
    const productSnap = await getDoc(productRef)
    
    if (!productSnap.exists()) {
      throw new Error('Product not found')
    }

    return convertTimestamps(productSnap)
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products')
    const newProduct = {
      name: productData.name,
      price: Number(productData.price),
      description: productData.description,
      image: productData.image,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(productsRef, newProduct)
    const newDocSnap = await getDoc(docRef)
    
    return convertTimestamps(newDocSnap)
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const uploadImage = async (file) => {
  try {
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file')
    }

    // 限制檔案大小 (例如: 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size should be less than 5MB')
    }

    const fileRef = ref(storage, `products/${Date.now()}-${file.name}`)
    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const updateProduct = async (productData) => {
  try {
    const { id, ...updateData } = productData
    const productRef = doc(db, 'products', id)
    
    const updatedProduct = {
      ...updateData,
      updatedAt: serverTimestamp()
    }
    
    await updateDoc(productRef, updatedProduct)
    
    // 獲取更新後的文檔
    const updatedDoc = await getDoc(productRef)
    return convertTimestamps(updatedDoc)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId)
    await deleteDoc(productRef)
    return productId
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
} 