import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeType = 'light' | 'dark';
type LanguageType = 'en' | 'zh';

interface SettingsState {
  theme: ThemeType;
  language: LanguageType;
  siteTitle: string;
  siteDescription: string;
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  siteTitle: 'My Blog',
  siteDescription: 'A personal blog about technology and life',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload }
    },
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<LanguageType>) => {
      state.language = action.payload
    },
  },
})

export const { updateSettings, setTheme, setLanguage } = settingsSlice.actions
export default settingsSlice.reducer 