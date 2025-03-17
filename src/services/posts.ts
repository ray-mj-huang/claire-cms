import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp, query, orderBy, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import { Post, PostFormData, FirestorePost } from '../types/post'

export const createPost = async (postData: PostFormData): Promise<Post> => {
  try {
    const postsRef = collection(db, 'posts')
    const newPost: FirestorePost = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    const docRef = await addDoc(postsRef, newPost)
    
    // 獲取新創建的文檔以獲得正確的時間戳
    const newDocSnap = await getDoc(docRef)
    const data = newDocSnap.data() as FirestorePost
    
    return {
      id: docRef.id,
      ...postData,
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    }
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
      const data = doc.data() as FirestorePost
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        coverImage: data.coverImage,
        tags: data.tags,
        status: data.status,
        createdAt: data.createdAt?.toDate() || null,
        updatedAt: data.updatedAt?.toDate() || null
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const fetchPostById = async (postId: string): Promise<Post> => {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)
    
    if (!postSnap.exists()) {
      throw new Error('Post not found')
    }

    const data = postSnap.data() as FirestorePost
    
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
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export const updatePost = async (postId: string, postData: Partial<PostFormData>): Promise<Post> => {
  try {
    const postRef = doc(db, 'posts', postId)
    const updatedPost = {
      ...postData,
      updatedAt: serverTimestamp()
    }
    await updateDoc(postRef, updatedPost)
    
    // 獲取更新後的文檔
    const updatedDocSnap = await getDoc(postRef)
    const data = updatedDocSnap.data() as FirestorePost
    
    return {
      id: postId,
      title: data.title,
      content: data.content,
      coverImage: data.coverImage,
      tags: data.tags,
      status: data.status,
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    }
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
} 