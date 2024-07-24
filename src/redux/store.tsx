import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './counterSlice/counterSlice'
import userSlice from './userSlice/userSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    user: userSlice
  },
})