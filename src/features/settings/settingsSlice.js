import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  language: 'en',
  siteTitle: 'My Blog',
  siteDescription: 'A personal blog about technology and life',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      return { ...state, ...action.payload }
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
  },
})

export const { updateSettings, setTheme, setLanguage } = settingsSlice.actions
export default settingsSlice.reducer 