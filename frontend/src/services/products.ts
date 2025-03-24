import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp, updateDoc, deleteDoc, DocumentSnapshot, Timestamp, FieldValue } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { Product, FirestoreProduct, ProductFormData } from '../types/product'

const toDate = (timestamp: Timestamp | FieldValue | null): Date | null => {
  return timestamp instanceof Timestamp ? timestamp.toDate() : null
}

// 輔助函數：轉換 Firestore 數據
const convertTimestamps = (doc: DocumentSnapshot): Product => {
  const data = doc.data() as FirestoreProduct
  const converted: Product = {
    id: doc.id,
    name: data.name || '',
    price: data.price || 0,
    description: data.description || '',
    image: data.image || null,
    status: data.status || 'active',
    createdAt: toDate(data.createdAt)?.toISOString() || new Date().toISOString(),
    updatedAt: toDate(data.updatedAt)?.toISOString() || new Date().toISOString()
  }
  
  console.log('Converted product:', converted) // 添加日誌
  return converted
}

export const fetchProducts = async (): Promise<Product[]> => {
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

export const fetchProductById = async (productId: string): Promise<Product> => {
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

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
    const productsRef = collection(db, 'products')
    const newProduct: FirestoreProduct = {
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

export const uploadImage = async (file: File): Promise<string> => {
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

export const updateProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const { id, ...updateData } = productData
    
    if (!id) {
      throw new Error('Product ID is required for update')
    }
    
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

export const deleteProduct = async (productId: string): Promise<string> => {
  try {
    const productRef = doc(db, 'products', productId)
    await deleteDoc(productRef)
    return productId
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
} 