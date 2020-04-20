import Axios from 'axios'
import paramsSerializer from './params-serializer'
import { composite } from './interceptors'
import store from '../../store'
import { update, DefaultProgressType } from '../../store/progress'

const baseURL = 'http://localhost:8080/v1'
const timeout = 10000
const onUploadProgress = (event: ProgressEvent) => onProgress(DefaultProgressType.UPLOAD, event)
const onDownloadProgress = (event: ProgressEvent) => onProgress(DefaultProgressType.DOWNLOAD, event)

const instance = Axios.create({ baseURL, timeout, paramsSerializer, onUploadProgress, onDownloadProgress })
instance.interceptors.request.use(composite.request(), composite.rejected())
instance.interceptors.response.use(composite.response(), composite.rejected())

export default {
  ...instance,
}

function onProgress(key: string, event: ProgressEvent) {
  const { lengthComputable, loaded, total } = event
  store.dispatch(update({ key, event: { lengthComputable, loaded, total } }))
}
