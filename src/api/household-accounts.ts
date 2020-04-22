import doongjiApiClient from './doongji-api-client'
import { Selector, Page } from 'doongji-ui-banksalad'
import { isEmpty } from 'lodash'

export const fetchBySelector = async (selector: Selector) => {
  const q = JSON.stringify(selector)
  const { status, headers, data = [] } = await doongjiApiClient.get('/household-accounts', { params: { q } })
  return createPage(status, headers, data)
}

export const put = (userId: string, excelFile: File, contents: HouseholdAccounts[]) => {
  const uploadPromise = doongjiApiClient({
    url: `/upload/shared-excels/${userId}`,
    method: 'put',
    headers: {
      'content-disposition': `attachment; filename*=utf-8''${encodeURIComponent(excelFile.name)}`,
      'content-type': excelFile.type || 'application/octet-stream',
    },
    data: excelFile,
  })
  const contentsPromise = doongjiApiClient.put(`/shared-excels/${userId}/contents`, contents, { timeout: 60000 })
  return Promise.all([uploadPromise, contentsPromise])
}

function createPage<T>(status: number, headers: any, content: T[]): Page<T> {
  if (status === 204 || isEmpty(content)) {
    return { totalCount: 0, content: [] }
  } else {
    return { totalCount: headers['x-total-count'] as number, content }
  }
}

export interface HouseholdAccounts {
  useDate: string
  useTime: string
  type: string
  category: string
  subCategory: string
  description: string
  useAmount: number
  useCurrency: string
  useObject: string
  userId: string
}
