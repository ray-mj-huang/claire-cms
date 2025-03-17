import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'
import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    products: productsReducer
  }
})

// 添加這行來檢查初始狀態
console.log('Initial store state:', store.getState())

export default store