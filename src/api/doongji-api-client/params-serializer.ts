import Qs from 'qs'

export default (params: any) => Qs.stringify(params, { indices: false, allowDots: true })
