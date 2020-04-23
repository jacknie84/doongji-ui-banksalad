import doongjiApiClient from './doongji-api-client'
import { Selector, Page, PredicateOperator } from 'doongji-ui-banksalad'
import { isEmpty } from 'lodash'

export async function fetchById(id: number): Promise<RetrievedCondition> {
  const conditionEndpoint = `/retrieved-conditions/${id}`
  const predicatesEndpoint = `${conditionEndpoint}/predicates`
  const conditionPromise = doongjiApiClient.get<RetrievedCondition>(conditionEndpoint)
  const predicatesPromise = doongjiApiClient.get<RetrievedConditionPredicate[]>(predicatesEndpoint)
  const [{ data: condition }, { data: predicates }] = await Promise.all([conditionPromise, predicatesPromise])
  return { ...condition, predicates }
}

export async function fetchBySelector(selector: Selector) {
  const q = JSON.stringify(selector)
  const { status, headers, data = [] } = await doongjiApiClient.get('/retrieved-conditions', { params: { q } })
  return createPage<RetrievedCondition>(status, headers, data)
}

export function save(condition: RetrievedCondition): Promise<RetrievedCondition> {
  if (condition.id) {
    return put(condition.id, condition)
  } else {
    return post(condition)
  }
}

function createPage<T>(status: number, headers: any, content: T[]): Page<T> {
  if (status === 204 || isEmpty(content)) {
    return { totalCount: 0, content: [] }
  } else {
    return { totalCount: headers['x-total-count'] as number, content }
  }
}

async function post(condition: RetrievedCondition) {
  const { headers } = await doongjiApiClient.post('/retrieved-conditions', condition)
  const { data } = await doongjiApiClient.get(headers.location)
  await doongjiApiClient.put(`/retrieved-conditions/${data.id}/predicates`, condition.predicates)
  return data
}

async function put(id: number, condition: RetrievedCondition) {
  const conditionEndpoint = `/retrieved-conditions/${id}`
  const predicatesEndpoint = `${conditionEndpoint}/predicates`
  const conditionPromise = doongjiApiClient.put(conditionEndpoint, condition)
  const predicatesPromise = doongjiApiClient.put(predicatesEndpoint, condition.predicates)
  await Promise.all([conditionPromise, predicatesPromise])
  return condition
}

export interface RetrievedCondition {
  id?: number
  name: string
  favorite: boolean
  lastRetrievedDate?: string
  predicates?: RetrievedConditionPredicate[]
}

export interface RetrievedConditionPredicate {
  id?: number
  conditionId?: number
  fieldName: string
  operator: PredicateOperator
  fieldValues: string
}
