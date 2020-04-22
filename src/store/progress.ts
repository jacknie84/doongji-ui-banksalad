import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const {
  actions: { update },
  reducer,
} = createSlice({
  name: 'progress',
  initialState: {} as ProgressState,
  reducers: {
    update(state: ProgressState, action: PayloadAction<ProgressPayload>) {
      const { key, event } = action.payload
      const clone = { ...state } as ProgressState
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

export enum DefaultProgressType {
  UPLOAD = 'default.upload',
  DOWNLOAD = 'default.download',
}

export interface ProgressState {
  [key: string]: ProgressEvent
}

export interface ProgressPayload {
  key: string
  event: ProgressEvent
}

interface ProgressEvent {
  lengthComputable: boolean
  loaded: number
  total: number
  additional?: ProgressEventAdditional
}

type ProgressEventAdditional = { [key: string]: string | number | boolean | null | undefined | ProgressEventAdditional }
