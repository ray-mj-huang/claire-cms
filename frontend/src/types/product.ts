import { Timestamp, FieldValue } from 'firebase/firestore'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string | null
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface FirestoreProduct {
  name: string
  price: number
  description: string
  image: string | null
  status: 'active' | 'inactive'
  createdAt: Timestamp | FieldValue | null
  updatedAt: Timestamp | FieldValue | null
}

export interface ProductFormData {
  name: string
  price: number
  description: string
  image: string | null
  status: 'active' | 'inactive'
} 