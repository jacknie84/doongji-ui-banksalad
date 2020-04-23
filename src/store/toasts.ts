import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

const {
  actions: { push, remove },
  reducer,
} = createSlice({
  name: 'toast',
  initialState: [] as ToastsState,
  reducers: {
    push(state: ToastsState, action: PayloadAction<ToastMessage>) {
      return [...state, { ...action.payload, id: uuid(), show: true }]
    },
    remove(state: ToastsState, action: PayloadAction<string>) {
      const newState = [...state]
      const removeIndex = newState.findIndex(message => message.id === action.payload)
      newState.splice(removeIndex, 1)
      return newState
    },
  },
})

export default reducer

export { push, remove }

export type ToastsState = ToastState[]

export interface ToastState extends ToastMessage {
  id: string
  show: boolean
}

export interface ToastMessage {
  title?: string
  content: string
}
