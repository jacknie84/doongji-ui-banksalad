import { createSlice } from '@reduxjs/toolkit'

const {
  actions: { update },
  reducer,
} = createSlice({
  name: 'progress',
  initialState: {},
  reducers: {
    update(state, action) {
      const { key, event } = action.payload
      const clone = { ...state } as any
      if (isComplete(event)) {
        delete clone[key]
      } else {
        clone[key] = event
      }
      return clone
    },
  },
})

function isComplete(event: ProgressEvent): boolean {
  if (event.lengthComputable) {
    return event.loaded >= event.total
  } else {
    return true
  }
}

export default reducer

export { update }

interface ProgressEvent {
  lengthComputable: boolean
  loaded: number
  total: number
}
