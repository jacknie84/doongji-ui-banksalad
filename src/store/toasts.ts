import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const {
  actions: { push, empty },
  reducer,
} = createSlice({
  name: 'toast',
  initialState: [] as ToastsState,
  reducers: {
    push(state: ToastsState, action: PayloadAction<ToastPayload>) {
      return [...state, action.payload]
    },
    empty(state: ToastsState) {
      return []
    },
  },
})

export default reducer

export { push, empty }

export type ToastsState = ToastPayload[]

export interface ToastPayload {
  title?: string
  content: string
}
