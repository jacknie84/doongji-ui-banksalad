import doongjiApiClient from './doongji-api-client'
import { Condition } from 'doongji-ui-banksalad'

export async function fetchGroupBy(type: GroupBy, condition: Condition): Promise<StatisticsAmount[]> {
  const q = JSON.stringify({ condition })
  const { data } = await doongjiApiClient.get(`/statistics/${type}`, { params: { q } })
  return data
}

export type GroupBy =
  | 'year'
  | 'month'
  | 'day'
  | 'day-of-week'
  | 'hour'
  | 'type'
  | 'category'
  | 'sub-category'
  | 'use-object'
  | 'user-id'

export interface StatisticsAmount {
  group: string
  totalAmount: number
}
