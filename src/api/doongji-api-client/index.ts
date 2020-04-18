import Axios from 'axios'
import paramsSerializer from './params-serializer'
import { composite } from './interceptors'
import { update } from '../../store/progress'

const baseURL = 'http://localhost:8080/v1'
const timeout = 10000
const onUploadProgress = (event: ProgressEvent) => update({ key: 'default.upload', event })
const onDownloadProgress = (event: ProgressEvent) => update({ key: 'default.download', event })

const instance = Axios.create({ baseURL, timeout, paramsSerializer, onUploadProgress, onDownloadProgress })
instance.interceptors.request.use(composite.request(), composite.rejected())
instance.interceptors.response.use(composite.response(), composite.rejected())

export default {
  ...instance,
}
