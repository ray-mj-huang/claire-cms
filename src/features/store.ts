import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './posts/postsSlice'
import productsReducer from './products/productsSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    products: productsReducer
  }
})

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 添加這行來檢查初始狀態
console.log('Initial store state:', store.getState())

export default store 