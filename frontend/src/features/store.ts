import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './posts/postsSlice'
import productsReducer from './products/productsSlice'
import authReducer from './auth/authSlice'
import settingsReducer from './settings/settingsSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    products: productsReducer,
    auth: authReducer,
    settings: settingsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store 