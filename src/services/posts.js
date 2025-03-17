import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export const createPost = async (postData) => {
  try {
    const postsRef = collection(db, 'posts')
    const newPost = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    const docRef = await addDoc(postsRef, newPost)
    
    // 獲取新創建的文檔以獲得正確的時間戳
    const newDocSnap = await getDoc(docRef)
    return {
      id: docRef.id,
      ...newDocSnap.data(),
      createdAt: newDocSnap.data().createdAt?.toDate(),
      updatedAt: newDocSnap.data().updatedAt?.toDate()
    }
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const fetchPosts = async () => {
  try {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const fetchPostById = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)
    
    if (!postSnap.exists()) {
      throw new Error('Post not found')
    }

    const data = postSnap.data()
    
    // 確保內容是字串
    const content = data.content || ''
    
    // 確保所有欄位都有合法值
    return {
      id: postSnap.id,
      title: data.title || '',
      content: content.toString(), // 強制轉換為字串
      coverImage: data.coverImage || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      status: data.status || 'draft',
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export const updatePost = async (postId, postData) => {
  try {
    const postRef = doc(db, 'posts', postId)
    const updatedPost = {
      ...postData,
      updatedAt: serverTimestamp()
    }
    await updateDoc(postRef, updatedPost)
    
    // 獲取更新後的文檔
    const updatedDocSnap = await getDoc(postRef)
    return {
      id: postId,
      ...updatedDocSnap.data(),
      createdAt: updatedDocSnap.data().createdAt?.toDate(),
      updatedAt: updatedDocSnap.data().updatedAt?.toDate()
    }
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
} 