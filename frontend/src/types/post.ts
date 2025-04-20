import { Timestamp, FieldValue } from 'firebase/firestore'

export interface Post {
  id: string
  title: string
  content: string
  coverImage: string | null
  tags: string[]
  status: 'draft' | 'published'
  createdAt: Date | null
  updatedAt: Date | null
}

export interface FirestorePost {
  title: string
  content: string
  coverImage: string | null
  tags: string[]
  status: 'draft' | 'published'
  createdAt: Timestamp | FieldValue | null
  updatedAt: Timestamp | FieldValue | null
}

export interface PostFormData {
  title: string
  content: string
  coverImage: string | null
  tags: string[]
  status: 'draft' | 'published'
} 