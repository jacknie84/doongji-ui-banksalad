import doongjiApiClient from './doongji-api-client'
import { Selector, Page } from 'doongji-ui-banksalad'
import { isEmpty } from 'lodash'

export const fetchBySelector = async (selector: Selector) => {
  const q = JSON.stringify(selector)
  const { status, headers, data = [] } = await doongjiApiClient.get('/household-accounts', { params: { q } })
  return createPage(status, headers, data)
}

function createPage<T>(status: number, headers: any, content: T[]): Page<T> {
  if (status === 204 || isEmpty(content)) {
    return { totalCount: 0, content: [] }
  } else {
    return { totalCount: headers['x-total-count'] as number, content }
  }
}
