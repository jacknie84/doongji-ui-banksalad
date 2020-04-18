import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'progress',
  initialState: {},
  reducers: {
    update(state, action) {
      const { key, event } = action.payload
      return { ...state, [key]: event }
    },
    remove(state, action) {
      const { key } = action.payload
      const clone = { ...state } as any
      delete clone[key]
      return clone
    },
  },
})

const { update, remove } = slice.actions

export default slice.reducer

export { update, remove }
