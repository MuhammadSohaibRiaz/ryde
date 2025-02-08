import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/AuthSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    devTools: true,
  })
}