import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { isEmpty } from 'lodash'

export const composite = {
  request: (...interceptors: Interceptor<AxiosRequestConfig>[]) => async (config: AxiosRequestConfig) => {
    if (isEmpty(interceptors)) {
      return config
    }
    const context = new InterceptorContext('request', { config })
    await executeAsync(context, interceptors)
    return config
  },
  response: (...interceptors: Interceptor<AxiosResponse<any>>[]) => async (response: AxiosResponse<any>) => {
    if (isEmpty(interceptors)) {
      return response
    }
    const context = new InterceptorContext('response', { response })
    await executeAsync(context, interceptors)
    return response
  },
  rejected: (...interceptors: Interceptor<any>[]) => async (error: any) => {
    if (isEmpty(interceptors)) {
      throw error
    }
    const context = new InterceptorContext('reject', { error })
    await executeAsync(context, interceptors)
    error.rejectContext = context
    throw error
  },
}

async function executeAsync<T>(context: InterceptorContext, interceptors: Interceptor<T>[]) {
  for (let index = 0; index < interceptors.length; index++) {
    const interceptor = interceptors[index]
    try {
      const result = await interceptor.intercept(context)
      context.addHistory(index, interceptor, result)
    } catch (error) {
      context.addHistory(index, interceptor, error)
      throw context.error(error)
    }
    if (context.isSuspend()) {
      break
    }
  }
}

interface Interceptor<T> {
  name: string
  intercept: (param: InterceptorContext) => Promise<T>
}

class InterceptorContext {
  private type: string
  private history: InterceptorHistory[]
  private stop: boolean

  constructor(type: string, parameters: any) {
    this.type = type
    this.history = []
    this.stop = false
  }

  addHistory(index: number, interceptor: Interceptor<any>, result: any) {
    this.history.push({ index, interceptorName: interceptor.name, timestamp: new Date().toJSON(), result })
  }

  error(cause: any): InterceptorContextError {
    return {
      name: 'InterceptorContextError',
      message: cause.message || 'InterceptorContextError',
      cause,
      context: this,
    }
  }

  suspend(): boolean {
    return (this.stop = true)
  }

  isSuspend(): boolean {
    return this.stop
  }
}

interface InterceptorContextError extends Error {
  cause: any
  context: InterceptorContext
}

interface InterceptorHistory {
  index: number
  interceptorName: string
  timestamp: string
  result: any
}
